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
    title: 'DraftBot',
    meta: [
      {
        // Windows
        name: 'msapplication-navbutton-color',
        content: '#ffffff',
      },
      {
        // Windows
        name: 'msapplication-TileColor',
        content: '#ffffff',
      },
      {
        // Windows
        name: 'msapplication-TileImage',
        content: process.env.BASE_URL + '/icons/ms-icon-144x144.png',
      },
      {
        name: 'msapplication-square70x70logo',
        content: process.env.BASE_URL + '/icons/ms-icon-70x70.png',
      },
      {
        name: 'msapplication-square150x150logo',
        content: process.env.BASE_URL + '/icons/ms-icon-150x150.png',
      },
      {
        name: 'msapplication-wide310x150logo',
        content: process.env.BASE_URL + '/icons/mstile-310x150.png',
      },
      {
        name: 'msapplication-square310x310logo',
        content: process.env.BASE_URL + '/icons/ms-icon-310x310.png',
      },
      {
        // Pinned Sites
        name: 'application-name',
        content: 'Bio2Game',
      },
      {
        // Pinned Sites
        name: 'msapplication-tooltip',
        content:
          'Jeu pour apprendre à consommer de façon responsable en testant vos connaissances dans le développement durable. En adhérant à BIO2GAME vous partagerez vos préoccupations environnementales.',
      },
      {
        // Pinned Sites
        name: 'msapplication-starturl',
        content: '/',
      },
      {
        // Tap highlighting
        name: 'msapplication-tap-highlight',
        content: 'no',
      },
      {
        // UC Mobile Browser
        name: 'full-screen',
        content: 'Yes',
      },
      {
        // UC Mobile Browser
        name: 'browsermode',
        content: 'application',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      // Pinned Tab
      {
        href: process.env.BASE_URL + '/icons/safari-pinned-tab.svg',
        rel: 'mask-icon',
        size: 'any',
        color: '#ffffff',
      },
      // Android
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: process.env.BASE_URL + '/icons/android-icon-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: process.env.BASE_URL + '/icons/favicon-96x96.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: process.env.BASE_URL + '/icons/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: process.env.BASE_URL + '/icons/favicon-16x16.png',
      },
    ],
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
    '/images': {
      target: process.env.CDN_URL,
      pathRewrite: { '^/images': '/' },
    },
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
      plugins: {
        'postcss-sorting': {},
      },
    },
  },
}
