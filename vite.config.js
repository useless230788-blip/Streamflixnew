import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Runs api/tmdb.js inside `npm run dev` so you don't need `vercel dev` locally.
function devApi(env) {
  return {
    name: 'streamflix-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/tmdb', async (req, res) => {
        Object.assign(process.env, env);
        const url = new URL(req.url, 'http://localhost');
        req.query = Object.fromEntries(url.searchParams);
        res.status = (c) => { res.statusCode = c; return res; };
        res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); };
        try {
          const mod = await server.ssrLoadModule('/api/tmdb.js');
          await mod.default(req, res);
        } catch (e) {
          res.status(500).json({ ok: false, error: { code: 'dev_error', message: String(e.message || e) } });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return { plugins: [react(), devApi(env)] };
});
