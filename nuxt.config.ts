import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt'
  ],

  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE || '',
      cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || '',
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    }
  },
  app: {
    head: {
      title: 'Elog - SIWES Electronic Logbook',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'SIWES Electronic Logbook Management Platform' }
      ]
    }
  }
})
