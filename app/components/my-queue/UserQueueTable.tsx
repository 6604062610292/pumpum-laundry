"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Queue } from "@prisma/client";
import moment from "moment";

type Props = {
  data: Queue[];
};

export default function UserQueueTable({ data }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>สร้างเมื่อ</TableHead>
          <TableHead>เวลาที่จอง</TableHead>
          <TableHead>สถานะ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((q) => (
          <TableRow key={q.id}>
            <TableCell>{q.id.slice(0, 8)}</TableCell>
            <TableCell>
              {moment(q.queue_date).format("D MMM Y HH:mm")}
            </TableCell>
            <TableCell>{moment(q.startTime).format("D MMM Y HH:mm")}</TableCell>
            <TableCell>{q.status.toString()}</TableCell>
          </TableRow>
        ))}
        {/* No row */}
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} align="center">
              ไม่มีข้อมูล
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
