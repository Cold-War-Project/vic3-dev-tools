import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "~/utils/database.types";
const avatar = ref(""); //blob url for file after download finished
const avatarPath = ref(""); //path to the file in supabase storage
function setAvatar(url: string) {
  avatar.value = url;
}

/**
 * @description Downloads the avatar from supabase and converts the received data into a blob url, storing it in the avatarPath ref.
 * @param avatarFilePath The name of the avatar file to download from supabase
 */
async function downloadAvatar(
  avatarFilePath: string,
  supabase: SupabaseClient<Database>
) {
  await supabase.storage
    .from("avatars")
    .download(avatarFilePath)
    .then(({ data, error }) => {
      if (error) {
        throw error;
      } else {
        setAvatar(URL.createObjectURL(data));
      }
    });
}

async function uploadAvatar(
  supabase: SupabaseClient<Database>,
  files: any,
  randomString: string
) {
  const file = files[0];
  const fileExt = file.name.split(".").pop();
  const fileName = `${randomString}.${fileExt}`;
  const filePath = `${fileName}`;
  avatarPath.value = filePath;

  await supabase.storage
    .from("avatars")
    .upload(filePath, file)
    .then(async ({ error }) => {
      if (error) {
        throw error;
      } else {
        setAvatar(URL.createObjectURL(file));
      }
    });
}

export default function useAvatar() {
  return { avatar, avatarPath, setAvatar, downloadAvatar, uploadAvatar };
}
