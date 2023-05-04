import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/utils/database.types";

export default eventHandler(async (event) => {
  const client = serverSupabaseClient<Database>(event);

  const { data } = await client.from("libraries").select();

  return { libraries: data };
});
