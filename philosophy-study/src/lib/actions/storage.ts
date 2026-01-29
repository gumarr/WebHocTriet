import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadChapterImage(
  chapterId: string,
  file: File
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Chỉ cho phép file ảnh (jpg, png, webp)",
      };
    }

    if (file.size > maxSize) {
      return {
        success: false,
        error: "Kích thước file không được vượt quá 2MB",
      };
    }

    // Determine file extension
    let extension = "jpg";
    if (file.type === "image/png") extension = "png";
    else if (file.type === "image/webp") extension = "webp";
    else if (file.type === "image/jpeg") extension = "jpeg";

    // Generate filename using chapter ID
    const fileName = `${chapterId}.${extension}`;

    // Initialize Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !serviceRoleKey) {
      return {
        success: false,
        error: "Cấu hình Supabase chưa được thiết lập",
      };
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Upload to Supabase storage with overwrite
    const { data, error } = await supabaseAdmin.storage
      .from("chapter-image")
      .upload(fileName, file, {
        cacheControl: "0",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: `Upload thất bại: ${error.message}`,
      };
    }

    // Get the public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("chapter-image")
      .getPublicUrl(data.path);

    // Update the chapter's image_url in the database
    const { error: dbError } = await supabaseAdmin
      .from("chapters")
      .update({ image_url: publicUrlData.publicUrl })
      .eq("id", chapterId);

    if (dbError) {
      console.error("Database update error:", dbError);
      return {
        success: false,
        error: `Cập nhật cơ sở dữ liệu thất bại: ${dbError.message}`,
      };
    }

    // Revalidate paths to update the UI
    revalidatePath("/admin/lessons");
    revalidatePath(`/admin/lessons/${chapterId}`);

    return {
      success: true,
      imageUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error("Upload chapter image error:", error);
    return {
      success: false,
      error: "Có lỗi xảy ra trong quá trình upload",
    };
  }
}

export async function deleteChapterImage(chapterId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Initialize Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !serviceRoleKey) {
      return {
        success: false,
        error: "Cấu hình Supabase chưa được thiết lập",
      };
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // List all files in the bucket to find files with chapterId in the name
    const { data: fileList, error: listError } = await supabaseAdmin.storage
      .from("chapter-image")
      .list("", {
        limit: 1000,
      });

    if (listError) {
      console.warn("Error listing files:", listError);
      return {
        success: false,
        error: `Lỗi khi kiểm tra file: ${listError.message}`,
      };
    }

    if (fileList && fileList.length > 0) {
      // Filter files that contain the chapterId in their name
      const filesToDelete = fileList
        .filter(file => file.name.includes(chapterId))
        .map(file => file.name);
      
      if (filesToDelete.length > 0) {
        
        // Delete existing files for this chapter
        const { error: deleteError } = await supabaseAdmin.storage
          .from("chapter-image")
          .remove(filesToDelete);

        if (deleteError) {
          console.warn("Error deleting existing files:", deleteError);
          return {
            success: false,
            error: `Xóa file cũ thất bại: ${deleteError.message}`,
          };
        }
      }
    }

    // Update the chapter's image_url to null in the database
    const { error: dbError } = await supabaseAdmin
      .from("chapters")
      .update({ image_url: null })
      .eq("id", chapterId);

    if (dbError) {
      console.error("Database update error:", dbError);
      return {
        success: false,
        error: `Cập nhật cơ sở dữ liệu thất bại: ${dbError.message}`,
      };
    }

    // Revalidate paths to update the UI
    revalidatePath("/admin/lessons");
    revalidatePath(`/admin/lessons/${chapterId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete chapter image error:", error);
    return {
      success: false,
      error: "Có lỗi xảy ra trong quá trình xóa ảnh",
    };
  }
}