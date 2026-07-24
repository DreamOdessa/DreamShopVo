"use client";

import { Building2, LoaderCircle, MapPin, Package, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { createClient } from "../../lib/supabase/client";

type City = {
  name: string;
  ref: string;
};

type Warehouse = {
  kind: PickupKind;
  name: string;
  number: string;
  ref: string;
};

type PickupKind = "branch" | "locker";
type DeliveryMethod = "address" | "post_office" | "schedule" | "taxi";

type NovaPoshtaFieldsProps = {
  apiUrl: string;
  initialAddress: {
    city: string;
    deliveryDetails: string;
    deliveryMethod: DeliveryMethod;
  } | null;
};

function isDeliveryMethod(value: string): value is DeliveryMethod {
  return ["address", "post_office", "schedule", "taxi"].includes(value);
}

async function accessToken() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (error || !token) {
    throw new Error("auth_required");
  }

  return token;
}

async function deliveryRequest<T>(
  apiUrl: string,
  pathname: string,
  searchParams: Record<string, string>,
  signal: AbortSignal,
) {
  const url = new URL(pathname, `${apiUrl.replace(/\/+$/, "")}/`);

  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const token = await accessToken();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error("delivery_unavailable");
  }

  return (await response.json()) as T;
}

export function NovaPoshtaFields({
  apiUrl,
  initialAddress,
}: NovaPoshtaFieldsProps) {
  const [deliveryMethod, setDeliveryMethod] = useState(
    initialAddress?.deliveryMethod ?? "post_office",
  );
  const [manualEntry, setManualEntry] = useState(Boolean(initialAddress));
  const [cityQuery, setCityQuery] = useState(initialAddress?.city ?? "");
  const [selectedCityRef, setSelectedCityRef] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [pickupKind, setPickupKind] = useState<PickupKind>("branch");
  const [warehouseQuery, setWarehouseQuery] = useState(
    initialAddress?.deliveryDetails ?? "",
  );
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouseRef, setSelectedWarehouseRef] = useState("");
  const [cityLoading, setCityLoading] = useState(false);
  const [warehousesLoading, setWarehousesLoading] = useState(false);
  const [message, setMessage] = useState("");
  const warehouseInputRef = useRef<HTMLInputElement>(null);

  const usesNovaPoshta = deliveryMethod === "post_office" && !manualEntry;

  useEffect(() => {
    if (!usesNovaPoshta || cityQuery.trim().length < 2 || selectedCityRef) {
      setCityLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setCityLoading(true);
      setMessage("");

      try {
        const data = await deliveryRequest<{ cities: City[] }>(
          apiUrl,
          "/delivery/nova-poshta/cities",
          { q: cityQuery.trim() },
          controller.signal,
        );
        const nextCities = Array.isArray(data.cities) ? data.cities : [];

        setCities(nextCities);
        setMessage(
          nextCities.length
            ? "Оберіть населений пункт зі списку."
            : "Населений пункт не знайдено.",
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          setCities([]);
          setMessage(
            error instanceof Error && error.message === "auth_required"
              ? "Сесію завершено. Оновіть сторінку та увійдіть знову."
              : "Не вдалося завантажити міста. Скористайтеся ручним введенням.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCityLoading(false);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [apiUrl, cityQuery, selectedCityRef, usesNovaPoshta]);

  useEffect(() => {
    if (!usesNovaPoshta || !selectedCityRef) {
      setWarehouses([]);
      setSelectedWarehouseRef("");
      setWarehousesLoading(false);
      return;
    }

    if (selectedWarehouseRef) {
      setWarehousesLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setWarehousesLoading(true);
      setMessage("");

      try {
        const data = await deliveryRequest<{ warehouses: Warehouse[] }>(
          apiUrl,
          "/delivery/nova-poshta/warehouses",
          {
            cityRef: selectedCityRef,
            q: warehouseQuery.trim().slice(0, 80),
            type: pickupKind,
          },
          controller.signal,
        );
        const nextWarehouses = Array.isArray(data.warehouses)
          ? data.warehouses
          : [];

        setWarehouses(nextWarehouses);
        setMessage(
          nextWarehouses.length
            ? pickupKind === "branch"
              ? "Оберіть потрібне відділення."
              : "Оберіть потрібний поштомат."
            : pickupKind === "branch"
              ? "Відділення за цим запитом не знайдені."
              : "Поштомати за цим запитом не знайдені.",
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          setWarehouses([]);
          setMessage(
            error instanceof Error && error.message === "auth_required"
              ? "Сесію завершено. Оновіть сторінку та увійдіть знову."
              : "Не вдалося завантажити точки видачі. Скористайтеся ручним введенням.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setWarehousesLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [
    apiUrl,
    pickupKind,
    selectedCityRef,
    selectedWarehouseRef,
    usesNovaPoshta,
    warehouseQuery,
  ]);

  function selectCity(value: string) {
    setCityQuery(value);
    setWarehouseQuery("");
    setSelectedWarehouseRef("");
    warehouseInputRef.current?.setCustomValidity("");
    const selectedCity = cities.find((city) => city.name === value);

    setSelectedCityRef(selectedCity?.ref ?? "");
    if (!selectedCity) {
      setWarehouses([]);
    }
  }

  function changeDeliveryMethod(value: string) {
    if (!isDeliveryMethod(value)) {
      return;
    }

    setDeliveryMethod(value);
    setManualEntry(false);
    setMessage("");
  }

  function changePickupKind(value: PickupKind) {
    setPickupKind(value);
    setWarehouseQuery("");
    setSelectedWarehouseRef("");
    setWarehouses([]);
    setMessage("");
    warehouseInputRef.current?.setCustomValidity("");
  }

  function selectWarehouse(value: string, input: HTMLInputElement) {
    setWarehouseQuery(value);
    const selectedWarehouse = warehouses.find(
      (warehouse) => warehouse.name === value,
    );

    setSelectedWarehouseRef(selectedWarehouse?.ref ?? "");
    input.setCustomValidity(
      value && !selectedWarehouse
        ? pickupKind === "branch"
          ? "Оберіть відділення зі списку."
          : "Оберіть поштомат зі списку."
        : "",
    );

    if (selectedWarehouse) {
      setMessage(
        pickupKind === "branch"
          ? "Відділення обрано."
          : "Поштомат обрано.",
      );
    }
  }

  return (
    <>
      <label className="checkout-field">
        <span>Спосіб доставки</span>
        <select
          name="deliveryMethod"
          onChange={(event) => changeDeliveryMethod(event.target.value)}
          value={deliveryMethod}
        >
          <option value="post_office">Нова пошта</option>
          <option value="address">Адресна доставка</option>
          <option value="schedule">За розкладом</option>
          <option value="taxi">Таксі</option>
        </select>
      </label>

      {usesNovaPoshta ? (
        <>
          <label className="checkout-field">
            <span>Місто або населений пункт</span>
            <span className="checkout-input-wrap">
              <MapPin aria-hidden size={17} />
              <input
                aria-describedby="nova-poshta-status"
                autoComplete="address-level2"
                list="nova-poshta-cities"
                maxLength={80}
                minLength={2}
                name="city"
                onChange={(event) => selectCity(event.target.value)}
                placeholder="Почніть вводити назву"
                required
                value={cityQuery}
              />
              {cityLoading ? (
                <LoaderCircle
                  aria-hidden
                  className="auth-spinner checkout-input-spinner"
                  size={17}
                />
              ) : null}
            </span>
            <datalist id="nova-poshta-cities">
              {cities.map((city) => (
                <option key={city.ref} value={city.name} />
              ))}
            </datalist>
          </label>

          <fieldset className="checkout-pickup-type checkout-field-wide">
            <legend>Куди доставити</legend>
            <div className="checkout-segmented">
              <button
                aria-pressed={pickupKind === "branch"}
                className={pickupKind === "branch" ? "is-active" : ""}
                onClick={() => changePickupKind("branch")}
                type="button"
              >
                <Building2 aria-hidden size={17} />
                Відділення
              </button>
              <button
                aria-pressed={pickupKind === "locker"}
                className={pickupKind === "locker" ? "is-active" : ""}
                onClick={() => changePickupKind("locker")}
                type="button"
              >
                <Package aria-hidden size={17} />
                Поштомат
              </button>
            </div>
          </fieldset>

          <label className="checkout-field checkout-field-wide">
            <span>{pickupKind === "branch" ? "Відділення" : "Поштомат"}</span>
            <span className="checkout-input-wrap">
              <Search aria-hidden size={17} />
              <input
                aria-describedby="nova-poshta-status"
                disabled={!selectedCityRef}
                list="nova-poshta-warehouses"
                maxLength={500}
                minLength={2}
                name="deliveryDetails"
                onChange={(event) =>
                  selectWarehouse(event.target.value, event.currentTarget)
                }
                placeholder={
                  selectedCityRef
                    ? pickupKind === "branch"
                      ? "Введіть номер або вулицю та оберіть зі списку"
                      : "Введіть номер поштомата або вулицю"
                    : "Спочатку оберіть місто"
                }
                ref={warehouseInputRef}
                required
                value={warehouseQuery}
              />
              {warehousesLoading ? (
                <LoaderCircle
                  aria-hidden
                  className="auth-spinner checkout-input-spinner"
                  size={17}
                />
              ) : null}
            </span>
            <datalist id="nova-poshta-warehouses">
              {warehouses.map((warehouse) => (
                <option key={warehouse.ref} value={warehouse.name}>
                  {warehouse.name}
                </option>
              ))}
            </datalist>
          </label>

          <div
            aria-live="polite"
            className="checkout-delivery-status checkout-field-wide"
            id="nova-poshta-status"
          >
            <span>{message}</span>
            <button
              className="checkout-inline-action"
              onClick={() => {
                setManualEntry(true);
                setMessage("");
              }}
              type="button"
            >
              Ввести вручну
            </button>
          </div>
        </>
      ) : (
        <>
          <label className="checkout-field">
            <span>Місто</span>
            <input
              autoComplete="address-level2"
              defaultValue={cityQuery}
              maxLength={120}
              minLength={2}
              name="city"
              required
            />
          </label>
          <label className="checkout-field checkout-field-wide">
            <span>
              {deliveryMethod === "post_office"
                ? pickupKind === "branch"
                  ? "Відділення"
                  : "Поштомат"
                : "Адреса або деталі доставки"}
            </span>
            <textarea
              defaultValue={warehouseQuery}
              maxLength={500}
              minLength={2}
              name="deliveryDetails"
              placeholder={
                deliveryMethod === "post_office"
                  ? pickupKind === "branch"
                    ? "Наприклад: Нова пошта, відділення №12"
                    : "Наприклад: Нова пошта, поштомат №34188"
                  : "Вкажіть адресу та необхідні деталі"
              }
              required
              rows={3}
            />
          </label>
          {deliveryMethod === "post_office" ? (
            <div className="checkout-delivery-status checkout-field-wide">
              <span>Дані можна вказати вручну.</span>
              <button
                className="checkout-inline-action"
                onClick={() => {
                  setManualEntry(false);
                  setMessage("");
                }}
                type="button"
              >
                Обрати зі списку
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
