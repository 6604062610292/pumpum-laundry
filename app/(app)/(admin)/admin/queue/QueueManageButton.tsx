import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Queue } from "@prisma/client";
import { Menu } from "lucide-react";
import React from "react";

interface Props {
  queue: Queue;
}

export default function QueueManageButton(props: Props) {
  const { queue } = props;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant={"ghost"}>
          <Menu size={24} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="w-full flex justify-start"></AlertDialogTitle>
          <AlertDialogDescription className="w-full grid grid-cols-2">
            <h3>ID: </h3>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex gap-2 w-full justify-end">
            <AlertDialogCancel>ปิด</AlertDialogCancel>
            <AlertDialogAction className="bg-green-600 hover:bg-green-500 transition-all">
              บันทึก
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
