import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data || error) {
    redirect("/login");
  }
  return <>{children}</>;
};

export default DashboardLayout;
