/** Canonical public base URL (used for QR and "Open public page" so both open the same place.) */
export const DEFAULT_QR_BASE_URL = "https://visa-nadra-gov.vercel.app";

/**
 * Base URL for QR codes (must be absolute so scanned links work from any device).
 * For now we force Vercel domain to avoid mismatches while custom domain is being fixed.
 */
export function getQrBaseUrl(): string {
  return DEFAULT_QR_BASE_URL;
}
