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
import MachineManageModal from "./MachineManageModal";
import BackButton from "@/app/components/BackButton";

export default async function Page() {
  const machines = await prisma.machine.findMany();

  return (
    <main className="h-screen w-full flex justify-center items-center p-6">
      <div className="bg-white space-y-1 rounded-lg drop-shadow-lg p-4 w-full md:max-w-md lg:max-w-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl">เครื่องซัก</h1>
          <BackButton />
        </div>
        <MachineForm />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>ID</TableHead>
              <TableHead>ชื่อเครื่อง</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>สถานะเครื่อง</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell>
                  <MachineManageModal machine={machine} />
                </TableCell>
                <TableCell>{machine.id}</TableCell>
                <TableCell>{machine.name}</TableCell>
                <TableCell
                  className={
                    machine.is_available ? "text-green-600" : "text-red-600"
                  }
                >
                  {machine.is_available ? "ว่าง" : "ทำงานอยู่"}
                </TableCell>
                <TableCell>{machine.is_active ? "✅" : "❌"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
