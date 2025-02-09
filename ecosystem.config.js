module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'yarn',
      args: 'start',
      env: {
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  ],
};