"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, Star, X } from "lucide-react"
import { uploadImage } from "@/lib/actions/upload"
import { cn } from "@/lib/utils"

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[]
  onChange: (images: string[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)
    setUploading(true)
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append("file", file)
      const res = await uploadImage(fd)
      if ("url" in res && res.url) uploaded.push(res.url)
      else if ("error" in res && res.error) setError(res.error)
    }
    if (uploaded.length) onChange([...images, ...uploaded])
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  function remove(url: string) {
    onChange(images.filter((i) => i !== url))
  }

  function makeCover(url: string) {
    onChange([url, ...images.filter((i) => i !== url)])
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((url, i) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
          >
            <Image
              src={url || "/placeholder.svg"}
              alt={`Foto ${i + 1}`}
              fill
              sizes="120px"
              className="object-cover"
            />
            {i === 0 && (
              <span className="absolute left-1 top-1 inline-flex items-center gap-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                <Star className="size-2.5 fill-current" />
                Capa
              </span>
            )}
            <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1 opacity-0 transition group-hover:opacity-100">
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(url)}
                  className="rounded-md bg-card/90 px-1.5 py-0.5 text-[10px] font-semibold text-foreground"
                >
                  Capa
                </button>
              )}
              <button
                type="button"
                aria-label="Remover foto"
                onClick={() => remove(url)}
                className="ml-auto flex size-6 items-center justify-center rounded-md bg-destructive text-destructive-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground transition hover:border-primary hover:text-primary",
            uploading && "opacity-60",
          )}
        >
          {uploading ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <ImagePlus className="size-6" />
          )}
          <span className="text-[11px] font-semibold">
            {uploading ? "Enviando" : "Adicionar"}
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p className="mt-2 text-xs font-medium text-destructive">{error}</p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        A primeira foto é a capa exibida na vitrine. Toque em uma foto para
        defini-la como capa.
      </p>
    </div>
  )
}
