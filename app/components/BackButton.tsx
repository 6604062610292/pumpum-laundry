"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="link"
      onClick={router.back}
      className="text-zinc-600 hover:cursor-pointer"
    >
      ย้อนกลับ
    </Button>
  );
}
