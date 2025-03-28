import CustomerQueueForm from "@/app/components/new-queue/CustomerQueueForm";
import { getCurrentSession } from "@/lib/auth";

export default async function Page() {
  const { user } = await getCurrentSession();

  if (!user) {
    return (
      <div>
        <span>Something went wrong...</span>
      </div>
    );
  }

  return (
    <main className="h-screen w-full flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-md container mx-auto space-y-2 p-6 max-w-lg lg:max-w-2xl">
        {/* Form */}
        <CustomerQueueForm user_id={user.id} />
        {/* Queue Table */}
        {/* <h2 className="text-xl">ประวัติการจอง</h2>
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
        </Table> */}
      </div>
    </main>
  );
}
