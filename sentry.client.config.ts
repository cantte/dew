// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://2b228592a3d79bcc8ddab413163171e6@o4503956764950528.ingest.us.sentry.io/4507448718000128',
  enabled: process.env.NODE_ENV === 'production',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),

    Sentry.feedbackIntegration({
      colorScheme: 'system',
      autoInject: false,
      showBranding: false,
      triggerLabel: 'Reportar un problema',

      formTitle: 'Reportar un problema',
      nameLabel: 'Nombre',
      namePlaceholder: 'Ej: Manolo',

      messageLabel: 'Observaciones',
      messagePlaceholder: 'Tienes una sugerencia? Que problema presentas?',
      isRequiredLabel: '(requerido)',

      submitButtonLabel: 'Enviar',
      cancelButtonLabel: 'Cancelar',
      confirmButtonLabel: 'Confirmar',

      addScreenshotButtonLabel: 'Agregar captura de pantalla',
      removeScreenshotButtonLabel: 'Remover captura de pantalla',
    }),
  ],
})
