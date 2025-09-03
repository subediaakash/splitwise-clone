import { getServerSession } from "next-auth";

export default async function LoginSite() {
  const session = await getServerSession();
  if (!session) {
    return <Login />;
  }
  console.log(session);
  
  return <h1>Welcome {session?.user?.email}</h1>}