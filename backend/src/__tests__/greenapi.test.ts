import { buildOrderNotification, sendWhatsAppMessage } from '../services/greenapi';

describe('buildOrderNotification', () => {
  it('includes order number, status, payment, total', () => {
    const text = buildOrderNotification({
      orderNumber: 'SC-123456-789',
      status: 'Confirmed',
      paymentStatus: 'pending',
      totalAmount: 1099,
      items: [],
    });
    expect(text).toContain('SC-123456-789');
    expect(text).toContain('Confirmed');
    expect(text).toContain('pending');
    expect(text).toContain('₹1,099.00');
  });

  it('includes shipping address when present', () => {
    const text = buildOrderNotification({
      orderNumber: 'SC-1',
      shippingAddress: '12 MG Road, Chennai 600001',
      items: [],
    });
    expect(text).toContain('Shipping address');
    expect(text).toContain('12 MG Road, Chennai 600001');
  });

  it('lists items with quantity and line totals', () => {
    const text = buildOrderNotification({
      orderNumber: 'SC-2',
      items: [
        { productName: 'NFC Keychain', quantity: 2, price: 350 },
        { productName: 'Sticker Pack', quantity: 1, price: 99 },
      ],
    });
    expect(text).toContain('NFC Keychain × 2');
    expect(text).toContain('₹700');
    expect(text).toContain('Sticker Pack × 1');
    expect(text).toContain('₹99');
  });

  it('shows color, variant and custom destination when provided', () => {
    const text = buildOrderNotification({
      orderNumber: 'SC-3',
      items: [
        {
          productName: 'Custom Print',
          quantity: 1,
          price: 299,
          selectedColor: 'Red',
          selectedVariant: 'Large',
          customDestination: 'https://example.com/img.png',
        },
      ],
    });
    expect(text).toContain('Color: Red');
    expect(text).toContain('Variant: Large');
    expect(text).toContain('Destination: https://example.com/img.png');
  });

  it('falls back to productId when no name is available', () => {
    const text = buildOrderNotification({
      orderNumber: 'SC-4',
      items: [{ productId: 'prod_001', quantity: 1, price: 50 }],
    });
    expect(text).toContain('prod_001');
  });

  it('does not crash on completely empty order', () => {
    const text = buildOrderNotification({ orderNumber: 'SC-5' });
    expect(text).toContain('SC-5');
  });
});

describe('sendWhatsAppMessage', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('returns null and warns when env vars are missing', async () => {
    delete process.env.GREENAPI_ID_INSTANCE;
    delete process.env.GREENAPI_TOKEN_INSTANCE;
    delete process.env.GREENAPI_NOTIFY_NUMBER;

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await sendWhatsAppMessage('hello');
    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('disabled'));
    warnSpy.mockRestore();
  });

  it('posts to the GREEN-API sendMessage endpoint', async () => {
    process.env.GREENAPI_ID_INSTANCE = '710722803119';
    process.env.GREENAPI_TOKEN_INSTANCE = 'abc123token';
    process.env.GREENAPI_NOTIFY_NUMBER = '919342626096';

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ idMessage: 'msg-1' }),
    });
    const originalFetch = global.fetch;
    (global as any).fetch = fetchMock;

    try {
      const result = await sendWhatsAppMessage('test message');
      expect(result).toEqual({ idMessage: 'msg-1' });

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.green-api.com/waInstance710722803119/sendMessage/abc123token',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(sentBody.chatId).toBe('919342626096@c.us');
      expect(sentBody.message).toBe('test message');
    } finally {
      (global as any).fetch = originalFetch;
    }
  });

  it('returns null when the API responds with an error', async () => {
    process.env.GREENAPI_ID_INSTANCE = '1';
    process.env.GREENAPI_TOKEN_INSTANCE = 't';
    process.env.GREENAPI_NOTIFY_NUMBER = '919';

    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'bad token',
    });
    const originalFetch = global.fetch;
    (global as any).fetch = fetchMock;

    try {
      const result = await sendWhatsAppMessage('x');
      expect(result).toBeNull();
    } finally {
      (global as any).fetch = originalFetch;
    }
  });

  it('returns null when fetch throws', async () => {
    process.env.GREENAPI_ID_INSTANCE = '1';
    process.env.GREENAPI_TOKEN_INSTANCE = 't';
    process.env.GREENAPI_NOTIFY_NUMBER = '919';

    const fetchMock = jest.fn().mockRejectedValue(new Error('network down'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const originalFetch = global.fetch;
    (global as any).fetch = fetchMock;

    try {
      const result = await sendWhatsAppMessage('x');
      expect(result).toBeNull();
    } finally {
      (global as any).fetch = originalFetch;
      errorSpy.mockRestore();
    }
  });
});
