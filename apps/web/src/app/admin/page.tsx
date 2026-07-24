import { ArrowLeft, FolderTree, PackageOpen, Pencil } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminContext } from "../../lib/auth/admin";

import { CategoryForm } from "./category-form";
import { ProductForm } from "./product-form";

export const metadata: Metadata = {
  title: "Каталог - DreamShop Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type CategoryRow = {
  id: string;
  is_active: boolean;
  name: string;
  slug: string;
  sort_order: number;
};

type ProductRow = {
  category: { name: string } | null;
  id: string;
  in_stock: boolean;
  is_active: boolean;
  name: string;
  price: number;
  slug: string;
};

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

export default async function AdminPage() {
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId) {
    redirect("/auth");
  }

  if (!isAdmin) {
    redirect("/account");
  }

  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id,name,slug,is_active,sort_order")
      .order("sort_order")
      .order("name"),
    supabase
      .from("products")
      .select(
        "id,name,slug,price,is_active,in_stock,category:categories!products_category_id_fkey(name)",
      )
      .order("created_at", { ascending: false }),
  ]);

  if (categoriesResult.error || productsResult.error) {
    throw new Error("Unable to load the admin catalog.");
  }

  const categories = (categoriesResult.data ?? []) as CategoryRow[];
  const products = (productsResult.data ?? []) as unknown as ProductRow[];

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Image
          className="admin-logo"
          src="/logo-name.PNG"
          alt="DreamShop"
          width={180}
          height={144}
          priority
        />
        <div className="admin-header-title">
          <span>Адмін-панель</span>
          <strong>Каталог</strong>
        </div>
        <Link className="icon-button" href="/account" title="До акаунта">
          <ArrowLeft aria-hidden size={20} strokeWidth={1.8} />
          <span className="sr-only">До акаунта</span>
        </Link>
      </header>

      <div className="admin-layout">
        <nav aria-label="Адміністративна навігація" className="admin-nav">
          <span aria-current="page">
            <PackageOpen aria-hidden size={18} strokeWidth={1.8} />
            Каталог
          </span>
        </nav>

        <div className="admin-content">
          <header className="admin-page-heading">
            <div>
              <p>Керування магазином</p>
              <h1>Каталог товарів</h1>
            </div>
            <dl className="admin-counts">
              <div>
                <dt>Категорій</dt>
                <dd>{categories.length}</dd>
              </div>
              <div>
                <dt>Товарів</dt>
                <dd>{products.length}</dd>
              </div>
            </dl>
          </header>

          <section className="admin-section" aria-labelledby="categories-title">
            <div className="admin-section-title">
              <FolderTree aria-hidden size={21} strokeWidth={1.8} />
              <h2 id="categories-title">Категорії</h2>
            </div>
            <div className="admin-workspace">
              <div className="admin-tool">
                <h3>Нова категорія</h3>
                <CategoryForm />
              </div>
              <div className="admin-list" aria-label="Список категорій">
                {categories.length ? (
                  categories.map((category) => (
                    <div className="admin-list-row" key={category.id}>
                      <div>
                        <strong>{category.name}</strong>
                        <span>/{category.slug}</span>
                      </div>
                      <div className="admin-list-actions">
                        <span
                          className={
                            category.is_active
                              ? "admin-state admin-state-active"
                              : "admin-state"
                          }
                        >
                          {category.is_active ? "Активна" : "Прихована"}
                        </span>
                        <Link
                          className="admin-row-button"
                          href={`/admin/categories/${category.id}`}
                          title={`Редагувати ${category.name}`}
                        >
                          <Pencil aria-hidden size={16} strokeWidth={1.8} />
                          <span className="sr-only">
                            Редагувати {category.name}
                          </span>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="admin-empty">
                    <FolderTree aria-hidden size={24} strokeWidth={1.6} />
                    <p>Категорій поки немає</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="admin-section" aria-labelledby="products-title">
            <div className="admin-section-title">
              <PackageOpen aria-hidden size={21} strokeWidth={1.8} />
              <h2 id="products-title">Товари</h2>
            </div>
            <div className="admin-workspace">
              <div className="admin-tool">
                <h3>Новий товар</h3>
                <ProductForm
                  categories={categories.map(({ id, name }) => ({ id, name }))}
                />
              </div>
              <div className="admin-list" aria-label="Список товарів">
                {products.length ? (
                  products.map((product) => (
                    <div className="admin-list-row" key={product.id}>
                      <div>
                        <strong>{product.name}</strong>
                        <span>
                          {product.category?.name ?? "Без категорії"} ·{" "}
                          {priceFormatter.format(product.price)}
                        </span>
                      </div>
                      <div className="admin-list-actions">
                        <span
                          className={
                            product.is_active && product.in_stock
                              ? "admin-state admin-state-active"
                              : "admin-state"
                          }
                        >
                          {product.is_active && product.in_stock
                            ? "У продажу"
                            : "Неактивний"}
                        </span>
                        <Link
                          className="admin-row-button"
                          href={`/admin/products/${product.id}`}
                          title={`Редагувати ${product.name}`}
                        >
                          <Pencil aria-hidden size={16} strokeWidth={1.8} />
                          <span className="sr-only">
                            Редагувати {product.name}
                          </span>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="admin-empty">
                    <PackageOpen aria-hidden size={24} strokeWidth={1.6} />
                    <p>Товарів поки немає</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
