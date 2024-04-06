export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'unplugin-icons/nuxt',
    '../src/module',
  ],
  headlessuiFloat: {},
  routeRules: {
    '/': { redirect: '/floatingui-options' },
  },
  telemetry: false,
})
