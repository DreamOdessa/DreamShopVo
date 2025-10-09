import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiTruck, FiCreditCard, FiCheck, FiChevronDown, FiChevronUp, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { novaPoshtaApi, NovaPoshtaWarehouse } from '../services/novaPoshtaApi';
import { geocodingApi, GeocodingSuggestion } from '../services/geocodingApi';
import toast from 'react-hot-toast';

// Стили компонентов
const CheckoutContainer = styled.div`
  padding: 2rem 0;
  min-height: 80vh;
  background: #f8f9fa;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const CheckoutContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 20px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #34495e;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00acc1;
  }

  &:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00acc1;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00acc1;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  font-size: 0.9rem;
  color: #34495e;
`;

const Note = styled.p`
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.5rem;
  font-style: italic;
`;

// Блок проверки заказа
const OrderSummarySection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const OrderSummaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 1rem 0;
  border-bottom: 1px solid #e1e8ed;
`;

const OrderSummaryTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
`;

const OrderSummaryContent = styled.div<{ isExpanded: boolean }>`
  max-height: ${props => props.isExpanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding-top: ${props => props.isExpanded ? '1rem' : '0'};
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
`;

const TotalAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #00acc1;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e1e8ed;
  text-align: right;
`;

// Кнопки
const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${props => props.variant === 'primary' ? `
    background: #00acc1;
    color: white;
    
    &:hover {
      background: #0097a7;
      transform: translateY(-2px);
    }
    
    &:disabled {
      background: #b0bec5;
      cursor: not-allowed;
      transform: none;
    }
  ` : `
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  `}
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Автоподсказки
const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e1e8ed;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SuggestionItem = styled.li`
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #f8f9fa;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const AutocompleteContainer = styled.div`
  position: relative;
`;

// Украинские города для автоподсказок
const ukrainianCities = [
  'Київ', 'Харків', 'Одеса', 'Дніпро', 'Донецьк', 'Запоріжжя', 'Львів', 'Кривий Ріг',
  'Миколаїв', 'Маріуполь', 'Луганськ', 'Вінниця', 'Херсон', 'Полтава', 'Чернігів',
  'Черкаси', 'Суми', 'Житомир', 'Хмельницький', 'Чернівці', 'Рівне', 'Івано-Франківськ',
  'Кропивницький', 'Тернопіль', 'Луцьк', 'Ужгород', 'Біла Церква', 'Кременчук'
];

const Checkout: React.FC = () => {
  const { items, getTotalPrice, getTotalItems, createOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Состояние формы
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    phone: '',
    city: '',
    deliveryMethod: '',
    deliveryDetails: '',
    establishmentName: '',
    isPrivatePerson: false,
    paymentMethod: '',
    contactForClarification: false
  });

  // Состояние для автоподсказок
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  
  // Состояние для Новой Почты
  const [warehouseSuggestions, setWarehouseSuggestions] = useState<NovaPoshtaWarehouse[]>([]);
  const [showWarehouseSuggestions, setShowWarehouseSuggestions] = useState(false);
  const [selectedCityRef, setSelectedCityRef] = useState<string>('');
  
  // Состояние для геокодирования
  const [addressSuggestions, setAddressSuggestions] = useState<GeocodingSuggestion[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  
  // Состояние для блока заказа
  const [isOrderSummaryExpanded, setIsOrderSummaryExpanded] = useState(false);

  // Автозаполнение данных из профиля
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        phone: prev.phone || ''
      }));
    }
  }, [user]);

  // Обработка изменений в полях
  const handleInputChange = async (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    const stringValue = value as string;

    // Логика для города
    if (field === 'city') {
      if (stringValue.length > 1) {
        // Локальные подсказки
        const filtered = ukrainianCities.filter(city =>
          city.toLowerCase().includes(stringValue.toLowerCase())
        );
        setCitySuggestions(filtered);
        setShowCitySuggestions(true);

        // API Новой Почты
        try {
          const cities = await novaPoshtaApi.searchCities(stringValue);
          if (cities.length > 0) {
            setSelectedCityRef(cities[0].Ref);
          }
        } catch (error) {
          console.error('Ошибка поиска городов Новой Почты:', error);
        }
      } else {
        setShowCitySuggestions(false);
        setSelectedCityRef('');
      }
    }

    // Логика для отделений Новой Почты
    if (field === 'deliveryDetails' && formData.deliveryMethod === 'post_office' && selectedCityRef) {
      if (stringValue.length > 0) {
        try {
          let warehouses;
          if (stringValue.length > 2) {
            // Поиск по названию
            warehouses = await novaPoshtaApi.searchWarehouses(stringValue, selectedCityRef);
          } else {
            // Получить все отделения города
            warehouses = await novaPoshtaApi.getWarehouses(selectedCityRef);
          }
          
          if (stringValue.length > 2 && warehouses.length === 0) {
            // Если поиск не дал результатов, показать все отделения
            warehouses = await novaPoshtaApi.getWarehouses(selectedCityRef);
          }
          
          setWarehouseSuggestions(warehouses);
          setShowWarehouseSuggestions(true);
        } catch (error) {
          console.error('Ошибка поиска отделений Новой Почты:', error);
        }
      } else {
        setShowWarehouseSuggestions(false);
      }
    }

    // Логика для адресов (геокодирование)
    if (field === 'deliveryDetails' && 
        (formData.deliveryMethod === 'address' || 
         formData.deliveryMethod === 'schedule' || 
         formData.deliveryMethod === 'taxi')) {
      if (stringValue.length > 3) {
        try {
          const suggestions = await geocodingApi.getAddressSuggestions(stringValue);
          setAddressSuggestions(suggestions);
          setShowAddressSuggestions(true);
        } catch (error) {
          console.error('Ошибка получения автозаполнения адресов:', error);
        }
      } else {
        setShowAddressSuggestions(false);
      }
    }
  };

  // Быстрый выбор Одессы
  const handleOdessaQuickSelect = (checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        city: 'Одеса'
      }));
    }
  };

  // Получение способов доставки в зависимости от города
  const getDeliveryMethods = () => {
    const baseMethods = [
      { value: 'post_office', label: 'Доставка на відділення' },
      { value: 'address', label: 'Доставка за адресою' }
    ];

    if (formData.city === 'Одеса') {
      return [
        ...baseMethods,
        { value: 'schedule', label: 'Доставка за графіком' },
        { value: 'taxi', label: 'Екстрена доставка (Таксі)' }
      ];
    }

    return baseMethods;
  };

  // Получение способов оплаты в зависимости от города
  const getPaymentMethods = () => {
    const baseMethods = [
      { value: 'cash_on_delivery', label: 'Накладений платіж' },
      { value: 'bank_transfer', label: 'Оплата за реквізитами' },
      { value: 'fop', label: 'Оплата ФОП' }
    ];

    if (formData.city === 'Одеса') {
      return [
        ...baseMethods,
        { value: 'cash', label: 'Оплата готівкою' }
      ];
    }

    return baseMethods;
  };

  // Расчет итоговой суммы с учетом скидки пользователя
  const getFinalPrice = () => {
    const total = getTotalPrice();
    const discount = user?.discount || 0;
    return total - (total * discount / 100);
  };

  // Проверка обязательных полей
  const isFormValid = () => {
    return formData.firstName &&
           formData.lastName &&
           formData.phone &&
           formData.city &&
           formData.deliveryMethod &&
           formData.paymentMethod &&
           (!formData.isPrivatePerson ? formData.establishmentName : true);
  };

  // Обработка отправки заказа
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    if (!user) {
      toast.error('Будь ласка, увійдіть в систему');
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        items: items,
        total: getFinalPrice(),
        status: 'pending' as const,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.deliveryDetails,
          city: formData.city,
          postalCode: '', // Можно добавить поле почтового индекса
          phone: formData.phone
        }
      };

      await createOrder(orderData);
      toast.success('Замовлення успішно оформлено!');
      navigate('/');
    } catch (error) {
      toast.error('Помилка при оформленні замовлення');
      console.error('Order error:', error);
    }
  };

  return (
    <CheckoutContainer>
      <Header>
        <Title>Оформлення замовлення</Title>
        <Subtitle>Заповніть форму для завершення замовлення</Subtitle>
      </Header>

      <CheckoutContent>
        <form onSubmit={handleSubmit}>
          {/* 1. Контактна інформація */}
          <FormSection>
            <SectionTitle>
              <FiUser />
              Контактна інформація
            </SectionTitle>
            <FormGrid>
              <FormField>
                <Label>Ім'я *</Label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </FormField>
              <FormField>
                <Label>Прізвище *</Label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </FormField>
            </FormGrid>
            <FormField>
              <Label>Номер телефону *</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+380 (XX) XXX XX XX"
                required
              />
            </FormField>
          </FormSection>

          {/* 2. Місто доставки */}
          <FormSection>
            <SectionTitle>
              <FiMapPin />
              Місто доставки
            </SectionTitle>
            <AutocompleteContainer>
              <FormField>
                <Label>Місто *</Label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={formData.city === 'Одеса'}
                  placeholder="Введіть назву міста"
                  required
                />
                {showCitySuggestions && citySuggestions.length > 0 && (
                  <SuggestionsList>
                    {citySuggestions.map((city, index) => (
                      <SuggestionItem
                        key={index}
                        onClick={() => {
                          handleInputChange('city', city);
                          setShowCitySuggestions(false);
                        }}
                      >
                        {city}
                      </SuggestionItem>
                    ))}
                  </SuggestionsList>
                )}
              </FormField>
            </AutocompleteContainer>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                id="odessa-quick"
                onChange={(e) => handleOdessaQuickSelect(e.target.checked)}
              />
              <CheckboxLabel htmlFor="odessa-quick">
                Місто Одеса
              </CheckboxLabel>
            </CheckboxContainer>
          </FormSection>

          {/* 3. Спосіб доставки */}
          <FormSection>
            <SectionTitle>
              <FiTruck />
              Спосіб доставки
            </SectionTitle>
            <FormField>
              <Label>Спосіб доставки *</Label>
              <Select
                value={formData.deliveryMethod}
                onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                required
              >
                <option value="">Оберіть спосіб доставки</option>
                {getDeliveryMethods().map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </Select>
            </FormField>

            {formData.deliveryMethod === 'post_office' && (
              <AutocompleteContainer>
                <FormField>
                  <Label>Відділення Нової Пошти *</Label>
                  <Input
                    type="text"
                    value={formData.deliveryDetails}
                    onChange={(e) => handleInputChange('deliveryDetails', e.target.value)}
                    onFocus={() => {
                      if (selectedCityRef && formData.deliveryDetails.length === 0) {
                        handleInputChange('deliveryDetails', '');
                      }
                    }}
                    placeholder="Натисніть для вибору відділення або введіть номер"
                    required
                  />
                  {showWarehouseSuggestions && warehouseSuggestions.length > 0 && (
                    <SuggestionsList>
                      {warehouseSuggestions.map((warehouse, index) => (
                        <SuggestionItem
                          key={index}
                          onClick={() => {
                            handleInputChange('deliveryDetails', `${warehouse.Description} (${warehouse.ShortAddress})`);
                            setShowWarehouseSuggestions(false);
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600' }}>{warehouse.Description}</div>
                            <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                              {warehouse.ShortAddress}
                            </div>
                            {warehouse.Phone && (
                              <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                                📞 {warehouse.Phone}
                              </div>
                            )}
                          </div>
                        </SuggestionItem>
                      ))}
                    </SuggestionsList>
                  )}
                </FormField>
              </AutocompleteContainer>
            )}

            {formData.deliveryMethod === 'address' && (
              <AutocompleteContainer>
                <FormField>
                  <Label>Адреса доставки *</Label>
                  <TextArea
                    value={formData.deliveryDetails}
                    onChange={(e) => handleInputChange('deliveryDetails', e.target.value)}
                    placeholder="Повна адреса доставки"
                    required
                  />
                  {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <SuggestionsList>
                      {addressSuggestions.map((suggestion, index) => (
                        <SuggestionItem
                          key={index}
                          onClick={() => {
                            handleInputChange('deliveryDetails', suggestion.description);
                            setShowAddressSuggestions(false);
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600' }}>
                              {suggestion.structured_formatting.main_text}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                              {suggestion.structured_formatting.secondary_text}
                            </div>
                          </div>
                        </SuggestionItem>
                      ))}
                    </SuggestionsList>
                  )}
                </FormField>
              </AutocompleteContainer>
            )}

            {formData.deliveryMethod === 'schedule' && (
              <>
                <AutocompleteContainer>
                  <FormField>
                    <Label>Адреса доставки *</Label>
                    <TextArea
                      value={formData.deliveryDetails}
                      onChange={(e) => handleInputChange('deliveryDetails', e.target.value)}
                      placeholder="Повна адреса доставки"
                      required
                    />
                    {showAddressSuggestions && addressSuggestions.length > 0 && (
                      <SuggestionsList>
                        {addressSuggestions.map((suggestion, index) => (
                          <SuggestionItem
                            key={index}
                            onClick={() => {
                              handleInputChange('deliveryDetails', suggestion.description);
                              setShowAddressSuggestions(false);
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: '600' }}>
                                {suggestion.structured_formatting.main_text}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                                {suggestion.structured_formatting.secondary_text}
                              </div>
                            </div>
                          </SuggestionItem>
                        ))}
                      </SuggestionsList>
                    )}
                  </FormField>
                </AutocompleteContainer>
                <Note>
                  Доставка здійснюється 1 раз на тиждень по середах.
                </Note>
              </>
            )}

            {formData.deliveryMethod === 'taxi' && (
              <>
                <AutocompleteContainer>
                  <FormField>
                    <Label>Адреса доставки *</Label>
                    <TextArea
                      value={formData.deliveryDetails}
                      onChange={(e) => handleInputChange('deliveryDetails', e.target.value)}
                      placeholder="Повна адреса доставки"
                      required
                    />
                    {showAddressSuggestions && addressSuggestions.length > 0 && (
                      <SuggestionsList>
                        {addressSuggestions.map((suggestion, index) => (
                          <SuggestionItem
                            key={index}
                            onClick={() => {
                              handleInputChange('deliveryDetails', suggestion.description);
                              setShowAddressSuggestions(false);
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: '600' }}>
                                {suggestion.structured_formatting.main_text}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                                {suggestion.structured_formatting.secondary_text}
                              </div>
                            </div>
                          </SuggestionItem>
                        ))}
                      </SuggestionsList>
                    )}
                  </FormField>
                </AutocompleteContainer>
                <Note>
                  Тариф таксі за термінову доставку оплачується клієнтом.
                </Note>
              </>
            )}
          </FormSection>

          {/* 4. Інформація про отримувача */}
          <FormSection>
            <SectionTitle>
              <FiUser />
              Інформація про отримувача
            </SectionTitle>
            <FormField>
              <Label>Назва закладу</Label>
              <Input
                type="text"
                value={formData.establishmentName}
                onChange={(e) => handleInputChange('establishmentName', e.target.value)}
                disabled={formData.isPrivatePerson}
                placeholder="Назва закладу"
              />
            </FormField>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                id="private-person"
                checked={formData.isPrivatePerson}
                onChange={(e) => handleInputChange('isPrivatePerson', e.target.checked)}
              />
              <CheckboxLabel htmlFor="private-person">
                Для приватної особи
              </CheckboxLabel>
            </CheckboxContainer>
          </FormSection>

          {/* 5. Спосіб оплати */}
          <FormSection>
            <SectionTitle>
              <FiCreditCard />
              Спосіб оплати
            </SectionTitle>
            <FormField>
              <Label>Спосіб оплати *</Label>
              <Select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                required
              >
                <option value="">Оберіть спосіб оплати</option>
                {getPaymentMethods().map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </FormSection>

          {/* 6. Перевірка замовлення */}
          <OrderSummarySection>
            <SectionTitle>
              <FiCheck />
              Перевірка замовлення та розрахунок
            </SectionTitle>
            
            <OrderSummaryHeader
              onClick={() => setIsOrderSummaryExpanded(!isOrderSummaryExpanded)}
            >
              <OrderSummaryTitle>
                Товари в замовленні ({getTotalItems()} позицій)
              </OrderSummaryTitle>
              {isOrderSummaryExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </OrderSummaryHeader>

            <OrderSummaryContent isExpanded={isOrderSummaryExpanded}>
              {items.map((item) => (
                <OrderItem key={item.product.id}>
                  <div>
                    <div>{item.product.name}</div>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                      {item.quantity} шт. × {item.product.price} грн
                    </div>
                  </div>
                  <div style={{ fontWeight: '600' }}>
                    {(item.product.price * item.quantity).toFixed(2)} грн
                  </div>
                </OrderItem>
              ))}
            </OrderSummaryContent>

            <TotalAmount>
              До сплати: {getFinalPrice().toFixed(2)} грн
              {user?.discount && user.discount > 0 && (
                <div style={{ fontSize: '0.9rem', fontWeight: '400', color: '#6c757d' }}>
                  (з урахуванням знижки {user.discount}%)
                </div>
              )}
            </TotalAmount>
          </OrderSummarySection>

          {/* 7. Завершення оформлення */}
          <FormSection>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                id="contact-clarification"
                checked={formData.contactForClarification}
                onChange={(e) => handleInputChange('contactForClarification', e.target.checked)}
              />
              <CheckboxLabel htmlFor="contact-clarification">
                Зв'язатися для уточнення інформації
              </CheckboxLabel>
            </CheckboxContainer>

            <ButtonContainer>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/cart')}
              >
                <FiArrowLeft />
                Повернутися до кошика
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!isFormValid()}
              >
                <FiCheck />
                Оформити замовлення
              </Button>
            </ButtonContainer>
          </FormSection>
        </form>
      </CheckoutContent>
    </CheckoutContainer>
  );
};

export default Checkout;