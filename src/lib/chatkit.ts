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

  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('VITE_OPENAI_API_KEY is not configured');
    throw new Error('VITE_OPENAI_API_KEY is not configured');
  }

  console.log('Creating ChatKit session with workflow ID:', 'wf_698decbecb5881908a6a5b1b81fc6b6e0c4657133d979995');

  try {
    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'chatkit_beta=v1',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        workflow: { id: 'wf_698decbecb5881908a6a5b1b81fc6b6e0c4657133d979995' },
        user: deviceId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ChatKit session creation failed:', response.status, errorText);
      throw new Error(`Failed to create ChatKit session: ${response.status} ${errorText}`);
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
