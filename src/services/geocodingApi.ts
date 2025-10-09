// Сервис для геокодирования адресов на основе OpenStreetMap Nominatim (бесплатный)
export interface GeocodingResult {
  address: string;
  lat: number;
  lng: number;
  formatted_address: string;
  place_id?: string;
  types?: string[];
}

export interface GeocodingSuggestion {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

class GeocodingApiService {
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

  // Геокодирование адреса (адрес -> координаты) через Nominatim
  async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    try {
      console.log('🗺️ Геокодирование адреса через Nominatim:', address);
      
      const response = await fetch(
        `${this.NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(address)}&countrycodes=ua&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'DreamShop/1.0'
          }
        }
      );

      const data = await response.json();
      console.log('📡 Ответ Nominatim:', data);

      if (data && data.length > 0) {
        const result = data[0];
        console.log('✅ Координаты найдены:', result.lat, result.lon);
        return {
          address: result.display_name,
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          formatted_address: result.display_name,
          place_id: result.place_id,
          types: result.type ? [result.type] : [],
        };
      }

      console.log('❌ Координаты не найдены');
      return null;
    } catch (error) {
      console.error('❌ Ошибка геокодирования через Nominatim:', error);
      return null;
    }
  }

  // Обратное геокодирование (координаты -> адрес) через Nominatim
  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
    try {
      console.log('🗺️ Обратное геокодирование через Nominatim:', lat, lng);
      
      const response = await fetch(
        `${this.NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'DreamShop/1.0'
          }
        }
      );

      const data = await response.json();
      console.log('📡 Ответ Nominatim (reverse):', data);

      if (data && data.display_name) {
        console.log('✅ Адрес найден:', data.display_name);
        return {
          address: data.display_name,
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lon),
          formatted_address: data.display_name,
          place_id: data.place_id,
          types: data.type ? [data.type] : [],
        };
      }

      console.log('❌ Адрес не найден');
      return null;
    } catch (error) {
      console.error('❌ Ошибка обратного геокодирования через Nominatim:', error);
      return null;
    }
  }

  // Автозаполнение адресов через Nominatim
  async getAddressSuggestions(input: string, country: string = 'ua'): Promise<GeocodingSuggestion[]> {
    try {
      console.log('🔍 Получение автозаполнения адресов через Nominatim для:', input);
      
      if (input.length < 3) {
        return [];
      }

      const response = await fetch(
        `${this.NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(input)}&countrycodes=${country}&limit=5&addressdetails=1&extratags=1`,
        {
          headers: {
            'User-Agent': 'DreamShop/1.0'
          }
        }
      );

      const data = await response.json();
      console.log('📡 Ответ Nominatim (autocomplete):', data);

      if (data && data.length > 0) {
        console.log('✅ Найдено адресов через Nominatim:', data.length);
        return data.map((result: any, index: number) => ({
          description: result.display_name,
          place_id: result.place_id || `nominatim_${index}`,
          structured_formatting: {
            main_text: result.name || result.display_name.split(',')[0],
            secondary_text: result.display_name.split(',').slice(1).join(',').trim(),
          },
        }));
      }

      // Fallback на локальные адреса Одессы
      console.log('🔄 Fallback на локальные адреса Одессы');
      return this.getLocalAddressSuggestions(input, country);
    } catch (error) {
      console.error('❌ Ошибка получения автозаполнения через Nominatim:', error);
      // Fallback на локальные адреса
      return this.getLocalAddressSuggestions(input, country);
    }
  }

  // Локальные адреса Одессы как fallback
  private getLocalAddressSuggestions(input: string, country: string): GeocodingSuggestion[] {
    if (country === 'ua' && input.length > 2) {
      const ukrainianAddresses = [
        'вул. Дерибасівська, 16, Одеса, Одеська область',
        'вул. Приморський бульвар, 1, Одеса, Одеська область',
        'вул. Рішельєвська, 33, Одеса, Одеська область',
        'пр. Шевченка, 2, Одеса, Одеська область',
        'вул. Ланжеронівська, 2, Одеса, Одеська область',
        'вул. Пушкінська, 9, Одеса, Одеська область',
        'вул. Грецька, 1, Одеса, Одеська область',
        'вул. Єврейська, 25, Одеса, Одеська область'
      ];
      
      const filtered = ukrainianAddresses.filter(addr => 
        addr.toLowerCase().includes(input.toLowerCase())
      );
      
      if (filtered.length > 0) {
        console.log('✅ Найдено локальных адресов:', filtered.length);
        return filtered.map((address, index) => ({
          description: address,
          place_id: `local_${index}`,
          structured_formatting: {
            main_text: address.split(',')[0],
            secondary_text: address.split(',').slice(1).join(',').trim(),
          },
        }));
      }
    }
    
    return [];
  }

  // Получение детальной информации о месте по place_id
  async getPlaceDetails(placeId: string): Promise<GeocodingResult | null> {
    try {
      // Для локальных адресов возвращаем базовую информацию
      if (placeId.startsWith('local_')) {
        const localAddresses = [
          'вул. Дерибасівська, 16, Одеса, Одеська область',
          'вул. Приморський бульвар, 1, Одеса, Одеська область',
          'вул. Рішельєвська, 33, Одеса, Одеська область',
          'пр. Шевченка, 2, Одеса, Одеська область',
          'вул. Ланжеронівська, 2, Одеса, Одеська область'
        ];
        
        const index = parseInt(placeId.replace('local_', ''));
        const address = localAddresses[index];
        
        if (address) {
          // Пытаемся получить координаты через геокодирование
          const coords = await this.geocodeAddress(address);
          return coords || {
            address,
            lat: 46.4825, // Примерные координаты Одессы
            lng: 30.7233,
            formatted_address: address,
            place_id: placeId,
            types: ['street_address']
          };
        }
      }

      // Для Nominatim place_id
      if (placeId.startsWith('nominatim_')) {
        console.log('⚠️ Nominatim place_id детали не поддерживаются напрямую');
        return null;
      }

      console.log('🔍 Получение деталей места через Nominatim:', placeId);
      const response = await fetch(
        `${this.NOMINATIM_URL}/details?format=json&place_id=${placeId}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'DreamShop/1.0'
          }
        }
      );

      const data = await response.json();
      console.log('📡 Ответ Nominatim (details):', data);

      if (data && data.display_name) {
        return {
          address: data.display_name,
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lon),
          formatted_address: data.display_name,
          place_id: data.place_id,
          types: data.type ? [data.type] : [],
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Ошибка получения деталей места:', error);
      return null;
    }
  }

  // Проверка валидности адреса
  async validateAddress(address: string): Promise<boolean> {
    try {
      const result = await this.geocodeAddress(address);
      return result !== null;
    } catch (error) {
      console.error('❌ Ошибка валидации адреса:', error);
      return false;
    }
  }

  // Получение расстояния между двумя точками (упрощенная версия)
  async getDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<{ distance: string; duration: string } | null> {
    try {
      // Простой расчет расстояния по формуле гаверсинуса
      const R = 6371; // Радиус Земли в км
      const dLat = this.toRadians(destination.lat - origin.lat);
      const dLng = this.toRadians(destination.lng - origin.lng);
      
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.toRadians(origin.lat)) * Math.cos(this.toRadians(destination.lat)) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      // Примерное время (50 км/ч средняя скорость)
      const duration = distance / 50;

      return {
        distance: `${distance.toFixed(1)} км`,
        duration: `${Math.round(duration * 60)} мин`
      };
    } catch (error) {
      console.error('❌ Ошибка расчета расстояния:', error);
      return null;
    }
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const geocodingApi = new GeocodingApiService();