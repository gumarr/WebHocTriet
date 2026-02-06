import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function DELETE(request: NextRequest) {
  try {
    const { chapterId, imageUrl } = await request.json();

    if (!chapterId || !imageUrl) {
      return NextResponse.json(
        { error: "Chapter ID and image URL are required" },
        { status: 400 },
      );
    }

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

    // Extract filename from URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];

    // Delete the image from Supabase storage
    const { error } = await supabaseAdmin.storage
      .from("chapter-image")
      .remove([fileName]);

    if (error) {
      console.error("Delete error details:", error);
      throw error;
    }

    // Update the chapter's image_url to null in the database
    const { error: dbError } = await supabaseAdmin
      .from("chapters")
      .update({ image_url: null })
      .eq("id", chapterId);

    if (dbError) {
      console.error("Database update error:", dbError);
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}