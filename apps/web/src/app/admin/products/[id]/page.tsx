import { ArrowLeft, ImageIcon, Settings2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAdminContext } from "../../../../lib/auth/admin";
import { getApiUrl } from "../../../../lib/env";

import { AdminNavigation } from "../../admin-navigation";
import type { ProductImageSlot } from "../../media-actions";
import { ProductEditForm } from "../../product-edit-form";
import { ProductImageManager } from "../../product-image-manager";

export const metadata: Metadata = {
  title: "Редагування товару - DreamShop Admin",
  robots: {
    follow: false,
    index: false,
  },
};

type ProductRow = {
  category_id: string;
  description: string;
  id: string;
  in_stock: boolean;
  is_active: boolean;
  is_popular: boolean;
  name: string;
  organic: boolean;
  original_price: number | null;
  price: number;
  slug: string;
  sort_order: number;
  stock_quantity: number | null;
  weight: string | null;
};

type CategoryRow = {
  id: string;
  name: string;
};

type MediaRow = {
  alt_text: string;
  object_key: string;
  sort_order: number;
};

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

function publicMediaUrl(apiUrl: string, key: string) {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");

  return `${apiUrl}/media/${encodedKey}`;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId) {
    redirect("/auth");
  }

  if (!isAdmin) {
    redirect("/account");
  }

  const { id } = await params;
  const [productResult, categoriesResult, mediaResult] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,sort_order,stock_quantity",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase.from("categories").select("id,name").order("sort_order").order("name"),
    supabase
      .from("product_media")
      .select("object_key,alt_text,sort_order")
      .eq("product_id", id)
      .in("sort_order", [0, 1, 2])
      .order("sort_order"),
  ]);

  if (productResult.error || !productResult.data) {
    notFound();
  }

  if (categoriesResult.error || mediaResult.error) {
    throw new Error("Unable to load product settings.");
  }

  const product = productResult.data as ProductRow;
  const categories = (categoriesResult.data ?? []) as CategoryRow[];
  const media = (mediaResult.data ?? []) as MediaRow[];
  const apiUrl = getApiUrl();

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
        <Link className="icon-button" href="/admin" title="До каталогу">
          <ArrowLeft aria-hidden size={20} strokeWidth={1.8} />
          <span className="sr-only">До каталогу</span>
        </Link>
      </header>

      <div className="admin-layout">
        <AdminNavigation active="catalog" />

        <div className="admin-content">
          <header className="admin-page-heading">
            <div>
              <p>Товар</p>
              <h1>{product.name}</h1>
            </div>
          </header>

          <section className="admin-section" aria-labelledby="product-media">
            <div className="admin-section-title">
              <ImageIcon aria-hidden size={21} strokeWidth={1.8} />
              <h2 id="product-media">Фотографії товару</h2>
            </div>
            <ProductImageManager
              apiUrl={apiUrl}
              images={media.map((image) => ({
                altText: image.alt_text,
                slot: image.sort_order as ProductImageSlot,
                url: publicMediaUrl(apiUrl, image.object_key),
              }))}
              productId={product.id}
              productName={product.name}
            />
          </section>

          <section className="admin-section" aria-labelledby="product-edit">
            <div className="admin-section-title">
              <Settings2 aria-hidden size={21} strokeWidth={1.8} />
              <h2 id="product-edit">Дані товару</h2>
            </div>
            <div className="admin-tool admin-edit-tool">
              <ProductEditForm
                categories={categories}
                product={{
                  categoryId: product.category_id,
                  description: product.description,
                  id: product.id,
                  inStock: product.in_stock,
                  isActive: product.is_active,
                  isPopular: product.is_popular,
                  name: product.name,
                  organic: product.organic,
                  originalPrice: product.original_price,
                  price: product.price,
                  slug: product.slug,
                  sortOrder: product.sort_order,
                  stockQuantity: product.stock_quantity,
                  weight: product.weight,
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
