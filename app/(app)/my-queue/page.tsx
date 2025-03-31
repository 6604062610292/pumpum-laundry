import BackButton from "@/app/components/BackButton";
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
    <main className="h-screen w-full items-center flex justify-center p-6">
      <div className="bg-white w-full p-6 rounded-lg shadow-lg md:max-w-lg">
        <div className="flex justify-between">
          <h1 className="text-3xl">คิวของฉัน</h1>
          <BackButton />
        </div>
        <UserQueueTable data={user_queue} />
      </div>
    </main>
  );
}
