import { Database } from "~/utils/database.types";
import { SupabaseClient, User } from "@supabase/supabase-js";
const { email } = useEmail();
const { username, setUsername } = useUsername();
const { avatar, downloadAvatar } = useAvatar();

interface Updates {
  id: string;
  username?: string;
  avatar_url?: string;
  updated_at: string;
}

async function fetchUserData(
  supabase: SupabaseClient<Database>,
  user: User | null
) {
  if (!user) throw new Error("No user logged in");
  await supabase
    .from("profiles")
    .select(`username, avatar_url`)
    .eq("id", user.id)
    .single()
    .then(({ data, error }) => {
      if (error) {
        throw error;
      } else {
        if (!data || !data.avatar_url || !data.username)
          throw new Error("No user data retrieved from server");
        setUsername(data.username);
        downloadAvatar(data.avatar_url, supabase);
      }
    });
}

async function updateUserData(
  updates: Updates,
  supabase: SupabaseClient<Database>
) {
  await supabase
    .from("profiles")
    .upsert(updates)
    .then(({ error }) => {
      if (error) {
        throw error;
      }
    });
}

export default function useUserData() {
  return { email, username, avatar, fetchUserData, updateUserData };
}
