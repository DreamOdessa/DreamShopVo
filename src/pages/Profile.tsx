import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiLogOut, FiEdit3, FiSave, FiX, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { novaPoshtaApi } from '../services/novaPoshtaApi';
import { geocodingApi } from '../services/geocodingApi';
import toast from 'react-hot-toast';

const ProfileContainer = styled.div`
  padding: 2rem 0;
  min-height: 80vh;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.9), rgba(224, 242, 254, 0.8));
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    z-index: -1;
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: #1f4b5fff;
  padding: 7rem 0;
  text-align: center;
  margin-top: -7rem;
  background-image: url('https://firebasestorage.googleapis.com/v0/b/dreamshop-odessa.firebasestorage.app/o/products%2Fhover%2FPhotoroom_20251106_130558.png?alt=media&token=7fae918c-5977-479f-aa04-fa1870b2a119');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(77, 208, 225, 0.14) 0%, rgba(38, 197, 218, 0.44) 50%, rgba(0, 171, 193, 0.57) 100%);
    z-index: 1;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  position: relative;
  z-index: 2;
`;

const ProfileContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProfileSidebar = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  margin: 0 auto 1rem;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: #6c757d;
  font-size: 1rem;
`;

const MenuItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuItem = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: none;
  background: ${props => props.isActive ? '#f8f9fa' : 'transparent'};
  color: ${props => props.isActive ? '#667eea' : '#6c757d'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    background: #f8f9fa;
    color: #667eea;
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;


const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 150, 136, 0.3);
          }
        `;
      case 'danger':
        return `
          background: #e74c3c;
          color: white;
          &:hover {
            background: #c0392b;
          }
        `;
      default:
        return `
          background: #f8f9fa;
          color: #6c757d;
          border: 2px solid #e9ecef;
          &:hover {
            background: #e9ecef;
          }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
  }
`;

// Новые стили для полей формы
const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
`;

const Input = styled.input<{ disabled?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.disabled ? '#f8f9fa' : 'white'};
  color: ${props => props.disabled ? '#6c757d' : '#2c3e50'};

  &:focus {
    outline: none;
    border-color: #4dd0e1;
    box-shadow: 0 0 0 3px rgba(77, 208, 225, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea<{ disabled?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.disabled ? '#f8f9fa' : 'white'};
  color: ${props => props.disabled ? '#6c757d' : '#2c3e50'};
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #4dd0e1;
    box-shadow: 0 0 0 3px rgba(77, 208, 225, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
`;

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


const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    novaPoshtaOffice: user?.novaPoshtaOffice || '',
    address: user?.address || '',
    establishmentName: user?.establishmentName || '',
    isPrivatePerson: user?.isPrivatePerson ?? true
  });

  // Загружаем данные профиля из localStorage при монтировании
  useEffect(() => {
    const savedProfile = localStorage.getItem('dreamshop_profile');
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setEditData(prev => ({
        ...prev,
        ...profileData
      }));
    }
  }, []);

  // Сохраняем данные профиля в localStorage при изменении
  useEffect(() => {
    if (user) {
      const profileData = {
        name: editData.name,
        lastName: editData.lastName,
        phone: editData.phone,
        city: editData.city,
        novaPoshtaOffice: editData.novaPoshtaOffice,
        address: editData.address,
        establishmentName: editData.establishmentName,
        isPrivatePerson: editData.isPrivatePerson
      };
      localStorage.setItem('dreamshop_profile', JSON.stringify(profileData));
    }
  }, [editData, user]);

  // Состояние для автоподсказок
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [warehouseSuggestions, setWarehouseSuggestions] = useState<any[]>([]);
  const [showWarehouseSuggestions, setShowWarehouseSuggestions] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

  // Обновляем состояние при изменении пользователя (только если нет сохраненных данных)
  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem('dreamshop_profile');
      if (!savedProfile) {
        // Только если нет сохраненных данных, загружаем из user
        setEditData({
          name: user.name || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          city: user.city || '',
          novaPoshtaOffice: user.novaPoshtaOffice || '',
          address: user.address || '',
          establishmentName: user.establishmentName || '',
          isPrivatePerson: user.isPrivatePerson ?? true
        });
      }
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!user) return;
      
      // Обновляем данные пользователя в Firebase
      const updatedUser = {
        ...user,
        name: editData.name,
        lastName: editData.lastName,
        phone: editData.phone,
        city: editData.city,
        novaPoshtaOffice: editData.novaPoshtaOffice,
        address: editData.address,
        establishmentName: editData.establishmentName,
        isPrivatePerson: editData.isPrivatePerson
      };
      
      // Сохраняем в Firebase через userService
      const { userService } = await import('../firebase/services');
      await userService.createOrUpdate(updatedUser);
      
      // Сохраняем в localStorage
      const profileData = {
        name: editData.name,
        lastName: editData.lastName,
        phone: editData.phone,
        city: editData.city,
        novaPoshtaOffice: editData.novaPoshtaOffice,
        address: editData.address,
        establishmentName: editData.establishmentName,
        isPrivatePerson: editData.isPrivatePerson
      };
      localStorage.setItem('dreamshop_profile', JSON.stringify(profileData));
      
      setIsEditing(false);
      toast.success('Профіль оновлено!');
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      toast.error('Помилка при збереженні профілю');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    
    // Загружаем сохраненные данные из localStorage
    const savedProfile = localStorage.getItem('dreamshop_profile');
    const profileData = savedProfile ? JSON.parse(savedProfile) : {};
    
    setEditData({
      name: profileData.name || user?.name || '',
      lastName: profileData.lastName || user?.lastName || '',
      email: user?.email || '',
      phone: profileData.phone || user?.phone || '',
      city: profileData.city || user?.city || '',
      novaPoshtaOffice: profileData.novaPoshtaOffice || user?.novaPoshtaOffice || '',
      address: profileData.address || user?.address || '',
      establishmentName: profileData.establishmentName || user?.establishmentName || '',
      isPrivatePerson: profileData.isPrivatePerson !== undefined ? profileData.isPrivatePerson : (user?.isPrivatePerson ?? true)
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('Ви вийшли з системи');
  };

  const handleInputChange = async (field: string, value: string | boolean) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));

    const stringValue = value as string;

    // Логика для автоподсказок городов
    if (field === 'city') {
      if (stringValue.length > 1) {
        const filtered = ukrainianCities.filter(city =>
          city.toLowerCase().includes(stringValue.toLowerCase())
        );
        setCitySuggestions(filtered);
        setShowCitySuggestions(true);
      } else {
        setShowCitySuggestions(false);
      }
    }

    // Логика для отделений Новой Почты
    if (field === 'novaPoshtaOffice' && editData.city) {
      if (stringValue.length > 2) {
        try {
          const cities = await novaPoshtaApi.searchCities(editData.city);
          if (cities.length > 0) {
            const warehouses = await novaPoshtaApi.searchWarehouses(stringValue, cities[0].Ref);
            setWarehouseSuggestions(warehouses);
            setShowWarehouseSuggestions(true);
          }
        } catch (error) {
          console.error('Ошибка поиска отделений Новой Почты:', error);
        }
      } else {
        setShowWarehouseSuggestions(false);
      }
    }

    // Логика для автоподсказок адресов
    if (field === 'address') {
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

  if (!user) {
    return (
      <ProfileContainer>
        <div className="container">
          <EmptyState>
            <h3>Войдите в систему</h3>
            <p>Для доступа к профилю необходимо войти в систему</p>
          </EmptyState>
        </div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Header>
        <div className="container">
          <Title>Мій профіль</Title>
          <Subtitle>Керуйте своїми даними та замовленнями</Subtitle>
        </div>
      </Header>

      <ProfileContent>
        <ProfileSidebar>
          <UserInfo>
            <Avatar>
              <FiUser />
            </Avatar>
            <UserName>{user.name} {user.lastName && user.lastName}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </UserInfo>

          <MenuItems>
            <MenuItem
              isActive={true}
            >
              <FiUser />
              Профіль
            </MenuItem>
          </MenuItems>
        </ProfileSidebar>

        <MainContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
              <SectionTitle>
                <FiUser />
                Особиста інформація
              </SectionTitle>

              <FormField>
                <Label htmlFor="name">Ім'я *</Label>
                <Input
                  type="text"
                  id="name"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </FormField>

              <FormField>
                <Label htmlFor="lastName">Прізвище</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={editData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Введіть прізвище"
                />
              </FormField>

              <FormField>
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  id="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </FormField>

              <FormField>
                <Label htmlFor="phone">Номер телефону *</Label>
                <Input
                  type="tel"
                  id="phone"
                  value={editData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="+380 (XX) XXX XX XX"
                />
              </FormField>

              <SectionTitle>
                <FiMapPin />
                Адресна інформація
              </SectionTitle>

              <FormField>
                <Label htmlFor="city">Місто *</Label>
                <AutocompleteContainer>
                  <Input
                    type="text"
                    id="city"
                    value={editData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Введіть місто"
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
                </AutocompleteContainer>
              </FormField>

              <FormField>
                <Label htmlFor="novaPoshtaOffice">Відділення Нової Пошти / Поштомат</Label>
                <AutocompleteContainer>
                  <Input
                    type="text"
                    id="novaPoshtaOffice"
                    value={editData.novaPoshtaOffice}
                    onChange={(e) => handleInputChange('novaPoshtaOffice', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Введіть назву відділення"
                  />
                  {showWarehouseSuggestions && warehouseSuggestions.length > 0 && (
                    <SuggestionsList>
                      {warehouseSuggestions.map((warehouse, index) => (
                        <SuggestionItem 
                          key={index}
                          onClick={() => {
                            handleInputChange('novaPoshtaOffice', warehouse.Description);
                            setShowWarehouseSuggestions(false);
                          }}
                        >
                          {warehouse.Description}
                        </SuggestionItem>
                      ))}
                    </SuggestionsList>
                  )}
                </AutocompleteContainer>
              </FormField>

              <FormField>
                <Label htmlFor="address">Адреса</Label>
                <AutocompleteContainer>
                  <TextArea
                    id="address"
                    value={editData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Введіть адресу для кур'єрської доставки"
                  />
                  {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <SuggestionsList>
                      {addressSuggestions.map((suggestion, index) => (
                        <SuggestionItem 
                          key={index}
                          onClick={() => {
                            handleInputChange('address', suggestion.description);
                            setShowAddressSuggestions(false);
                          }}
                        >
                          {suggestion.description}
                        </SuggestionItem>
                      ))}
                    </SuggestionsList>
                  )}
                </AutocompleteContainer>
              </FormField>

              <SectionTitle>
                <FiUser />
                Інформація про заклад
              </SectionTitle>

              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="isPrivatePerson"
                  checked={editData.isPrivatePerson}
                  onChange={(e) => handleInputChange('isPrivatePerson', e.target.checked)}
                  disabled={!isEditing}
                />
                <CheckboxLabel htmlFor="isPrivatePerson">Приватна особа</CheckboxLabel>
              </CheckboxContainer>

              <FormField>
                <Label htmlFor="establishmentName">Назва закладу</Label>
                <Input
                  type="text"
                  id="establishmentName"
                  value={editData.isPrivatePerson ? '' : editData.establishmentName}
                  onChange={(e) => handleInputChange('establishmentName', e.target.value)}
                  disabled={!isEditing || editData.isPrivatePerson}
                  placeholder={editData.isPrivatePerson ? 'Не застосовується' : 'Введіть назву закладу'}
                />
              </FormField>

              <ButtonGroup>
                {isEditing ? (
                  <>
                    <Button variant="primary" onClick={handleSave}>
                      <FiSave />
                      Зберегти
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      <FiX />
                      Скасувати
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={handleEdit}>
                    <FiEdit3 />
                    Редагувати
                  </Button>
                )}
                <Button variant="danger" onClick={handleLogout}>
                  <FiLogOut />
                  Вийти
                </Button>
              </ButtonGroup>
          </motion.div>
        </MainContent>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;

