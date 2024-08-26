import CreateGroupForm from "@/components/CreateGroupForm";
import prisma from "@/db";
import { getServerSession } from "next-auth";

async function Page() {

  const session = await getServerSession()

  const user = session?.user?.email
  const currentUser = await prisma.user.findUnique({ where: { email: user! } })



  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getusers`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    console.error('Failed to fetch data:', response.status);
    throw new Error('Failed to fetch data');
  }

  const text = await response.text();
  console.log('Response Text:', text);

  try {
    const data = JSON.parse(text);

    const users = data.map((user: { id: number, name: string }) => ({
      id: user.id,
      name: user.name,
    }));

    return (
      <div>
        <CreateGroupForm users={users} creatorId={currentUser?.id} />
      </div>
    );
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw new Error("Failed to parse JSON");
  }
}

export default Page;
