// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // WAJIB: agar generate index.html
  target: "static", // mode static

  modules: ["@nuxtjs/color-mode", "@nuxt/image", "@nuxtjs/i18n"],

  i18n: {
    lazy: false,
    defaultLocale: "my",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "my", name: "Malaysia", file: "my.json" },
      { code: "cn", name: "China", file: "China", file: "cn.json" },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_locale",
    },
    strategy: "prefix",
  },

  routeRules: {
    "/kode-otp": { redirect: { to: "/my/kode-otp", statusCode: 301 } },
    "/**": { static: true }, // WAJIB untuk build static
  },

  css: ["~/assets/css/app.css", "@fortawesome/fontawesome-free/css/all.min.css"],

  pages: true,

  colorMode: {
    preference: "dark",
    fallback: "dark",
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  nitro: {
    preset: "static", // WAJIB agar output berupa /dist publik
  },

  compatibilityDate: "2025-03-05",

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },
});
