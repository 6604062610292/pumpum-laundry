import BackButton from "@/app/components/BackButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import moment from "moment";

export default async function Page() {
  const queue = await prisma.queue.findMany({
    include: {
      machine: true,
      user: true,
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
  });

  return (
    <main className="h-screen w-full flex flex-col items-center p-6">
      <div className="bg-white space-y-1 rounded-lg drop-shadow-lg p-4 w-full lg:max-w-2xl">
        <div className="flex justify-between">
          <h1 className="text-3xl">ประวัติการจอง</h1>
          <BackButton />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>ชื่อลูกค้า</TableHead>
              <TableHead>จองเมื่อ</TableHead>
              <TableHead>เวลาที่จอง</TableHead>
              <TableHead>เครื่องซัก</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queue.map((q) => (
              <TableRow key={q.id}>
                <TableCell>{q.id.slice(0, 8)}</TableCell>
                <TableCell>
                  {q.user.name.split(" ")[0]} {q.user.name.split(" ")[1][0]}
                </TableCell>
                <TableCell>
                  {moment(q.queue_date).format("D MMM Y HH:mm")}
                </TableCell>
                <TableCell>
                  {moment(q.startTime).format("D MMM Y HH:mm")}
                </TableCell>
                <TableCell>{q.machine?.name ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
