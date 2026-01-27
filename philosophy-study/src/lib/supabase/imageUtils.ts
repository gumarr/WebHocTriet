import { supabaseAdmin } from "./client";

/**
 * Downloads an image from a URL and uploads it to Supabase storage
 * @param imageUrl The URL of the image to download
 * @param chapterId The chapter ID to use for the filename (for automatic override)
 * @returns The public URL of the uploaded image, or null if failed
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  chapterId?: string,
): Promise<string | null> {
  try {
    // Download the image from the URL
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image blob
    const imageBlob = await response.blob();
    
    // Determine file extension from URL or response headers
    let extension = "jpg";
    const contentType = response.headers.get("content-type");
    if (contentType) {
      if (contentType.includes("png")) extension = "png";
      else if (contentType.includes("gif")) extension = "gif";
      else if (contentType.includes("webp")) extension = "webp";
    } else {
      // Try to extract from URL
      const urlParts = imageUrl.split(".");
      if (urlParts.length > 1) {
        const urlExtension = urlParts[urlParts.length - 1].toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(urlExtension)) {
          extension = urlExtension;
        }
      }
    }

    // Generate filename using chapter ID for automatic override
    const finalFileName = chapterId ? `${chapterId}.${extension}` : `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

    // Upload to Supabase storage with upsert enabled for automatic override
    if (!supabaseAdmin) {
      throw new Error("Supabase admin client not initialized");
    }

    const { data, error } = await supabaseAdmin.storage
      .from("chapter-image")
      .upload(finalFileName, imageBlob, {
        cacheControl: "3600",
        upsert: true, // Enable upsert to override existing files
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("chapter-image")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image from URL:", error);
    return null;
  }
}

/**
 * Validates if a URL is a valid image URL
 * @param url The URL to validate
 * @returns Promise<boolean> indicating if the URL is valid
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    
    return response.ok && contentType !== null && contentType.startsWith("image/");
  } catch (error) {
    return false;
  }
}

/**
 * Extracts the filename from a URL
 * @param url The image URL
 * @returns The filename with extension
 */
export function getFileNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split("/").pop();
    return filename || `image-${Date.now()}`;
  } catch (error) {
    return `image-${Date.now()}`;
  }
}