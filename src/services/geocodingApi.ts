// Сервис для геокодирования адресов
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
  private readonly GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'your-google-maps-api-key';

  // Геокодирование адреса (адрес -> координаты)
  async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          address: result.formatted_address,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          formatted_address: result.formatted_address,
          place_id: result.place_id,
          types: result.types,
        };
      }

      return null;
    } catch (error) {
      console.error('Ошибка геокодирования адреса:', error);
      return null;
    }
  }

  // Обратное геокодирование (координаты -> адрес)
  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          address: result.formatted_address,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          formatted_address: result.formatted_address,
          place_id: result.place_id,
          types: result.types,
        };
      }

      return null;
    } catch (error) {
      console.error('Ошибка обратного геокодирования:', error);
      return null;
    }
  }

  // Автозаполнение адресов (Place Autocomplete)
  async getAddressSuggestions(input: string, country: string = 'ua'): Promise<GeocodingSuggestion[]> {
    try {
      // Проверяем наличие API ключа
      if (!this.GOOGLE_MAPS_API_KEY || this.GOOGLE_MAPS_API_KEY === 'your-google-maps-api-key') {
        console.warn('⚠️ Google Maps API Key не настроен');
        return [];
      }

      console.log('🔍 Получение автозаполнения адресов для:', input);
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&components=country:${country}&key=${this.GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();
      console.log('📡 Ответ Google Places API:', data);

      if (data.status === 'OK' && data.predictions) {
        console.log('✅ Найдено адресов:', data.predictions.length);
        return data.predictions.map((prediction: any) => ({
          description: prediction.description,
          place_id: prediction.place_id,
          structured_formatting: {
            main_text: prediction.structured_formatting.main_text,
            secondary_text: prediction.structured_formatting.secondary_text,
          },
        }));
      }

      if (data.status === 'REQUEST_DENIED') {
        console.error('❌ Google Maps API: Запрос отклонен. Проверьте API ключ и права доступа');
      } else if (data.status === 'OVER_QUERY_LIMIT') {
        console.error('❌ Google Maps API: Превышен лимит запросов');
      } else {
        console.error('❌ Google Maps API ошибка:', data.status, data.error_message);
      }

      return [];
    } catch (error) {
      console.error('❌ Ошибка получения автозаполнения адресов:', error);
      return [];
    }
  }

  // Получение детальной информации о месте по place_id
  async getPlaceDetails(placeId: string): Promise<GeocodingResult | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry,place_id,types&key=${this.GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const result = data.result;
        return {
          address: result.formatted_address,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          formatted_address: result.formatted_address,
          place_id: result.place_id,
          types: result.types,
        };
      }

      return null;
    } catch (error) {
      console.error('Ошибка получения деталей места:', error);
      return null;
    }
  }

  // Проверка валидности адреса
  async validateAddress(address: string): Promise<boolean> {
    try {
      const result = await this.geocodeAddress(address);
      return result !== null;
    } catch (error) {
      console.error('Ошибка валидации адреса:', error);
      return false;
    }
  }

  // Получение расстояния между двумя точками
  async getDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<{ distance: string; duration: string } | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${this.GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.rows && data.rows.length > 0) {
        const element = data.rows[0].elements[0];
        if (element.status === 'OK') {
          return {
            distance: element.distance.text,
            duration: element.duration.text,
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Ошибка получения расстояния:', error);
      return null;
    }
  }
}

export const geocodingApi = new GeocodingApiService();
