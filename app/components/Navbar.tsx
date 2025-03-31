"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="px-4 xl:px-6 py-2.5 border-b w-full">
      <div className="flex justify-between">
        <h1 className="text-xl">Pumpum Laundry</h1>
        <div className="flex justify-start items-center gap-4">
          {items.map((item) => (
            <div key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </div>
          ))}
        </div>
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

const items = [
  {
    label: "หน้าหลัก",
    href: "#",
  },
  {
    label: "ทดสอบ",
    href: "#",
  },
  {
    label: "ตัวอย่าง",
    href: "#",
  },
] as const;
