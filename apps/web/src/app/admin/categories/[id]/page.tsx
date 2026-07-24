import { ArrowLeft, FolderTree, ImageIcon, PackageOpen } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAdminContext } from "../../../../lib/auth/admin";
import { getApiUrl } from "../../../../lib/env";

import { CategoryImageManager } from "../../category-image-manager";
import { CategoryEditForm } from "../../category-edit-form";

export const metadata: Metadata = {
  title: "Редагування категорії - DreamShop Admin",
  robots: {
    follow: false,
    index: false,
  },
};

type CategoryRow = {
  description: string;
  id: string;
  is_active: boolean;
  name: string;
  show_in_showcase: boolean;
  slug: string;
  sort_order: number;
};

type CategoryPageProps = {
  params: Promise<{ id: string }>;
};

type MediaRow = {
  alt_text: string;
  object_key: string;
};

function publicMediaUrl(apiUrl: string, key: string) {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");

  return `${apiUrl}/media/${encodedKey}`;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId) {
    redirect("/auth");
  }

  if (!isAdmin) {
    redirect("/account");
  }

  const { id } = await params;
  const [categoryResult, mediaResult] = await Promise.all([
    supabase
      .from("categories")
      .select(
        "id,name,slug,description,is_active,show_in_showcase,sort_order",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("category_media")
      .select("object_key,alt_text")
      .eq("category_id", id)
      .eq("kind", "cover")
      .maybeSingle(),
  ]);

  if (categoryResult.error || !categoryResult.data) {
    notFound();
  }

  if (mediaResult.error) {
    throw new Error("Unable to load category cover.");
  }

  const category = categoryResult.data as CategoryRow;
  const media = mediaResult.data as MediaRow | null;
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
        <nav aria-label="Адміністративна навігація" className="admin-nav">
          <Link href="/admin">
            <PackageOpen aria-hidden size={18} strokeWidth={1.8} />
            Каталог
          </Link>
        </nav>

        <div className="admin-content">
          <header className="admin-page-heading">
            <div>
              <p>Категорія</p>
              <h1>{category.name}</h1>
            </div>
          </header>

          <section className="admin-section" aria-labelledby="category-media">
            <div className="admin-section-title">
              <ImageIcon aria-hidden size={21} strokeWidth={1.8} />
              <h2 id="category-media">Обкладинка</h2>
            </div>
            <CategoryImageManager
              apiUrl={apiUrl}
              categoryId={category.id}
              categoryName={category.name}
              currentImage={
                media
                  ? {
                      altText: media.alt_text,
                      url: publicMediaUrl(apiUrl, media.object_key),
                    }
                  : null
              }
            />
          </section>

          <section className="admin-section" aria-labelledby="category-edit">
            <div className="admin-section-title">
              <FolderTree aria-hidden size={21} strokeWidth={1.8} />
              <h2 id="category-edit">Налаштування категорії</h2>
            </div>
            <div className="admin-tool admin-edit-tool">
              <CategoryEditForm
                category={{
                  description: category.description,
                  id: category.id,
                  isActive: category.is_active,
                  name: category.name,
                  showInShowcase: category.show_in_showcase,
                  slug: category.slug,
                  sortOrder: category.sort_order,
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
