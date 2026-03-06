import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Resend } from 'resend';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: dominios permitidos
const allowedOrigins = [
  'https://lucastudio.tech',
  'https://www.lucastudio.tech',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

app.use(cors({
  origin(origin, callback) {
    // Permitir requests sin origin (same-origin, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());

// Serve static files from the dist folder
app.use(express.static(join(__dirname, 'dist')));

// --- Tool: enviar email de notificacion ---
const enviarEmailTool = tool({
  name: 'enviar_notificacion_email',
  description:
    'Envia un email de notificacion al equipo de Luca Studio con los datos del potencial cliente interesado. Usa esta herramienta SOLO cuando el usuario haya proporcionado nombre, email y descripcion de su proyecto.',
  parameters: z.object({
    nombre: z.string().describe('Nombre del potencial cliente'),
    email: z.string().describe('Email del potencial cliente'),
    empresa: z.string().describe('Empresa del potencial cliente, o "No indicó" si no lo menciona'),
    descripcion: z.string().describe('Descripcion del proyecto o necesidad'),
  }),
  execute: async ({ nombre, email, empresa, descripcion }) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Luca Studio <onboarding@resend.dev>',
      to: 'lucastudio.ba@gmail.com',
      subject: `Nuevo contacto desde la web: ${nombre}`,
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
            <td style="padding: 8px;">${empresa || 'No indico'}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; font-weight: bold;">Descripcion del proyecto:</td>
            <td style="padding: 8px;">${descripcion}</td>
          </tr>
        </table>
      `,
    });

    console.log('Email de notificacion enviado para:', nombre);
    return `Email enviado correctamente. El equipo de Luca Studio se pondra en contacto con ${nombre} a la brevedad.`;
  },
});

// --- Guardrail: filtrar mensajes fuera de tema ---
const topicGuardAgent = new Agent({
  name: 'Topic Guard',
  model: 'gpt-4o-mini',
  instructions: `Determina si el mensaje del usuario es relevante para un asistente de un estudio de soluciones digitales (webs, apps, IA, chatbots, automatizacion, consultas de servicios, saludos, despedidas, datos de contacto).
Responde SOLO con un JSON: { "fuera_de_tema": true/false, "razon": "..." }
Ejemplos fuera de tema: pedir recetas, hablar de politica, pedir que escribas codigo, preguntas personales no relacionadas al negocio.
Ejemplos validos: saludos, preguntas sobre servicios, presupuestos, dejar datos, despedidas, agradecimientos.`,
  outputType: z.object({
    fuera_de_tema: z.boolean(),
    razon: z.string(),
  }),
});

// --- Agent de Luca Studio ---
const lucaAgent = new Agent({
  name: 'Luca Studio Assistant',
  model: 'gpt-4o-mini',
  instructions: `Sos el asistente virtual de Luca Studio, un estudio digital de Buenos Aires, Argentina.

PERSONALIDAD:
- Hablás en argentino rioplatense. Usás "vos", "tenés", "querés", "contame", "dale", "genial", "bárbaro".
- NUNCA hables en neutro ni uses "tú", "tienes", "quieres", "cuéntame".
- Sos directo, cálido y breve. Máximo 2-3 oraciones por mensaje.
- No repitas lo que ya dijiste. No hagas listas largas. No des discursos.

FLUJO DE CONVERSACION:
1. Saludo corto. Preguntá en qué podés ayudar.
2. Si preguntan por servicios, respondé puntual sin listar todo. Solo lo que preguntan.
3. Si muestran interés en trabajar juntos, pedí: nombre, email, y brevemente qué necesitan. Todo junto, en un solo mensaje. No iteres pidiendo dato por dato.
4. Apenas tengas nombre + email + algo de contexto del proyecto, usá la tool enviar_notificacion_email. No pidas más detalles ni "descripción completa". Con lo que te dieron alcanza.
5. Después de enviar el email, confirmá que el equipo se va a comunicar y cerrá. No sigas ofreciendo cosas.
6. Si se despiden, respondé breve ("Dale, éxitos!") y nada más.

INFO DE LUCA STUDIO:
- Hacemos: webs para negocios, productos digitales a medida, automatización con IA, agentes.
- Contacto: lucastudio.ba@gmail.com | +54 11 5752-9494 | Instagram: @lucastudio.ba
- WhatsApp: https://wa.me/5491157529494

PROHIBIDO:
- Inventar información que no tengas.
- Hablar de temas que no sean Luca Studio o servicios digitales.
- Pedir datos si la persona no mostró interés real.
- Seguir hablando después de despedirse el usuario.
- Mandar más de un email por conversación.`,
  tools: [enviarEmailTool],
  inputGuardrails: [
    {
      name: 'Topic Guard',
      execute: async ({ input, context }) => {
        const result = await run(topicGuardAgent, input, { context });
        return {
          tripwireTriggered: result.finalOutput?.fuera_de_tema ?? false,
          outputInfo: result.finalOutput,
        };
      },
    },
  ],
});

// --- Chat endpoint with streaming ---
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Build input for the Agents SDK (Responses API format)
    const input = messages.map((m) => {
      if (m.role === 'user') {
        return { role: 'user', content: [{ type: 'input_text', text: m.content }] };
      }
      // assistant messages use output_text
      return { role: 'assistant', content: [{ type: 'output_text', text: m.content }] };
    });

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Run agent with streaming
    const stream = await run(lucaAgent, input, { stream: true });

    for await (const event of stream) {
      if (event.type === 'raw_model_stream_event') {
        const data = event.data;
        if (data.type === 'output_text_delta') {
          res.write(`data: ${JSON.stringify({ type: 'delta', content: data.delta })}\n\n`);
        }
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    // Guardrail triggered — message is off-topic
    if (error?.constructor?.name === 'InputGuardrailTripwireTriggered') {
      console.log('Guardrail blocked:', error.outputInfo?.razon);
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
      }
      const msg = 'Solo puedo ayudarte con temas relacionados a Luca Studio y nuestros servicios digitales. Si tenes alguna consulta sobre lo que hacemos, preguntame!';
      res.write(`data: ${JSON.stringify({ type: 'delta', content: msg })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
      return;
    }

    console.error('Error in /api/chat:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.write(
      `data: ${JSON.stringify({ type: 'error', content: 'Ocurrio un error. Intenta de nuevo.' })}\n\n`
    );
    res.end();
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
});
