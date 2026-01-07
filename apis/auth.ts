import { createClient } from "@/lib/supabase/client";

export const login = async (redirect: string) => {
  const supabase = await createClient();
  console.log("redirect", process.env.NEXT_PUBLIC_URL);

  await supabase.auth
    .signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback?next=${redirect}`,
      },
    })
    .catch((error) => {
      console.error(error);
    });
};

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};
