// Сервис для интеграции с API Новой Почты
export interface NovaPoshtaWarehouse {
  SiteKey: string;
  Description: string;
  DescriptionRu: string;
  ShortAddress: string;
  ShortAddressRu: string;
  Phone: string;
  TypeOfWarehouse: string;
  Number: string;
  CityRef: string;
  CityDescription: string;
  CityDescriptionRu: string;
  SettlementRef: string;
  SettlementDescription: string;
  SettlementDescriptionRu: string;
  SettlementTypeDescription: string;
  SettlementTypeDescriptionRu: string;
  Longitude: string;
  Latitude: string;
  PostFinance: string;
  BicycleParking: string;
  PaymentAccess: string;
  POSTerminal: string;
  InternationalShipping: string;
  SelfServiceWorkplacesCount: string;
  TotalMaxWeightAllowed: string;
  PlaceMaxWeightAllowed: string;
  SendingLimitationsOnDimensions: {
    Width: number;
    Height: number;
    Length: number;
  };
  ReceivingLimitationsOnDimensions: {
    Width: number;
    Height: number;
    Length: number;
  };
  Reception: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  Delivery: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  Schedule: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  DistrictCode: string;
  WarehouseStatus: string;
  WarehouseStatusDate: string;
  CategoryOfWarehouse: string;
  Direct: string;
  RegionCity: string;
  WarehouseForAgent: string;
  GeneratorEnabled: string;
  MaxDeclaredCost: string;
  WorkInMobileAwis: string;
  DenyToSelect: string;
  CanGetMoneyTransfer: string;
  OnlyReceivingParcel: string;
  PostMachineType: string;
  PostalCodeUA: string;
  WarehouseIndex: string;
  BeaconCode: string;
}

export interface NovaPoshtaCity {
  Ref: string;
  Description: string;
  DescriptionRu: string;
  DescriptionTranslit: string;
  SettlementTypeDescription: string;
  SettlementTypeDescriptionRu: string;
  SettlementTypeDescriptionTranslit: string;
  Region: string;
  RegionsDescription: string;
  RegionsDescriptionRu: string;
  RegionsDescriptionTranslit: string;
  Area: string;
  AreaDescription: string;
  AreaDescriptionRu: string;
  AreaDescriptionTranslit: string;
  Index1: string;
  Index2: string;
  IndexCOATSU1: string;
  Delivery1: string;
  Delivery2: string;
  Delivery3: string;
  Delivery4: string;
  Delivery5: string;
  Delivery6: string;
  Delivery7: string;
  Warehouse: string;
}

class NovaPoshtaApiService {
  private readonly API_KEY = process.env.REACT_APP_NOVA_POSHTA_API_KEY || '';
  private readonly API_URL = 'https://api.novaposhta.ua/v2.0/json/';

  private getApiKey(): string {
    if (!this.API_KEY) {
      throw new Error('Nova Poshta API is not configured');
    }

    return this.API_KEY;
  }

  // Поиск городов по названию
  async searchCities(cityName: string): Promise<NovaPoshtaCity[]> {
    try {
      console.log('🔍 Поиск городов Новой Почты для:', cityName);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: this.getApiKey(),
          modelName: 'Address',
          calledMethod: 'searchSettlements',
          methodProperties: {
            CityName: cityName,
            Limit: 10,
          },
        }),
      });

      const data = await response.json();
      console.log('📡 Ответ API Новой Почты:', data);
      
      if (data.success && data.data && data.data.length > 0) {
        const addresses = data.data[0].Addresses || [];
        console.log('✅ Найдено городов:', addresses.length);
        
        // Если основной метод не дал результатов, попробуем альтернативный
        if (addresses.length === 0) {
          console.log('🔄 Пробуем альтернативный метод поиска городов...');
          return await this.searchCitiesAlternative(cityName);
        }
        
        return addresses;
      }
      
      console.log('❌ Города не найдены или ошибка API');
      return [];
    } catch (error) {
      console.error('❌ Ошибка поиска городов Новой Почты:', error);
      return [];
    }
  }

  // Альтернативный поиск городов
  async searchCitiesAlternative(cityName: string): Promise<NovaPoshtaCity[]> {
    try {
      console.log('🔍 Альтернативный поиск городов для:', cityName);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: this.getApiKey(),
          modelName: 'Address',
          calledMethod: 'getCities',
          methodProperties: {
            FindByString: cityName,
            Limit: 10,
          },
        }),
      });

      const data = await response.json();
      console.log('📡 Альтернативный ответ API:', data);
      
      if (data.success && data.data) {
        console.log('✅ Найдено городов (альтернативный метод):', data.data.length);
        return data.data;
      }
      
      console.log('❌ Альтернативный метод тоже не сработал');
      return [];
    } catch (error) {
      console.error('❌ Ошибка альтернативного поиска городов:', error);
      return [];
    }
  }

  // Получение отделений по городу
  async getWarehouses(cityRef: string): Promise<NovaPoshtaWarehouse[]> {
    try {
      console.log('🏢 Получение всех отделений для города:', cityRef);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: this.getApiKey(),
          modelName: 'AddressGeneral',
          calledMethod: 'getWarehouses',
          methodProperties: {
            CityRef: cityRef,
          },
        }),
      });

      const data = await response.json();
      console.log('📡 Ответ API всех отделений:', data);
      
      if (data.success) {
        if (data.data && data.data.length > 0) {
          console.log('✅ Найдено отделений:', data.data.length);
          return data.data;
        } else {
          console.log('⚠️ API успешно, но данные пустые. Попробуем без фильтров...');
          // Попробуем получить отделения без дополнительных фильтров
          return await this.getWarehousesSimple(cityRef);
        }
      }
      
      console.log('❌ API вернул ошибку:', data);
      return [];
    } catch (error) {
      console.error('❌ Ошибка получения отделений Новой Почты:', error);
      return [];
    }
  }

  // Простое получение отделений (без дополнительных фильтров)
  async getWarehousesSimple(cityRef: string): Promise<NovaPoshtaWarehouse[]> {
    try {
      console.log('🏢 Простое получение отделений для города:', cityRef);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: this.getApiKey(),
          modelName: 'AddressGeneral',
          calledMethod: 'getWarehouses',
          methodProperties: {
            CityRef: cityRef,
            TypeOfWarehouseRef: '841339c7-591a-42e2-8233-7a0a00f0edbd',
          },
        }),
      });

      const data = await response.json();
      console.log('📡 Простой ответ API отделений:', data);
      
      if (data.success && data.data) {
        console.log('✅ Найдено отделений (простой метод):', data.data.length);
        return data.data;
      }
      
      console.log('❌ Простой метод тоже не сработал');
      return [];
    } catch (error) {
      console.error('❌ Ошибка простого получения отделений:', error);
      return [];
    }
  }

  // Поиск отделений по названию
  async searchWarehouses(warehouseName: string, cityRef?: string): Promise<NovaPoshtaWarehouse[]> {
    try {
      console.log('🏢 Поиск отделений Новой Почты для:', warehouseName, 'в городе:', cityRef);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: this.getApiKey(),
          modelName: 'AddressGeneral',
          calledMethod: 'getWarehouses',
          methodProperties: {
            FindByString: warehouseName,
            CityRef: cityRef,
            Limit: 20,
          },
        }),
      });

      const data = await response.json();
      console.log('📡 Ответ API отделений Новой Почты:', data);
      
      if (data.success && data.data) {
        console.log('✅ Найдено отделений:', data.data.length);
        return data.data;
      }
      
      console.log('❌ Отделения не найдены или ошибка API');
      return [];
    } catch (error) {
      console.error('❌ Ошибка поиска отделений Новой Почты:', error);
      return [];
    }
  }

  // Получение стоимости доставки
  async getDeliveryCost(
    citySender: string,
    cityRecipient: string,
    serviceType: string = 'WarehouseWarehouse',
    weight: number = 0.5,
    cost: number = 0
  ): Promise<number> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: this.getApiKey(),
          modelName: 'InternetDocument',
          calledMethod: 'getDocumentPrice',
          methodProperties: {
            CitySender: citySender,
            CityRecipient: cityRecipient,
            ServiceType: serviceType,
            Weight: weight,
            Cost: cost,
            CargoType: 'Cargo',
            SeatsAmount: 1,
            PackCount: 1,
            PackRef: '1492c223-69d0-42e7-9b03-7b0a00f0edbd', // Стандартная упаковка
            CargoDetails: [
              {
                CargoDescription: 'Товары интернет-магазина',
                Amount: 1,
                Weight: weight,
                Cost: cost,
              },
            ],
          },
        }),
      });

      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        return data.data[0].Cost || 0;
      }
      
      return 0;
    } catch (error) {
      console.error('Ошибка расчета стоимости доставки:', error);
      return 0;
    }
  }
}

export const novaPoshtaApi = new NovaPoshtaApiService();
