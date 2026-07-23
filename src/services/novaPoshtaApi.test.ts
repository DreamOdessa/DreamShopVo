import { novaPoshtaApi } from './novaPoshtaApi';

const originalFetch = global.fetch;

describe('novaPoshtaApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('uses the same-origin proxy without sending an API key', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{ Ref: 'city-ref', Description: 'Odesa' }],
      }),
    });

    await expect(novaPoshtaApi.searchCities('Odesa')).resolves.toHaveLength(1);

    expect(global.fetch).toHaveBeenCalledWith('/api/nova-poshta', expect.objectContaining({
      method: 'POST',
    }));
    const request = (global.fetch as jest.Mock).mock.calls[0][1];
    const body = JSON.parse(request.body);

    expect(body).toEqual({ action: 'searchCities', query: 'Odesa' });
    expect(body).not.toHaveProperty('apiKey');
  });

  it('rejects failed proxy responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Invalid request',
      }),
    });

    await expect(novaPoshtaApi.getWarehouses('bad-ref')).rejects.toThrow('Invalid request');
  });
});
