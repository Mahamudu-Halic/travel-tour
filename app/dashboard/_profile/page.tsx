import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";
import { Card } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className=" py-12 md:py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl ">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Update your personal information
          </p>
        </div>

        <Card className="border-border/50">
          <ProfileForm user={user as User} />
        </Card>
      </div>
    </div>
  );
}
