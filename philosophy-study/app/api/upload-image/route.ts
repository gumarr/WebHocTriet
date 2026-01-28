import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    // Check if this is a form data request (file upload) or JSON request (URL upload)
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const chapterId = formData.get("chapterId") as string;

      if (!file) {
        return NextResponse.json(
          { error: "File is required" },
          { status: 400 },
        );
      }

      if (!chapterId) {
        return NextResponse.json(
          { error: "Chapter ID is required" },
          { status: 400 },
        );
      }

      // Validate file type and size
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPG, PNG, and WebP images are allowed." },
          { status: 400 },
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "File size too large. Maximum size is 2MB." },
          { status: 400 },
        );
      }

      // Determine file extension
      let extension = "jpg";
      if (file.type.includes("png")) extension = "png";
      else if (file.type.includes("gif")) extension = "gif";
      else if (file.type.includes("webp")) extension = "webp";
      else if (file.type.includes("jpeg")) extension = "jpeg";

      // Generate filename using chapter ID
      const fileName = chapterId ? `${chapterId}.${extension}` : `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

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

      // If chapterId is provided, delete existing images for this chapter
      if (chapterId) {
        try {
          // List all files in the bucket to find files with chapterId in the name
          const { data: fileList, error: listError } = await supabaseAdmin.storage
            .from("chapter-image")
            .list("", {
              limit: 1000,
            });

          if (listError) {
            console.warn("Error listing files:", listError);
          } else if (fileList && fileList.length > 0) {
            // Filter files that contain the chapterId in their name
            const filesToDelete = fileList
              .filter(file => file.name.includes(chapterId))
              .map(file => file.name);
            
            if (filesToDelete.length > 0) {
              console.log(`Found ${filesToDelete.length} files to delete for chapter ${chapterId}:`, filesToDelete);
              
              // Delete existing files for this chapter
              const { error: deleteError } = await supabaseAdmin.storage
                .from("chapter-image")
                .remove(filesToDelete);

              if (deleteError) {
                console.warn("Error deleting existing files:", deleteError);
              } else {
                console.log(`Successfully deleted ${filesToDelete.length} existing files for chapter ${chapterId}`);
              }
            } else {
              console.log(`No existing files found for chapter ${chapterId}`);
            }
          }
        } catch (deleteError) {
          console.warn("Error during cleanup of existing files:", deleteError);
        }
      }

      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
        fileName: fileName
      });

      // Upload to Supabase storage with proper content type
      const { data, error } = await supabaseAdmin.storage
        .from("chapter-image")
        .upload(fileName, buffer, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      console.log("Upload result:", { data, error });

      if (error) {
        console.error("Upload error details:", error);
        throw error;
      }

      console.log("Upload successful:", {
        fileName,
        path: data?.path,
        fullPath: data?.fullPath
      });

      // Get the public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("chapter-image")
        .getPublicUrl(data.path);

      return NextResponse.json({
        success: true,
        imageUrl: publicUrlData.publicUrl,
        fileName: data.path,
      });
    } else {
      // Handle URL upload (existing logic)
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

      // If chapterId is provided, delete existing images for this chapter
      if (chapterId) {
        try {
          // List all files in the bucket to find files with chapterId in the name
          const { data: fileList, error: listError } = await supabaseAdmin.storage
            .from("chapter-image")
            .list("", {
              limit: 1000,
            });

          if (listError) {
            console.warn("Error listing files:", listError);
          } else if (fileList && fileList.length > 0) {
            // Filter files that contain the chapterId in their name
            const filesToDelete = fileList
              .filter(file => file.name.includes(chapterId))
              .map(file => file.name);
            
            if (filesToDelete.length > 0) {
              console.log(`Found ${filesToDelete.length} files to delete for chapter ${chapterId}:`, filesToDelete);
              
              // Delete existing files for this chapter
              const { error: deleteError } = await supabaseAdmin.storage
                .from("chapter-image")
                .remove(filesToDelete);

              if (deleteError) {
                console.warn("Error deleting existing files:", deleteError);
              } else {
                console.log(`Successfully deleted ${filesToDelete.length} existing files for chapter ${chapterId}`);
              }
            } else {
              console.log(`No existing files found for chapter ${chapterId}`);
            }
          }
        } catch (deleteError) {
          console.warn("Error during cleanup of existing files:", deleteError);
        }
      }

      // Upload to Supabase storage
      const { data, error } = await supabaseAdmin.storage
        .from("chapter-image")
        .upload(fileName, imageBlob, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Upload error details:", error);
        throw error;
      }

      console.log("Upload successful:", {
        fileName,
        path: data?.path,
        fullPath: data?.fullPath
      });

      // Get the public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("chapter-image")
        .getPublicUrl(data.path);

      return NextResponse.json({
        success: true,
        imageUrl: publicUrlData.publicUrl,
        fileName: data.path,
      });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
