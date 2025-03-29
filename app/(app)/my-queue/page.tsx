import UserQueueTable from "@/app/components/my-queue/UserQueueTable";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const { user } = await getCurrentSession();

  const user_queue = await prisma.queue.findMany({
    where: {
      userId: user!.id,
    },
    take: 10,
    orderBy: {
      id: "desc",
    },
  });

  return (
    <main className="h-screen w-full flex justify-end items-center p-6">
      <div className="bg-white w-full p-6 rounded-lg shadow-lg">
        <UserQueueTable data={user_queue} />
      </div>
    </main>
  );
}
