import { defineConfig, loadEnv, Connect } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

// https://vite.dev/config/
function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, '');
}

function aiProxyPlugin(env: Record<string, string>) {
  const baseUrl = normalizeBaseUrl(env.OPENAI_BASE_URL || 'https://ai.nengyongai.cn/v1');
  const apiKey = env.OPENAI_API_KEY || '';
  const model = env.OPENAI_MODEL || 'gpt-4o-mini';

  const handler: Connect.NextHandleFunction = async (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: { message: 'Method Not Allowed' } }));
      return;
    }

    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: { message: '缺少 OPENAI_API_KEY，请在 .env 配置' } }));
      return;
    }

    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString('utf-8');
    });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}') as { messages?: unknown; temperature?: unknown };
        const messages = Array.isArray(parsed.messages) ? parsed.messages : null;
        const temperature = typeof parsed.temperature === 'number' ? parsed.temperature : 0.4;

        if (!messages) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: { message: 'messages 格式错误' } }));
          return;
        }

        const upstream = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
          }),
        });

        const text = await upstream.text();
        res.statusCode = upstream.status;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(text);
      } catch {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: { message: 'AI 代理请求失败' } }));
      }
    });
  };

  return {
    name: 'flashmind-ai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai/chat', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/ai/chat', handler);
    },
  } as import('vite').Plugin;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    build: {
      sourcemap: 'hidden',
    },
    plugins: [
      react({
        babel: {
          plugins: [
            'react-dev-locator',
          ],
        },
      }),
      traeBadgePlugin({
        variant: 'dark',
        position: 'bottom-right',
        prodOnly: true,
        clickable: true,
        clickUrl: 'https://www.trae.ai/solo?showJoin=1',
        autoTheme: true,
        autoThemeTarget: '#root'
      }),
      tsconfigPaths(),
      aiProxyPlugin(env),
    ],
  };
});
