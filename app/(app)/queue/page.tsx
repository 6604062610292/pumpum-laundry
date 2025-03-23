import CustomerQueueForm from "@/app/components/queue/CustomerQueueForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const { user } = await getCurrentSession();

  if (!user) {
    return (
      <div>
        <span>Something went wrong...</span>
      </div>
    );
  }

  const queue = await prisma.order.findMany({
    where: {
      user_id: user.id,
    },
    take: 10,
    orderBy: [
      {
        id: "desc",
      },
    ],
  });

  return (
    <main className="h-screen w-full p-6">
      <div className="border shadow-xs rounded-md container mx-auto space-y-2 p-6 max-w-lg lg:max-w-2xl">
        {/* Form */}
        <CustomerQueueForm user_id={user.id} />
        {/* Queue Table */}
        <h2 className="text-xl">ประวัติการจอง</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>id</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queue.map((q) => (
              <TableRow key={q.id}>
                <TableCell>{q.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
