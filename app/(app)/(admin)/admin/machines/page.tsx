import MachineForm from "@/app/components/admin/machines/MachineForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const machines = await prisma.machine.findMany();

  return (
    <main className="h-screen w-full flex justify-center items-center p-6">
      <div className="bg-white space-y-1 rounded-lg drop-shadow-lg p-4 w-full">
        <h1 className="text-4xl">เครื่องซัก</h1>
        <MachineForm />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>ชื่อเครื่อง</TableHead>
              <TableHead>สถานะ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell>{machine.id}</TableCell>
                <TableCell>{machine.name}</TableCell>
                <TableCell
                  className={
                    machine.is_available ? "text-green-600" : "text-red-600"
                  }
                >
                  {machine.is_available ? "พร้อมใช้งาน" : "กำลังใช้งาน"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
