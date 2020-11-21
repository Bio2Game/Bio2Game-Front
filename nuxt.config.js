require('dotenv').config()

export default {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',

  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,

  /*
   ** Loading progress bar
   ** See https://nuxtjs.org/api/configuration-loading
   */
  loading: false,

  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/css/reset.css',
    '~/assets/css/framework.scss',
    '~/assets/css/variables.scss',
  ],

  /*
   ** Style Ressources configuration
   ** See https://axios.nuxtjs.org/options
   */
  styleResources: {
    scss: '~/assets/css/variables.scss',
  },

  /*
   ** Plugins to load before mounting the App
   ** See https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/vue-carousel.js', mode: 'client' },
    { src: '~/plugins/vue-notification.js', mode: 'client' },
    { src: '~/plugins/vue-closable.js', mode: 'client' },
    { src: '~/plugins/vue-socket.io.js', mode: 'client' },
  ],

  /*
   ** Nuxt.js dev-modules
   ** See https://nuxtjs.org/api/configuration-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',

    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',

    // Doc: https://github.com/nuxt-community/svg-module
    '@nuxtjs/svg',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',

    // Doc: https://pwa.nuxtjs.org/
    '@nuxtjs/pwa',

    // Doc: https://dev.auth.nuxtjs.org/
    '@nuxtjs/auth',

    // Doc: https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',

    // Doc: https://github.com/nuxt-community/proxy-module
    '@nuxtjs/proxy',

    // Doc: https://github.com/Developmint/nuxt-webfontloader
    'nuxt-webfontloader',

    // Doc: https://github.com/nuxt-community/robots-module
    '@nuxtjs/robots',
  ],

  /*
   ** Robots module configuration
   ** See https://github.com/nuxt-community/robots-module#options
   */
  robots: {
    UserAgent: '*',
    Disallow: '/',
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
  },

  /*
   ** Web font loader configuration
   ** See https://github.com/Developmint/nuxt-webfontloader#setup
   */
  webfontloader: {
    classes: false,
    events: false,
    google: {
      families: ['Montserrat:500,600,700,800,900&display=swap'],
    },
    custom: {
      families: ['Material-Icons'],
      urls: ['https://fonts.googleapis.com/icon?family=Material+Icons'],
    },
  },

  /*
   ** Proxy module configuration
   ** See https://github.com/nuxt-community/proxy-module#options
   */
  proxy: {
    '/api': process.env.API_URL,
    '/socket': process.env.API_URL,
  },

  /*
   ** Auth module configuration
   ** See https://dev.auth.nuxtjs.org/schemes/local.html#options
   */
  auth: {
    strategies: {
      user: {
        scheme: 'local',
        token: {
          property: 'token',
          required: true,
          type: 'Bearer',
          maxAge: false,
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/api/auth/user/login', method: 'post' },
          logout: { url: '/api/auth/user/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' },
        },
      },
      guest: {
        scheme: 'local',
        token: {
          property: 'token',
          required: true,
          type: 'Bearer',
          maxAge: false,
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/api/auth/guest/register', method: 'post' },
          logout: { url: '/api/auth/guest/logout', method: 'post' },
          user: { url: '/api/auth/guest', method: 'get' },
        },
      },
    },
    redirect: {
      callback: '/login/callback',
      login: '/login',
      logout: '/',
      home: '/',
    },
  },

  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    cache: true,
    ssr: true,
    friendlyErrors: true,
    hotMiddleware: {
      client: {
        overlay: false,
      },
    },
    postcss: {
      preset: {
        stage: 2,
        autoprefixer: {
          flexbox: true,
        },
      },
    },
  },
}
