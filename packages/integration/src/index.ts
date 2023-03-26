import type { AstroIntegration, AstroConfig } from 'astro';
import type { Plugin } from 'vite';
import { parse } from '@astrojs/compiler';
import { walk, is, serialize } from '@astrojs/compiler/utils';
import kleur from 'kleur';
import { type ExportSpecifier, init, parse as parseESM } from 'es-module-lexer';

// release attempt
type IntegrationOptions = {
    silenceLogs?: boolean;
};
export default function integration(
    { silenceLogs = false }: IntegrationOptions = {
        silenceLogs: false,
    }
): AstroIntegration {
    const { setAstroConfig, getVitePluginInjector } = createVitePluginInjector({
        silenceLogs,
    });
    return {
        name: 'astro-default-prerender',
        hooks: {
            'astro:config:setup': async ({ updateConfig }) => {
                updateConfig({
                    vite: {
                        plugins: [getVitePluginInjector()],
                    },
                });
            },
            'astro:config:done': ({ config }) => {
                setAstroConfig(config);
            },
        },
    };
}

function createVitePluginInjector(opts: IntegrationOptions) {
    let resolver: (value: AstroConfig) => void;
    let astroConfigPromise = new Promise<AstroConfig>((resolve) => {
        resolver = resolve;
    });

    return {
        setAstroConfig,
        getVitePluginInjector,
    };

    function setAstroConfig(config: AstroConfig) {
        resolver(config);
    }

    async function getVitePluginInjector(): Promise<Plugin | null> {
        const astroConfig = await astroConfigPromise;

        if (astroConfig.output !== 'server') {
            log(
                'warn',
                'This plugin can only have effect when `output` is set to `server` as prerendering is only supported in server mode. Skipping',
                opts.silenceLogs
            );
            return null;
        }

        if (!astroConfig.adapter) {
            log(
                'warn',
                'This plugin can only have effect when using an adapter. Skipping',
                opts.silenceLogs
            );
            return null;
        }

        return {
            name: 'vite-plugin-astro-default-prerender-injector',
            configResolved(resolved) {
                // TODO: limit this to only run once
                (resolved.plugins as Plugin[]).unshift(getVitePlugin());
            },
        };
    }

    function getVitePlugin(): Plugin {
        return {
            name: 'vite-plugin-astro-default-prerender',
            async transform(code, id) {
                if (!id.endsWith('.astro')) return;

                // use regexes to parse frontmatter?
                const { ast } = await parse(code);
                let foundFrontmatter = false;
                let didChange = false;
                await init;

                walk(ast, async (node) => {
                    if (foundFrontmatter) return;
                    if (is.frontmatter(node)) {
                        log(
                            'info',
                            'Found frontmatter, injecting `prerender` export',
                            opts.silenceLogs
                        );
                        foundFrontmatter = true;
                        let exports: readonly ExportSpecifier[] | undefined;
                        try {
                            [, exports] = parseESM(node.value);
                        } catch (e) {
                            log('error', 'Error parsing ESM exports, skipping');
                            return;
                        }
                        // if there's a `prerender` export, return
                        if (exports.some((e) => e.n === 'prerender')) {
                            log(
                                'warn',
                                'Found a `prerender` export, skipping',
                                opts.silenceLogs
                            );
                            return;
                        }
                        node.value = `\nexport const prerender = true;\n${node.value}`;
                        log('info', 'Added `prerender` export to frontmatter');
                        didChange = true;
                    }
                });

                // TODO: make a PR to add a `asyncWalk` utility function so
                // that we can await it instead of using a timeout
                // to wait for the "walk" call to complete
                await wait(1000);
                if (!didChange) return;

                const result = serialize(ast);
                console.log(result);

                return result;
            },
        };
    }
}

async function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, ms);
    });
}

const dateTimeFormat = new Intl.DateTimeFormat([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
});

function log(
    type: 'info' | 'warn' | 'error',
    message: string,
    /**
     * If true, don't log anything. Errors should not be silenced.
     */
    silent: boolean = false
) {
    if (silent) return;
    const date = dateTimeFormat.format(new Date());
    const messageColor =
        type === 'error'
            ? kleur.red
            : type === 'warn'
            ? kleur.yellow
            : kleur.cyan;
    console.log(
        `${kleur.gray(date)} ${messageColor(
            kleur.bold('[astro-default-preprender]')
        )} ${messageColor(message)}`
    );
}
