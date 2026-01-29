"use client";

import { useState } from "react";

interface ChapterImageUploadProps {
  chapterId: string;
  currentImageUrl?: string | null;
  onImageChange?: (imageUrl: string | null) => void;
}

export function ChapterImageUpload({
  chapterId,
  currentImageUrl,
  onImageChange,
}: ChapterImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      alert("Chỉ cho phép file ảnh (jpg, png, webp)");
      return;
    }

    if (file.size > maxSize) {
      alert("Kích thước file không được vượt quá 2MB");
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("chapterId", chapterId);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        alert("Upload ảnh thành công");
        onImageChange?.(result.imageUrl);
      } else {
        throw new Error(result.error || "Upload thất bại");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Upload thất bại");
    } finally {
      setIsUploading(false);
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
  };

  const handleDeleteImage = async () => {
    if (!currentImageUrl) return;

    try {
      const response = await fetch("/api/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterId,
          imageUrl: currentImageUrl,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Xóa ảnh thành công");
        onImageChange?.(null);
      } else {
        throw new Error(result.error || "Xóa ảnh thất bại");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error instanceof Error ? error.message : "Xóa ảnh thất bại");
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Image Display */}
      {currentImageUrl && (
        <div className="relative">
          <img
            src={`${currentImageUrl}?t=${new Date().getTime()}`}
            alt="Chapter"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <button
            onClick={handleDeleteImage}
            disabled={isUploading}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
          >
            X
          </button>
        </div>
      )}

      {/* Preview Image */}
      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
        </div>
      )}

      {/* Upload Controls */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            id="chapter-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          <button
            onClick={() => document.getElementById("chapter-image")?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {isUploading ? "Đang tải..." : "Chọn ảnh"}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Dung lượng tối đa: 2MB. Định dạng: JPG, PNG, WebP.
      </p>
    </div>
  );
}
