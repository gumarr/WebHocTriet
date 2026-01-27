import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, chapterId } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 },
      );
    }

    // Validate URL
    const urlValidation = await fetch(imageUrl, { method: "HEAD" });
    const contentType = urlValidation.headers.get("content-type");
    
    if (!urlValidation.ok || !contentType?.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid image URL" },
        { status: 400 },
      );
    }

    // Determine file extension
    let extension = "jpg";
    if (contentType.includes("png")) extension = "png";
    else if (contentType.includes("gif")) extension = "gif";
    else if (contentType.includes("webp")) extension = "webp";
    else if (contentType.includes("jpeg")) extension = "jpeg";

    // Try to extract from URL if content-type doesn't help
    if (extension === "jpg") {
      const urlParts = imageUrl.split(".");
      if (urlParts.length > 1) {
        const urlExtension = urlParts[urlParts.length - 1].toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(urlExtension)) {
          extension = urlExtension;
        }
      }
    }

    // Generate filename using chapter ID
    const fileName = chapterId ? `${chapterId}.${extension}` : `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBlob = await imageResponse.blob();

    // Initialize Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase configuration missing" },
        { status: 500 },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Upload to Supabase storage
    const { data, error } = await supabaseAdmin.storage
      .from("chapter-image")
      .upload(fileName, imageBlob, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("chapter-image")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      imageUrl: publicUrlData.publicUrl,
      fileName: data.path,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}