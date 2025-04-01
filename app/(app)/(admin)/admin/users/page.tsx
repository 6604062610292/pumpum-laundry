import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import moment from "moment";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import BackButton from "@/app/components/BackButton";

export default async function Page() {
  const users = await prisma.user.findMany({
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true,
      phone: true,
      role: true,
      address: true,
    },
  });

  return (
    <main className="h-screen w-full flex justify-center p-6">
      <div className="bg-white w-full p-6 rounded-lg shadow-lg h-fit lg:max-w-xl xl:max-w-2xl">
        <div className="flex justify-between">
          <h1 className="text-3xl">รายชื่อผู้ใช้</h1>
          <BackButton />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>ชื่อผู้ใช้</TableHead>
              <TableHead>ตำแหน่ง</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>สร้างบัญชีเมื่อ</TableHead>
              <TableHead>ที่อยู่</TableHead>
              <TableHead>เบอร์ติดต่อ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {/* Id */}
                <TableCell>{user.id}</TableCell>
                {/* Name */}
                <TableCell>{user.name}</TableCell>
                {/* Role */}
                <TableCell>
                  {user.role === "CUSTOMER" ? "ลูกค้า" : "พนักงาน"}
                </TableCell>
                {/* Email */}
                <TableCell>{user.email}</TableCell>
                {/* Created at */}
                <TableCell>
                  {moment(user.created_at).format("D MMM Y HH:mm")}
                </TableCell>
                {/* Address */}
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MapPin />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ที่อยู่ของ {user.name}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {user.address}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ปิด</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
                {/* Phone number */}
                <TableCell>{user.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
