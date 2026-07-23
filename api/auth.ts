import type { IncomingMessage, ServerResponse } from 'http';
import { getAuthHandler } from '../server/auth';

type ApiResponse = ServerResponse & {
  status(code: number): ApiResponse;
  json(body: unknown): void;
};

export default async function handler(
  request: IncomingMessage,
  response: ApiResponse
): Promise<void> {
  try {
    const authHandler = await getAuthHandler();
    await authHandler(request, response);
  } catch (error) {
    console.error('Auth API is unavailable', error);

    if (!response.headersSent) {
      response.setHeader('Cache-Control', 'no-store');
      response.status(503).json({
        error: 'auth_unavailable',
      });
    }
  }
}
