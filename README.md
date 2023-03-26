<!-- Ignore the comments, they are for the most placeholders for ideas -->
<h1 align="center">Astro Default Prerender 🚀</h1>
<h4 align="center">Prerender all your Astro pages by default</h4>

<p align="center">
    <a href="https://github.com/MoustaphaDev/astro-default-prerender/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/MoustaphaDev/astro-default-prerender?style=flat-square" alt="astro-default-prerender licence" />
    </a>
    <a href="https://github.com/MoustaphaDev/astro-default-prerender/fork" target="_blank">
        <img src="https://img.shields.io/github/forks/MoustaphaDev/astro-default-prerender?style=flat-square" alt="astro-default-prerender forks"/>
    </a>
    <a href="https://github.com/MoustaphaDev/astro-default-prerender/stargazers" target="_blank">
        <img src="https://img.shields.io/github/stars/MoustaphaDev/astro-default-prerender?style=flat-square" alt="astro-default-prerender stars"/>
    </a>
    <a href="https://github.com/MoustaphaDev/astro-default-prerender/issues" target="_blank">
        <img src="https://img.shields.io/github/issues/MoustaphaDev/astro-default-prerender?style=flat-square" alt="astro-default-prerender issues"/>
    </a>
    <a href="https://github.com/MoustaphaDev/astro-default-prerender/pulls" target="_blank">
        <img src="https://img.shields.io/github/issues-pr/MoustaphaDev/astro-default-prerender?style=flat-square" alt="astro-default-prerender pull-requests"/>
    </a>
    <a href="https://npmjs.com/package/astro-default-prerender" target="_blank">
        <img src="https://img.shields.io/npm/dt/astro-default-prerender.svg" alt="astro-default-prerender total downloads" />
    </a>
</p>

<p align="center">
    <a href="https://stackblitz.com/github/MoustaphaDev/astro-default-prerender/tree/main/demo" target="_blank">View Demo</a>
    ·
    <a href="https://github.com/MoustaphaDev/astro-default-prerender/issues/new/choose" target="_blank">Report Bug</a>
</p>



<!-- TOC start -->
# Table of contents
- [Table of contents](#table-of-contents)
  - [Why `astro-default-prerender`?](#why-astro-default-prerender)
  - [🚀 Demo](#-demo)
  - [💻 Quickstart](#-quickstart)
  - [🛡️ License](#️-license)
  - [🙏 Support](#-support)
<!-- TOC end --><!-- Generated with https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one -->

## Why `astro-default-prerender`?
Astro's prerendering is a great feature that allows you to mix static and dynamic content. However, it can be a bit tedious to add `export const prerender = true` to all your pages. This is where `astro-default-prerender` comes in.

`astro-default-prerender` is an [Astro](https://astro.build/) integration that allows you to prerender your pages by default. This means that you don't have to add `export const prerender = true` to your pages to prerender them. This plugin will do it for you.

<strong style="font-size:2rem">Many Thanks to all the `Stargazers`</strong>

[![Stargazers repo roster for astro-default-prerender](https://reporoster.com/stars/MoustaphaDev/astro-default-prerender)](https://github.com/MoustaphaDev/astro-default-prerender/stargazers)

## 🚀 Demo
Try out the minimal demo.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/MoustaphaDev/astro-default-prerender/tree/main/demo)

## 💻 Quickstart
Before you get started set the [output target](https://docs.astro.build/en/reference/configuration-reference/#output) to `server` and have an [adapter](https://docs.astro.build/en/guides/deploy/vercel/#adapter-for-ssr) wired up. You can learn more about this in the [Astro docs](https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project).

Now that you're all set up, you can install `astro-default-prerender` with the `astro add` CLI tool
```sh
# Using NPM
npx astro add astro-default-prerender

# Using YARN
yarn astro add astro-default-prerender

# Using PNPM
pnpm astro add astro-default-prerender
```

That's it! Now all your pages will be prerendered by default. You can still override this by adding `export const prerender = false` to your pages.

## 🛡️ License
This project is licensed under the MIT License - see the [`LICENSE`](LICENSE) file for details.

## 🙏 Support

If you liked this project, please give it a ⭐️. That's the best way you can support it!