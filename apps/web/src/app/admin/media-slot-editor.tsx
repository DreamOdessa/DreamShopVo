"use client";

import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { createClient } from "../../lib/supabase/client";

import type { MediaActionResult } from "./media-actions";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type UploadedImageInput = {
  altText: string;
  mimeType: string;
  objectKey: string;
  sizeBytes: number;
};

type MediaSlotEditorProps = {
  apiUrl: string;
  currentImage: {
    altText: string;
    url: string;
  } | null;
  entityName: string;
  label: string;
  onRegister: (image: UploadedImageInput) => Promise<MediaActionResult>;
  onRemove: () => Promise<MediaActionResult>;
  scope: "categories" | "products";
};

type MessageState = {
  message: string;
  status: "error" | "idle" | "success";
};

async function accessToken() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session?.access_token) {
    throw new Error("Сесія завершилася. Увійдіть повторно.");
  }

  return data.session.access_token;
}

function mediaDeleteUrl(apiUrl: string, key: string) {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");

  return `${apiUrl}/admin/media/${encodedKey}`;
}

async function deleteStoredMedia(
  apiUrl: string,
  key: string,
  token: string,
) {
  const response = await fetch(mediaDeleteUrl(apiUrl, key), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  });

  return response.ok || response.status === 404;
}

export function MediaSlotEditor({
  apiUrl,
  currentImage,
  entityName,
  label,
  onRegister,
  onRemove,
  scope,
}: MediaSlotEditorProps) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<MessageState>({
    message: "",
    status: "idle",
  });

  function uploadImage(formData: FormData) {
    const file = formData.get("image");
    const altTextValue = formData.get("altText");
    const altText =
      typeof altTextValue === "string" ? altTextValue.trim() : entityName;

    if (!(file instanceof File) || file.size === 0) {
      setState({ message: "Оберіть файл зображення.", status: "error" });
      return;
    }

    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      setState({
        message: "Підтримуються JPEG, PNG, WebP та AVIF.",
        status: "error",
      });
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setState({
        message: "Розмір зображення не повинен перевищувати 10 МБ.",
        status: "error",
      });
      return;
    }

    startTransition(async () => {
      let token: string | null = null;
      let uploadedKey: string | null = null;
      let registered = false;

      try {
        token = await accessToken();
        const uploadResponse = await fetch(`${apiUrl}/admin/media`, {
          body: file,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": file.type,
            "X-Media-Scope": scope,
          },
          method: "POST",
        });
        const uploadBody = (await uploadResponse.json().catch(() => null)) as {
          key?: string;
          message?: string;
        } | null;

        if (!uploadResponse.ok || !uploadBody?.key) {
          throw new Error(
            uploadBody?.message ?? "Не вдалося завантажити зображення.",
          );
        }

        uploadedKey = uploadBody.key;

        const result = await onRegister({
          altText: altText || entityName,
          mimeType: file.type,
          objectKey: uploadedKey,
          sizeBytes: file.size,
        });

        if (result.status === "error") {
          throw new Error(result.message);
        }

        registered = true;
        let message = result.message;

        if (
          result.oldKey &&
          !(await deleteStoredMedia(apiUrl, result.oldKey, token))
        ) {
          message += " Старий файл потребує повторного очищення.";
        }

        setState({ message, status: "success" });

        if (fileInput.current) {
          fileInput.current.value = "";
        }

        router.refresh();
      } catch (error) {
        if (token && uploadedKey && !registered) {
          await deleteStoredMedia(apiUrl, uploadedKey, token).catch(() => false);
        }

        setState({
          message:
            error instanceof Error
              ? error.message
              : "Не вдалося завантажити зображення.",
          status: "error",
        });
      }
    });
  }

  function deleteImage() {
    if (!window.confirm(`Видалити «${label.toLowerCase()}»?`)) {
      return;
    }

    startTransition(async () => {
      try {
        const token = await accessToken();
        const result = await onRemove();

        if (result.status === "error" || !result.key) {
          throw new Error(result.message);
        }

        const removedFromStorage = await deleteStoredMedia(
          apiUrl,
          result.key,
          token,
        );

        setState({
          message: removedFromStorage
            ? result.message
            : `${result.message} Файл у сховищі потребує повторного очищення.`,
          status: "success",
        });
        router.refresh();
      } catch (error) {
        setState({
          message:
            error instanceof Error
              ? error.message
              : "Не вдалося видалити зображення.",
          status: "error",
        });
      }
    });
  }

  return (
    <article className="admin-media-slot">
      <h3>{label}</h3>

      <div className="admin-media-preview">
        {currentImage ? (
          <Image
            alt={currentImage.altText || entityName}
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            src={currentImage.url}
          />
        ) : (
          <div className="admin-media-empty">
            <ImagePlus aria-hidden size={30} strokeWidth={1.5} />
            <span>Фото ще не додано</span>
          </div>
        )}
      </div>

      <form action={uploadImage} className="admin-form">
        <label className="auth-field">
          <span>Файл</span>
          <input
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="admin-file-input"
            name="image"
            ref={fileInput}
            required
            type="file"
          />
        </label>

        <label className="auth-field">
          <span>Опис фото</span>
          <span className="auth-input-wrap">
            <input
              defaultValue={currentImage?.altText || entityName}
              maxLength={300}
              name="altText"
              type="text"
            />
          </span>
        </label>

        <div className="admin-media-actions">
          <button
            className="admin-submit-button"
            disabled={pending}
            type="submit"
          >
            {pending ? (
              <LoaderCircle aria-hidden className="auth-spinner" size={18} />
            ) : (
              <ImagePlus aria-hidden size={18} strokeWidth={1.8} />
            )}
            {currentImage ? "Замінити" : "Завантажити"}
          </button>

          {currentImage ? (
            <button
              className="admin-danger-button admin-media-delete"
              disabled={pending}
              onClick={deleteImage}
              title={`Видалити ${label.toLowerCase()}`}
              type="button"
            >
              <Trash2 aria-hidden size={18} strokeWidth={1.8} />
              <span className="sr-only">
                Видалити {label.toLowerCase()}
              </span>
            </button>
          ) : null}
        </div>

        <div
          aria-live="polite"
          className={`auth-message auth-message-${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </div>
      </form>
    </article>
  );
}
