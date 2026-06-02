"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { REGIONS } from "@/lib/constants/regions";
import { coverUrl } from "@/lib/utils/storage";
import { useToast } from "@/components/ui/Toast";
import type { EventContent } from "@/lib/types/db";

type FormAction = (
  prev: unknown,
  formData: FormData,
) => Promise<{ error?: string } | void>;

export default function EventForm({
  userId,
  action,
  initial,
  submitLabel = "Salva",
}: {
  userId: string;
  action: FormAction;
  initial?: Partial<EventContent>;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const originalKey = initial?.cover_image_key ?? "";
  const [coverKey, setCoverKey] = useState(originalKey);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();
  const t = useTranslations("form");

  useEffect(() => {
    if (state?.error) showToast(state.error, "error");
  }, [state, showToast]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const key = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("covers")
        .upload(key, file, { upsert: false });
      if (error) throw error;
      setCoverKey(key);
      showToast(t("toastImageUploaded"), "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : t("toastUploadError"),
        "error",
      );
    } finally {
      setUploading(false);
    }
  }

  const coverPreview = coverUrl(coverKey);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="cover_image_key" value={coverKey} />
      <input type="hidden" name="original_cover_key" value={originalKey} />

      <div>
        <label className="field-label" htmlFor="title">
          {t("name")}
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initial?.title ?? ""}
          className="field-input"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="description">
          {t("description")}
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className="field-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label" htmlFor="start_date">
            {t("startDate")}
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            required
            defaultValue={initial?.start_date ?? ""}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="end_date">
            {t("endDate")}
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            required
            defaultValue={initial?.end_date ?? ""}
            className="field-input"
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="region">
          {t("region")}
        </label>
        <select
          id="region"
          name="region"
          required
          className="field-input"
          defaultValue={initial?.region ?? ""}
        >
          <option value="" disabled>
            {t("select")}
          </option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="card space-y-3 p-3">
        <legend className="px-1 font-head text-lg">{t("start")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor="start_comune">
              {t("comune")}
            </label>
            <input
              id="start_comune"
              name="start_comune"
              required
              placeholder="Firenze"
              defaultValue={initial?.start_comune ?? ""}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="start_provincia">
              {t("provincia")}
            </label>
            <input
              id="start_provincia"
              name="start_provincia"
              required
              placeholder="Firenze"
              defaultValue={initial?.start_provincia ?? ""}
              className="field-input"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="card space-y-3 p-3">
        <legend className="px-1 font-head text-lg">{t("end")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor="end_comune">
              {t("comune")}
            </label>
            <input
              id="end_comune"
              name="end_comune"
              placeholder="Siena"
              defaultValue={initial?.end_comune ?? ""}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="end_provincia">
              {t("provincia")}
            </label>
            <input
              id="end_provincia"
              name="end_provincia"
              placeholder="Siena"
              defaultValue={initial?.end_provincia ?? ""}
              className="field-input"
            />
          </div>
        </div>
      </fieldset>

      <div>
        <label className="field-label" htmlFor="official_url">
          {t("officialUrl")}
        </label>
        <input
          id="official_url"
          name="official_url"
          type="url"
          placeholder="https://…"
          defaultValue={initial?.official_url ?? ""}
          className="field-input"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="cover">
          {t("cover")}
        </label>
        {coverPreview && (
          <div className="mb-2 overflow-hidden rounded-lg border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverPreview}
              alt={t("cover")}
              className="aspect-[16/9] w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setCoverKey("")}
              className="block w-full bg-paper-soft py-1.5 font-body text-sm text-red-700 hover:bg-paper"
            >
              {t("removeImage")}
            </button>
          </div>
        )}
        <input
          id="cover"
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="field-input"
        />
        {uploading && (
          <p className="mt-1 font-body text-sm text-ink-soft">
            {t("uploading")}
          </p>
        )}
        {coverKey && !uploading && (
          <p className="mt-1 font-body text-sm text-accent-deep">
            {t("imageReady")}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending || uploading}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {pending ? t("saving") : submitLabel}
      </button>
    </form>
  );
}
