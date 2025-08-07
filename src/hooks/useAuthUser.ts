import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../types/db";
import { useLoading } from "../context/LoadingContext";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { isLoading, setLoading } = useLoading();

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const refetchProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Profile fetch error:", error.message);
      setProfile(null);
      logout();
    } else {
      if (data.profile_photo_url) {
        data.profile_photo_url = await getProfilePhotoUrl(
          data.profile_photo_url
        );
      }
      setProfile(data);
    }
  };

  const getProfilePhotoUrl = async (profilePath: string) => {
    const { data, error } = await supabase.storage
      .from("profiles")
      .createSignedUrl(profilePath, 60 * 60);
    if (error) {
      console.error(
        `Fetching profile photo signed URL failed: ${error.message}`
      );
    } else {
      return data.signedUrl;
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Session error:", error);
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) await fetchProfile(currentUser.id);
      setLoading(false);
    };

    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);
        if (newUser) {
          await fetchProfile(newUser.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    logout,
    refetchProfile,
  };
}
