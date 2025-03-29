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
          <TableHead>เวลาที่จอง</TableHead>
          <TableHead>สถานะ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((q) => (
          <TableRow key={q.id}>
            <TableCell>{q.id.slice(0, 5)}</TableCell>
            <TableCell>{moment(q.queue_date).format("DD MMM Y")}</TableCell>
            <TableCell>{q.status.toString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
