import React from 'react';
export default function SimpleTest() {
  return (
    <html>
      <body>
        <h1>Simple Test - No Dependencies</h1>
        <p>If you see this, the basic routing works!</p>
        <p>Time: {new Date().toISOString()}</p>
        <ul>
          <li><a href="/">Home (might be broken)</a></li>
          <li><a href="/test">Test Route</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/venues">Venues</a></li>
        </ul>
      </body>
    </html>
  );
}