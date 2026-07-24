import { ArrowLeft, FolderTree, PackageOpen } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAdminContext } from "../../../../lib/auth/admin";

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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId) {
    redirect("/auth");
  }

  if (!isAdmin) {
    redirect("/account");
  }

  const { id } = await params;
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id,name,slug,description,is_active,show_in_showcase,sort_order",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const category = data as CategoryRow;

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
