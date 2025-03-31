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
import QueueManageButton from "./QueueManageButton";

const filterName = (full_name: string) => {
  if (full_name.split(" ").length < 1) return full_name;
  return `${full_name.split(" ")[0]} ${full_name.split(" ")[1][0]}`;
};

export default async function Page() {
  const queues = await prisma.queue.findMany({
    where: {
      status: {
        notIn: ["CANCELED", "COMPLETED"],
      },
    },
    include: {
      user: true,
    },
  });

  return (
    <main className="h-screen w-full flex flex-col items-center p-6">
      <div className="bg-white space-y-1 rounded-lg drop-shadow-lg p-4 w-full md:max-w-md lg:max-w-lg">
        <h1 className="text-3xl">คิวปัจจุบัน</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>ชื่อลูกค้า</TableHead>
              <TableHead>เวลาที่จอง</TableHead>
              <TableHead>สถานะ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queues.map((q) => (
              <TableRow key={q.id}>
                <TableHead>
                  <QueueManageButton queue={q} />
                </TableHead>
                <TableCell>{q.id.slice(0, 5)}</TableCell>
                <TableCell>{filterName(q.user.name)}</TableCell>
                <TableCell>
                  {moment(q.queue_date).format("DD MMM Y HH:mm")} น.
                </TableCell>
                <TableCell>{q.status.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
