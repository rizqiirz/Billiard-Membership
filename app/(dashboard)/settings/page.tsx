import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/settings/profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const name = (user.user_metadata?.name as string | undefined) ?? "";
  const email = user.email ?? "-";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Pengaturan
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Kelola profil admin
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Admin</CardTitle>
          <CardDescription>
            Perbarui nama tampilan yang muncul pada riwayat perpanjangan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm name={name} email={email} />
        </CardContent>
      </Card>
    </div>
  );
}
