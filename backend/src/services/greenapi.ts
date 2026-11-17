// ─────────────────────────────────────────────────────────────
// GREEN-API WhatsApp notification service
//
// Sends order notifications through your GREEN-API instance so
// order information arrives automatically in your WhatsApp.
//
// Required environment variables:
//   GREENAPI_ID_INSTANCE    – instance id, e.g. 710722803119
//   GREENAPI_TOKEN_INSTANCE – apiTokenInstance from the console
//   GREENAPI_NOTIFY_NUMBER  – recipient WhatsApp number in international
//                             format WITHOUT the leading +, e.g. 919342626096
//
// When any of these is missing, every call is a no-op that logs a
// warning, so the app still runs in environments without WhatsApp.
// ─────────────────────────────────────────────────────────────

const GREENAPI_URL = process.env.GREENAPI_URL || 'https://api.green-api.com';

interface GreenApiConfig {
  idInstance: string;
  apiTokenInstance: string;
  notifyNumber: string;
}

function getConfig(): GreenApiConfig | null {
  const idInstance = process.env.GREENAPI_ID_INSTANCE?.trim();
  const apiTokenInstance = process.env.GREENAPI_TOKEN_INSTANCE?.trim();
  const notifyNumber = process.env.GREENAPI_NOTIFY_NUMBER?.trim();

  if (!idInstance || !apiTokenInstance || !notifyNumber) {
    return null;
  }
  return { idInstance, apiTokenInstance, notifyNumber };
}

interface GreenApiResponse {
  idMessage?: string;
  [key: string]: unknown;
}

/**
 * Send a plain-text WhatsApp message through GREEN-API.
 * Returns the API response on success, or null when disabled / failed.
 */
export async function sendWhatsAppMessage(message: string): Promise<GreenApiResponse | null> {
  const config = getConfig();
  if (!config) {
    console.warn('[greenapi] WhatsApp notifications disabled: GREENAPI_ID_INSTANCE / GREENAPI_TOKEN_INSTANCE / GREENAPI_NOTIFY_NUMBER not set');
    return null;
  }

  const url = `${GREENAPI_URL}/waInstance${config.idInstance}/sendMessage/${config.apiTokenInstance}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: `${config.notifyNumber}@c.us`,
        message,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[greenapi] sendMessage failed: ${res.status} ${res.statusText} ${text}`);
      return null;
    }

    const data = (await res.json()) as GreenApiResponse;
    console.log(`[greenapi] message sent (idMessage=${data.idMessage ?? 'n/a'})`);
    return data;
  } catch (err) {
    console.error('[greenapi] sendMessage error:', (err as Error)?.message || err);
    return null;
  }
}

/**
 * Build the WhatsApp text for a new order.
 * Uses a plain-text, line-broken layout that WhatsApp renders well.
 */
export function buildOrderNotification(order: {
  orderNumber: string;
  status?: string;
  paymentStatus?: string;
  totalAmount?: number | string;
  shippingAddress?: string;
  items?: Array<{
    productName?: string;
    productId?: string;
    quantity?: number;
    price?: number;
    selectedColor?: string;
    selectedVariant?: string;
    customDestination?: string;
  }>;
}): string {
  const lines: string[] = [];

  lines.push('🛍️ *New Order — Smart Choice*');
  lines.push(`Order: *${order.orderNumber}*`);

  if (order.status) lines.push(`Status: ${order.status}`);
  if (order.paymentStatus) lines.push(`Payment: ${order.paymentStatus}`);

  const total = order.totalAmount !== undefined ? Number(order.totalAmount) : NaN;
  if (!Number.isNaN(total)) {
    lines.push(`Total: *₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*`);
  }

  if (order.shippingAddress) {
    lines.push('', '📍 *Shipping address:*');
    lines.push(order.shippingAddress);
  }

  if (order.items && order.items.length > 0) {
    lines.push('', '🧾 *Items:*');
    order.items.forEach((item, i) => {
      const name = item.productName || item.productId || `Item ${i + 1}`;
      const qty = item.quantity ?? 1;
      const price = item.price ? Number(item.price) : NaN;
      const linePrice = Number.isNaN(price) ? '' : ` — ₹${(price * qty).toLocaleString('en-IN')}`;
      let line = `${i + 1}. ${name} × ${qty}${linePrice}`;
      if (item.selectedColor) line += `\n   Color: ${item.selectedColor}`;
      if (item.selectedVariant) line += `\n   Variant: ${item.selectedVariant}`;
      if (item.customDestination) line += `\n   Destination: ${item.customDestination}`;
      lines.push(line);
    });
  }

  return lines.join('\n');
}
