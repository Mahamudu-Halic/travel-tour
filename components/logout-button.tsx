"use client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const supabase = createClient();
  const router = useRouter();
  
  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <Button
      variant="destructive"
      className="w-full hover:bg-red-500/90!"
      onClick={logout}
    >
      Sign Out
    </Button>
  );
};

export default LogoutButton;
