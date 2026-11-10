import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  findUserByUid,
  getOrCreateUser,
  registerOrUpdateAccount,
  updateAccountPayload,
} from './src/db/users.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  app.post('/api/auth/register', async (req, res) => {
    try {
      const rawEmail = String(req.body?.email || '').trim().toLowerCase();
      const authType = req.body?.authType === 'pattern' ? 'pattern' : 'password';
      const secretHash = String(req.body?.secretHash || '').trim();
      const payload = req.body?.payload && typeof req.body.payload === 'object' ? req.body.payload : {};

      if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
        return res.status(400).json({ error: 'Ingresa un correo electrónico válido.' });
      }
      if (!secretHash) {
        return res.status(400).json({ error: 'Ingresa una contraseña o dibuja un patrón válido.' });
      }

      const uid = `acct_${rawEmail}`;
      const existing = await findUserByUid(uid);
      if (existing && existing.secretHash && existing.secretHash !== secretHash) {
        return res.status(409).json({
          error: 'Ya existe una cuenta con este correo. Inicia sesión con tu contraseña o patrón.',
        });
      }

      const mergedPayload =
        existing && existing.payloadJson && existing.payloadJson !== '{}'
          ? { ...JSON.parse(existing.payloadJson), ...payload }
          : payload;

      const saved = await registerOrUpdateAccount({
        uid,
        email: rawEmail,
        authType,
        secretHash,
        payloadJson: JSON.stringify(mergedPayload),
      });

      const token =
        'acct_tok_' + Buffer.from(JSON.stringify({ uid: saved.uid, email: saved.email })).toString('base64url');

      res.json({
        token,
        user: { uid: saved.uid, email: saved.email, authType: saved.authType },
        payload: JSON.parse(saved.payloadJson || '{}'),
      });
    } catch (error: any) {
      console.error('Failed to register account:', error);
      res.status(500).json({ error: error.message || 'No se pudo registrar la cuenta en este momento.' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const rawEmail = String(req.body?.email || '').trim().toLowerCase();
      const secretHash = String(req.body?.secretHash || '').trim();

      if (!rawEmail || !secretHash) {
        return res.status(400).json({ error: 'Ingresa tu correo y tu contraseña o patrón.' });
      }

      const uid = `acct_${rawEmail}`;
      const existing = await findUserByUid(uid);
      if (!existing) {
        return res.status(404).json({
          error: 'No encontramos una cuenta con ese correo. Crea tu cuenta primero.',
        });
      }

      if (existing.secretHash !== secretHash) {
        return res.status(401).json({
          error: 'La contraseña o el patrón no coinciden con esta cuenta.',
        });
      }

      const token =
        'acct_tok_' +
        Buffer.from(JSON.stringify({ uid: existing.uid, email: existing.email })).toString('base64url');

      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(existing.payloadJson || '{}');
      } catch {
        parsedPayload = {};
      }

      res.json({
        token,
        user: { uid: existing.uid, email: existing.email, authType: existing.authType },
        payload: parsedPayload,
      });
    } catch (error: any) {
      console.error('Failed to log in:', error);
      res.status(500).json({ error: error.message || 'No se pudo iniciar sesión en este momento.' });
    }
  });

  app.get('/api/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || '';
      const userRecord = await getOrCreateUser(uid, email);
      let payload = {};
      try {
        payload = JSON.parse(userRecord.payloadJson || '{}');
      } catch {
        payload = {};
      }
      res.json({
        user: { uid: userRecord.uid, email: userRecord.email, authType: userRecord.authType },
        payload,
        updatedAt: userRecord.updatedAt,
      });
    } catch (error: any) {
      console.error('Failed to fetch cloud sync data:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch sync data' });
    }
  });

  app.post('/api/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || '';
      const payload = req.body?.payload && typeof req.body.payload === 'object' ? req.body.payload : {};
      const updated = await updateAccountPayload(uid, email, JSON.stringify(payload));
      res.json({
        ok: true,
        updatedAt: updated.updatedAt,
      });
    } catch (error: any) {
      console.error('Failed to save cloud sync data:', error);
      res.status(500).json({ error: error.message || 'Failed to save sync data' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
