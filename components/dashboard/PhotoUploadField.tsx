"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageUp } from "lucide-react";

export function PhotoUploadField({
  name = "photo",
  currentUrl,
  label = "Foto",
  hint = "JPG, PNG, atau WebP. Maksimal 5MB.",
}: {
  name?: string;
  currentUrl?: string | null;
  label?: string;
  hint?: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-green-light">
          {preview ? (
            <Image src={preview} alt="Preview" fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-brand-green-dark/40">
              <ImageUp size={24} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            name={name}
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-green-light file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-brand-green-dark hover:file:bg-brand-green/20"
          />
          <p className="mt-1 text-xs text-muted">{hint}</p>
        </div>
      </div>
      {currentUrl && (
        <input type="hidden" name="current_photo_url" value={currentUrl} />
      )}
    </div>
  );
}
