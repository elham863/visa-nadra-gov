/** Canonical public base URL (used for QR and "Open public page" so both open the same place.) */
export const DEFAULT_QR_BASE_URL = "https://visa-nadra-gov.vercel.app";

/**
 * Base URL for QR codes (must be absolute so scanned links work from any device).
 * Treats empty or whitespace env as missing so we never encode a relative URL.
 */
export function getQrBaseUrl(): string {
  const raw =
    typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
      ? process.env.NEXT_PUBLIC_BASE_URL.trim()
      : "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.replace(/\/+$/, ""); // strip trailing slashes
  }
  return DEFAULT_QR_BASE_URL;
}
