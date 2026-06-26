/**
 * Single source of truth for the backend API URL.
 *
 * - In development (npm run dev):  reads from .env.local or falls back to localhost:3000
 * - In production (npm run build): reads VITE_API_URL from .env.production
 *
 * To deploy: set VITE_API_URL in frontend/.env.production to your server's public IP/domain.
 */
export const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
