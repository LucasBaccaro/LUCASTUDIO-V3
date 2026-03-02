import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the dist folder
app.use(express.static(join(__dirname, 'dist')));

// API endpoint to create ChatKit session
app.post('/api/chatkit/session', async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId is required' });
    }

    // Get API key from server environment (NOT VITE_ prefix for backend)
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('OPENAI_API_KEY is not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    console.log('Creating ChatKit session for device:', deviceId);

    // Call OpenAI API to create ChatKit session
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
      return res.status(response.status).json({ error: 'Failed to create session', details: errorText });
    }

    const data = await response.json();
    console.log('ChatKit session created successfully');

    return res.status(200).json({ client_secret: data.client_secret });
  } catch (error) {
    console.error('Error creating ChatKit session:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint para enviar email de notificación
app.post('/api/send-email', async (req, res) => {
  try {
    const { nombre, email, empresa, descripcion } = req.body;

    if (!nombre || !email || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos requeridos: nombre, email, descripcion' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Luca Studio <onboarding@resend.dev>',
      to: 'lucastudio.ba@gmail.com',
      subject: `🚀 Nuevo contacto desde la web: ${nombre}`,
      html: `
        <h2>Nuevo mensaje desde la web de Luca Studio</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Nombre:</td>
            <td style="padding: 8px;">${nombre}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Empresa:</td>
            <td style="padding: 8px;">${empresa || 'No indicó'}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; font-weight: bold;">Descripción del proyecto:</td>
            <td style="padding: 8px;">${descripcion}</td>
          </tr>
        </table>
      `,
    });

    console.log('Email de notificación enviado para:', nombre);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error enviando email:', error);
    return res.status(500).json({ error: 'Error al enviar el email' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve the React app for all other routes (SPA fallback)
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/chatkit/session`);
});
