export interface NovaPoshtaWarehouse {
  SiteKey?: string;
  Ref?: string;
  Description: string;
  ShortAddress: string;
  Phone?: string;
}

export interface NovaPoshtaCity {
  Ref: string;
  Description: string;
  DescriptionRu?: string;
}

type NovaPoshtaAction =
  | 'searchCities'
  | 'getWarehouses'
  | 'searchWarehouses'
  | 'getDeliveryCost';

interface NovaPoshtaProxyResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class NovaPoshtaApiService {
  private readonly API_URL = '/api/nova-poshta';

  private async request<T>(
    action: NovaPoshtaAction,
    payload: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...payload }),
    });

    const result = await response.json() as NovaPoshtaProxyResponse<T>;
    if (!response.ok || !result.success || result.data === undefined) {
      throw new Error(result.error || 'Nova Poshta request failed');
    }

    return result.data;
  }

  async searchCities(cityName: string): Promise<NovaPoshtaCity[]> {
    return this.request<NovaPoshtaCity[]>('searchCities', { query: cityName });
  }

  async getWarehouses(cityRef: string): Promise<NovaPoshtaWarehouse[]> {
    return this.request<NovaPoshtaWarehouse[]>('getWarehouses', { cityRef });
  }

  async searchWarehouses(
    warehouseName: string,
    cityRef?: string
  ): Promise<NovaPoshtaWarehouse[]> {
    return this.request<NovaPoshtaWarehouse[]>('searchWarehouses', {
      query: warehouseName,
      cityRef,
    });
  }

  async getDeliveryCost(
    citySender: string,
    cityRecipient: string,
    serviceType: string = 'WarehouseWarehouse',
    weight: number = 0.5,
    cost: number = 0
  ): Promise<number> {
    return this.request<number>('getDeliveryCost', {
      citySender,
      cityRecipient,
      serviceType,
      weight,
      cost,
    });
  }
}

export const novaPoshtaApi = new NovaPoshtaApiService();
