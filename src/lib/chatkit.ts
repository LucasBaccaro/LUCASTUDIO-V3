// Helper to generate a unique device ID for the user
function getDeviceId(): string {
  const storageKey = 'chatkit_device_id';
  let deviceId = localStorage.getItem(storageKey);

  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).substring(2, 15)}${Date.now()}`;
    localStorage.setItem(storageKey, deviceId);
  }

  return deviceId;
}

export async function getChatKitSessionToken(): Promise<string> {
  const deviceId = getDeviceId();
  const sessionKey = 'chatkit_client_secret';

  // Try to get existing session from sessionStorage (persists until page refresh)
  const existingSecret = sessionStorage.getItem(sessionKey);
  if (existingSecret) {
    console.log('Reusing existing ChatKit session from sessionStorage');
    return existingSecret;
  }

  console.log('Creating new ChatKit session via backend');

  try {
    // Call our own backend API instead of OpenAI directly
    const apiUrl = import.meta.env.PROD
      ? '/api/chatkit/session'  // Production: same domain
      : 'http://localhost:3001/api/chatkit/session';  // Development: backend server

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: deviceId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ChatKit session creation failed:', response.status, errorData);
      throw new Error(`Failed to create ChatKit session: ${response.status}`);
    }

    const data = await response.json();
    const clientSecret = data.client_secret;

    // Store the client secret in sessionStorage for persistence across chat open/close
    sessionStorage.setItem(sessionKey, clientSecret);

    console.log('ChatKit session created successfully and stored');
    return clientSecret;
  } catch (error) {
    console.error('Error creating ChatKit session:', error);
    throw error;
  }
}
