export default function TestRoute() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Page - App is Running!</h1>
      <p>If you can see this, the app is deployed and running correctly.</p>
      <p>Environment: {process.env.NODE_ENV}</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  );
}