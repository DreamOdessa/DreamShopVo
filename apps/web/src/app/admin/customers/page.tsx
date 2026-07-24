import {
  ArrowLeft,
  ArrowRight,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminContext } from "../../../lib/auth/admin";
import { isTelegramAuthEmail } from "../../../lib/auth/telegram";

import { AdminNavigation } from "../admin-navigation";
import { CustomerDiscountForm } from "./customer-discount-form";

export const metadata: Metadata = {
  title: "Клієнти - DreamShop Admin",
  robots: {
    follow: false,
    index: false,
  },
};

type AdminCustomersPageProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
};

type CustomerRow = {
  contact_phone: string | null;
  created_at: string;
  discount_percent: number;
  email: string | null;
  first_name: string;
  id: string;
  last_name: string | null;
  phone: string | null;
  role: "customer" | "tester";
};

const PAGE_SIZE = 25;

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "medium",
  timeZone: "Europe/Kyiv",
});

function normalizedSearch(value?: string) {
  return (value ?? "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}@._+\-\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function pageFrom(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function customersHref({ page, query }: { page?: number; query: string }) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();
  return search ? `/admin/customers?${search}` : "/admin/customers";
}

function customerSearchFilter(query: string) {
  const filters = [
    `first_name.ilike.%${query}%`,
    `last_name.ilike.%${query}%`,
    `email.ilike.%${query}%`,
  ];
  const digits = query.replace(/\D/g, "");

  if (digits.length >= 3) {
    filters.push(`phone.ilike.%${digits}%`);
    filters.push(`contact_phone.ilike.%${digits}%`);
  }

  return filters.join(",");
}

function customerContact(customer: CustomerRow) {
  const email = isTelegramAuthEmail(customer.email) ? null : customer.email;
  return {
    email,
    phone: customer.contact_phone ?? customer.phone,
  };
}

export default async function AdminCustomersPage({
  searchParams,
}: AdminCustomersPageProps) {
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId) {
    redirect("/auth");
  }

  if (!isAdmin) {
    redirect("/account");
  }

  const params = await searchParams;
  const searchQuery = normalizedSearch(params.q);
  const currentPage = pageFrom(params.page);
  const rangeStart = (currentPage - 1) * PAGE_SIZE;
  let customersQuery = supabase
    .from("profiles")
    .select(
      "id,first_name,last_name,email,phone,contact_phone,discount_percent,role,created_at",
      { count: "exact" },
    )
    .neq("role", "admin")
    .order("created_at", { ascending: false })
    .range(rangeStart, rangeStart + PAGE_SIZE - 1);

  if (searchQuery) {
    customersQuery = customersQuery.or(customerSearchFilter(searchQuery));
  }

  const [customersResult, totalResult, discountedResult] = await Promise.all([
    customersQuery,
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .neq("role", "admin"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .neq("role", "admin")
      .gt("discount_percent", 0),
  ]);

  if (currentPage > 1 && customersResult.error?.code === "PGRST103") {
    redirect(customersHref({ query: searchQuery }));
  }

  if (customersResult.error || totalResult.error || discountedResult.error) {
    throw new Error("Unable to load customers.");
  }

  const customers = (customersResult.data ?? []) as unknown as CustomerRow[];
  const filteredCustomerCount = customersResult.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(filteredCustomerCount / PAGE_SIZE));

  if (!customers.length && currentPage > 1) {
    redirect(customersHref({ query: searchQuery }));
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Image
          alt="DreamShop"
          className="admin-logo"
          height={144}
          priority
          src="/logo-name.PNG"
          width={180}
        />
        <div className="admin-header-title">
          <span>Адмін-панель</span>
          <strong>Клієнти</strong>
        </div>
        <Link className="icon-button" href="/account" title="До акаунта">
          <ArrowLeft aria-hidden size={20} strokeWidth={1.8} />
          <span className="sr-only">До акаунта</span>
        </Link>
      </header>

      <div className="admin-layout">
        <AdminNavigation active="customers" />

        <div className="admin-content">
          <header className="admin-page-heading">
            <div>
              <p>Керування магазином</p>
              <h1>Клієнти</h1>
            </div>
            <dl className="admin-counts">
              <div>
                <dt>Усього</dt>
                <dd>{totalResult.count ?? 0}</dd>
              </div>
              <div>
                <dt>Зі знижкою</dt>
                <dd>{discountedResult.count ?? 0}</dd>
              </div>
            </dl>
          </header>

          <form
            action="/admin/customers"
            aria-label="Пошук клієнтів"
            className="admin-order-search"
            method="get"
          >
            <label>
              <span className="sr-only">Ім’я, телефон або email</span>
              <input
                autoComplete="off"
                defaultValue={searchQuery}
                maxLength={80}
                name="q"
                placeholder="Ім’я, телефон або email"
                type="search"
              />
            </label>
            <button title="Знайти клієнта" type="submit">
              <Search aria-hidden size={17} strokeWidth={1.8} />
              <span className="sr-only">Знайти клієнта</span>
            </button>
            {searchQuery ? (
              <Link href="/admin/customers" title="Очистити пошук">
                <X aria-hidden size={17} strokeWidth={1.8} />
                <span className="sr-only">Очистити пошук</span>
              </Link>
            ) : null}
          </form>

          <section
            aria-label="Список клієнтів"
            className="admin-customers-list"
          >
            {customers.length ? (
              customers.map((customer) => {
                const contact = customerContact(customer);

                return (
                  <article className="admin-customer-row" key={customer.id}>
                    <span className="admin-customer-icon">
                      <UserRound aria-hidden size={20} strokeWidth={1.6} />
                    </span>
                    <div className="admin-customer-name">
                      <strong>
                        {customer.first_name} {customer.last_name ?? ""}
                      </strong>
                      <span>
                        {customer.role === "tester" ? "Тестер" : "Клієнт"} · з{" "}
                        {dateFormatter.format(new Date(customer.created_at))}
                      </span>
                    </div>
                    <div className="admin-customer-contact">
                      <strong>{contact.phone ?? "Телефон не вказано"}</strong>
                      <span>
                        {contact.email ??
                          (customer.phone ? "Вхід через Telegram" : "Email не вказано")}
                      </span>
                    </div>
                    <div className="admin-customer-discount">
                      <span>Персональна знижка</span>
                      <CustomerDiscountForm
                        customerId={customer.id}
                        discountPercent={Number(customer.discount_percent)}
                      />
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="admin-empty">
                <UsersRound aria-hidden size={26} strokeWidth={1.5} />
                <p>
                  {searchQuery
                    ? "За вашим запитом клієнтів не знайдено"
                    : "Зареєстрованих клієнтів поки немає"}
                </p>
              </div>
            )}
          </section>

          {filteredCustomerCount ? (
            <div className="admin-order-results">
              <span>Знайдено: {filteredCustomerCount}</span>
              {pageCount > 1 ? (
                <nav aria-label="Сторінки клієнтів">
                  {currentPage > 1 ? (
                    <Link
                      href={customersHref({
                        page: currentPage - 1,
                        query: searchQuery,
                      })}
                      title="Попередня сторінка"
                    >
                      <ArrowLeft aria-hidden size={17} strokeWidth={1.8} />
                      <span className="sr-only">Попередня сторінка</span>
                    </Link>
                  ) : (
                    <span aria-hidden className="is-disabled">
                      <ArrowLeft size={17} strokeWidth={1.8} />
                    </span>
                  )}
                  <strong>
                    {currentPage} / {pageCount}
                  </strong>
                  {currentPage < pageCount ? (
                    <Link
                      href={customersHref({
                        page: currentPage + 1,
                        query: searchQuery,
                      })}
                      title="Наступна сторінка"
                    >
                      <ArrowRight aria-hidden size={17} strokeWidth={1.8} />
                      <span className="sr-only">Наступна сторінка</span>
                    </Link>
                  ) : (
                    <span aria-hidden className="is-disabled">
                      <ArrowRight size={17} strokeWidth={1.8} />
                    </span>
                  )}
                </nav>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
