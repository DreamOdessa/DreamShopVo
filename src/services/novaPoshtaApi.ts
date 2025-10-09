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
  private readonly API_KEY = process.env.REACT_APP_NOVA_POSHTA_API_KEY || '01b6aa62c09ccb6f0218cf21e3f5de33';
  private readonly API_URL = 'https://api.novaposhta.ua/v2.0/json/';

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
          apiKey: this.API_KEY,
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
        return addresses;
      }
      
      console.log('❌ Города не найдены или ошибка API');
      return [];
    } catch (error) {
      console.error('❌ Ошибка поиска городов Новой Почты:', error);
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
          apiKey: this.API_KEY,
          modelName: 'AddressGeneral',
          calledMethod: 'getWarehouses',
          methodProperties: {
            CityRef: cityRef,
          },
        }),
      });

      const data = await response.json();
      console.log('📡 Ответ API всех отделений:', data);
      
      if (data.success && data.data) {
        console.log('✅ Найдено отделений:', data.data.length);
        return data.data;
      }
      
      console.log('❌ Отделения не найдены');
      return [];
    } catch (error) {
      console.error('❌ Ошибка получения отделений Новой Почты:', error);
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
          apiKey: this.API_KEY,
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
          apiKey: this.API_KEY,
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
