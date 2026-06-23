/** Fallback when NEXT_PUBLIC_BASE_URL is not set (local / misconfigured env). */
export const DEFAULT_QR_BASE_URL = "https://visa-nadra-gav-pk.vercel.app";

/**
 * Base URL for QR codes (must be absolute so scanned links work from any device).
 * Uses NEXT_PUBLIC_BASE_URL when set so Vercel env changes apply without code edits.
 */
export function getQrBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return DEFAULT_QR_BASE_URL;
}
