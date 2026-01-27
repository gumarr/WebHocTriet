import { supabase, supabaseAdmin } from "./client";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export const authServices = {
  async signIn(email: string, password: string): Promise<AuthUser | null> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) return null;

    // Fetch role from profiles table instead of user_metadata
    const role = await this.getUserRole(data.user.id);

    return {
      id: data.user.id,
      email: data.user.email!,
      role: role || "authenticated",
    };
  },

  // New method to fetch role from profiles table
  async getUserRole(userId: string): Promise<string | null> {
    try {
      // Try to fetch from profiles table with admin client to bypass RLS
      if (supabaseAdmin) {
        const { data: adminProfileData, error: adminProfileError } =
          await supabaseAdmin
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();

        if (adminProfileError) {
          return null;
        }

        if (adminProfileData?.role) {
          return adminProfileData.role;
        }
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.log("❌ Error details:", {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
        });
        return null;
      }

      if (profileData?.role) {
        return profileData.role;
      } else {
        console.log("⚠️  No role found in regular profiles query");
      }

      return null;
    } catch (error) {
      console.error("💥 Error in getUserRole:", error);
      return null;
    }
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data, error } = await supabase.auth.getUser();

    // Don't throw error for missing session - just return null
    if (error && error.message !== "Auth session missing!") {
      throw error;
    }
    if (!data.user) return null;

    // Fetch role from profiles table instead of user_metadata
    const role = await this.getUserRole(data.user.id);

    return {
      id: data.user.id,
      email: data.user.email!,
      role: role || "authenticated",
    };
  },

  async getSession(): Promise<{ session: unknown } | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  },
};
