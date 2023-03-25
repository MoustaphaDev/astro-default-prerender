import type { AstroIntegration } from 'astro';
import { parse } from '@astrojs/compiler';
import { walk, is, serialize } from '@astrojs/compiler/utils';
import type { Plugin } from 'vite';
import kleur from 'kleur';

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
        name: 'vite-plugin-astro-prerender-injector',
        configResolved(resolved) {
            if (isHooked) return;
            (resolved.plugins as Plugin[]).unshift(getVitePlugin());
            isHooked = true;
        },
    };
}

function getVitePlugin(): Plugin {
    return {
        name: 'vite-plugin-astro-prerender',
        async transform(code, id) {
            if (!id.endsWith('.astro')) return;
            const { ast } = await parse(code);
            let foundFrontmatter = false;
            walk(ast, (node) => {
                if (foundFrontmatter) return;
                if (is.frontmatter(node)) {
                    foundFrontmatter = true;
                    // TODO: use es-module-lexer to catch false possitives?
                    // if (node.value.includes('export const prerender = true;'))
                    //     return;
                    node.value += `export const prerender = true;`;
                    // console.log({ node, ast: JSON.stringify(ast, null, 2) });
                }
            });

            // TODO: make a PR for an `asyncWalk` function so
            // that we can await it instead of using a timeout
            // to wait for the "walk" call to complete
            await wait(1000);
            const result = serialize(ast);
            // console.log(result);
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
