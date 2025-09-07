import { data } from 'react-router';

/**
 * Healthcheck endpoint for the web app. If this endpoint returns a 200, the web app will be considered healthy.
 * If this endpoint returns a 500, the web app will be considered unhealthy.
 * This endpoint can be used by Docker to determine if the web app is healthy and should be restarted.
 */
export async function loader() {
  // Simple healthcheck that doesn't require database connection
  // This ensures the app can start even if database is not immediately available
  return data({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      web: true,
      // Database check disabled to allow app to start
      // database: false,
    },
  });
}
