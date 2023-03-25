import type { AstroIntegration } from 'astro';
import type { Plugin } from 'vite';
import { parse } from '@astrojs/compiler';
import { walk, is, serialize } from '@astrojs/compiler/utils';
import kleur from 'kleur';
import { type ExportSpecifier, init, parse as parseESM } from 'es-module-lexer';

export default function integration(): AstroIntegration {
    return {
        name: 'astro-default-prerender',
        hooks: {
            'astro:config:setup': async ({ updateConfig }) => {
                updateConfig({
                    vite: { plugins: [getVitePluginInjector()] },
                });
            },
        },
    };
}

function getVitePluginInjector(): Plugin {
    let isHooked = false;
    return {
        name: 'vite-plugin-astro-default-prerender-injector',
        configResolved(resolved) {
            // TODO: limit this to only run once
        },
    };
}

function getVitePlugin(): Plugin {
    return {
        name: 'vite-plugin-astro-default-prerender',
        async transform(code, id) {
            if (!id.endsWith('.astro')) return;
            const { ast } = await parse(code);
            let foundFrontmatter = false;
            let didChange = false;
            await init;
            walk(ast, async (node) => {
                if (foundFrontmatter) return;
                if (is.frontmatter(node)) {
                    foundFrontmatter = true;
                    // could regexes be enough here?
                    let exports: readonly ExportSpecifier[] | undefined;
                    try {
                        [, exports] = parseESM(node.value);
                    } catch (e) {
                        return;
                    }
                    // if there's a `prerender` export, return
                    if (exports.some((e) => e.n === 'prerender')) {
                        return;
                    }
                    node.value = `\nexport const prerender = true;\n${node.value}`;
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

function logger(type: 'info' | 'warn' | 'error', message: string) {
    const date = dateTimeFormat.format(new Date());
    const messageColor =
        type === 'error'
            ? kleur.red
            : type === 'warn'
            ? kleur.yellow
            : kleur.white;
    console.log(
        `${kleur.gray(date)} ${kleur.bold(
            '[astro-default-preprender]'
        )} ${messageColor(message)}`
    );
}
