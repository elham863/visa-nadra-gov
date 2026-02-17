"use client";

import { useState, useRef } from "react";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const VISA_PHOTO_ASPECT = 95 / 115; // width / height, passport style
const TARGET_WIDTH = 380;
const TARGET_HEIGHT = Math.round(TARGET_WIDTH / VISA_PHOTO_ASPECT);
const ASPECT_TOLERANCE = 0.03; // skip crop if image aspect is within 3% of target
const MAX_SIZE_NO_CROP = 1200; // if image is smaller than this and aspect is good, skip crop

type PhotoUploadProps = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

/** Crop in pixelCrop is relative to the *displayed* image element. Convert to natural coords and draw. */
function getCroppedCanvas(
  image: HTMLImageElement,
  pixelCrop: PixelCrop,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const rect = image.getBoundingClientRect();
  const displayedWidth = rect.width || image.offsetWidth || image.clientWidth || image.width;
  const displayedHeight = rect.height || image.offsetHeight || image.clientHeight || image.height;
  const scaleX = image.naturalWidth / displayedWidth;
  const scaleY = image.naturalHeight / displayedHeight;

  const cropX = (pixelCrop.x ?? 0) * scaleX;
  const cropY = (pixelCrop.y ?? 0) * scaleY;
  const cropW = (pixelCrop.width ?? 0) * scaleX;
  const cropH = (pixelCrop.height ?? 0) * scaleY;

  ctx.drawImage(
    image,
    cropX, cropY, cropW, cropH,
    0, 0, targetWidth, targetHeight
  );
  return canvas;
}

function drawFullImageCanvas(
  image: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    targetWidth,
    targetHeight
  );
  return canvas;
}

/** Initial crop in displayed pixels (container width/height) so ReactCrop shows it correctly. */
function centerAspectCrop(
  containerWidth: number,
  containerHeight: number,
  aspect: number
): PixelCrop {
  return centerCrop(
    makeAspectCrop(
      { unit: "px", width: Math.min(containerWidth, containerHeight * aspect) },
      aspect,
      containerWidth,
      containerHeight
    ),
    containerWidth,
    containerHeight
  );
}

export function PhotoUpload({ value, onChange, disabled }: PhotoUploadProps) {
  const [step, setStep] = useState<"choose" | "crop" | "done">(value ? "done" : "choose");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [crop, setCrop] = useState<Crop>({ unit: "px", x: 0, y: 0, width: 100, height: 100 });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const uploadBlob = async (blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", blob, "photo.jpg");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Upload failed");
    }
    const { url } = await res.json();
    return url;
  };

  const resizeAndUploadImage = (img: HTMLImageElement): Promise<string> => {
    // When we skip the crop UI, we only do this if the source aspect is already correct.
    // So we can safely resize the full image into our target dimensions.
    const canvas = drawFullImageCanvas(img, TARGET_WIDTH, TARGET_HEIGHT);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(uploadBlob(b)) : reject(new Error("Canvas failed"))),
        "image/jpeg",
        0.92
      );
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image (JPEG, PNG, WebP, GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const aspect = img.naturalWidth / img.naturalHeight;
      const needsCrop =
        Math.abs(aspect - VISA_PHOTO_ASPECT) > ASPECT_TOLERANCE ||
        img.naturalWidth > MAX_SIZE_NO_CROP ||
        img.naturalHeight > MAX_SIZE_NO_CROP;

      if (!needsCrop) {
        setUploading(true);
        resizeAndUploadImage(img)
          .then((uploadedUrl) => {
            onChange(uploadedUrl);
            setPreviewUrl(uploadedUrl);
            setStep("done");
          })
          .catch((err) => setError(err instanceof Error ? err.message : "Upload failed"))
          .finally(() => {
            setUploading(false);
            URL.revokeObjectURL(url);
          });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(url);
      setStep("crop");
    };
    img.onerror = () => {
      setError("Failed to load image.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleCancelCrop = () => {
    if (previewUrl && !value) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(value);
    setStep(value ? "done" : "choose");
  };

  const handleApplyCrop = async () => {
    if (!imgRef.current || !crop.width || !crop.height || !selectedFile) return;
    const pixelCrop = crop.unit === "px" ? (crop as PixelCrop) : null;
    if (!pixelCrop) return;

    setUploading(true);
    setError(null);
    try {
      const canvas = getCroppedCanvas(
        imgRef.current,
        pixelCrop,
        TARGET_WIDTH,
        TARGET_HEIGHT
      );
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Canvas failed"))),
          "image/jpeg",
          0.92
        );
      });

      const url = await uploadBlob(blob);
      onChange(url);
      if (previewUrl && !value) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(url);
      setSelectedFile(null);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const w = rect.width || img.offsetWidth || img.naturalWidth;
    const h = rect.height || img.offsetHeight || img.naturalHeight;
    setCrop(centerAspectCrop(w, h, VISA_PHOTO_ASPECT));
  };

  const handleRemove = () => {
    onChange("");
    setPreviewUrl(null);
    setStep("choose");
  };

  if (step === "crop" && previewUrl) {
    return (
      <div className="space-y-3 max-w-sm">
        <p className="text-xs font-medium text-slate-600">
          Adjust crop (drag corners), then apply
        </p>
        <div className="overflow-hidden rounded-lg border border-slate-300 bg-slate-100">
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop) => setCrop(pixelCrop)}
            aspect={VISA_PHOTO_ASPECT}
            circularCrop={false}
            className="max-h-[280px] w-full max-w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={previewUrl}
              alt="Crop"
              // Avoid forcing w-full/object-contain; let the <img> box match the actual rendered image.
              // This prevents crop coordinates from drifting and producing a \"wider\" output.
              style={{ maxHeight: 280, maxWidth: "100%", width: "auto", display: "block" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
        {error && (
          <p className="text-sm text-rose-600" role="alert">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={uploading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Apply & save photo"}
          </button>
          <button
            type="button"
            onClick={handleCancelCrop}
            disabled={uploading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (step === "done" && value) {
    return (
      <div className="space-y-2">
        <div className="inline-block overflow-hidden rounded-lg border border-slate-300 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Applicant"
            className="h-[115px] w-[95px] object-cover"
          />
        </div>
        {!disabled && (
          <div className="flex gap-2">
            <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Change photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm font-medium text-slate-500 hover:text-rose-600"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-8 transition hover:border-emerald-400 hover:bg-slate-100">
        {uploading ? (
          <span className="text-sm font-medium text-slate-600">Uploading…</span>
        ) : (
          <>
            <span className="text-sm font-medium text-slate-600">Upload photo</span>
            <span className="mt-1 text-xs text-slate-500">
              JPEG, PNG, WebP or GIF, max 5MB
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={handleFileChange}
          disabled={disabled || uploading}
        />
      </label>
      {error && (
        <p className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
