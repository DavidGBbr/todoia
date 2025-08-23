import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const LoginLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data || !error) {
    redirect("/dashboard");
  }
  return <>{children}</>;
};

export default LoginLayout;
