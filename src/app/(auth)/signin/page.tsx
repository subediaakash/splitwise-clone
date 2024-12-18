import Login from "@/components/Login";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginSite() {
  const session = await getServerSession();
  if (!session) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <Login />
      </div>
    );
  }
  redirect("/dashboard");
}
