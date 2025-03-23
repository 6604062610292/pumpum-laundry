import BackButton from "@/app/components/BackButton";
import UserForm from "@/app/components/profile/UserForm";
import { getCurrentSession } from "@/lib/auth";
import { User } from "@prisma/client";

export default async function Page() {
  const session = await getCurrentSession();

  return (
    <main className="w-full h-screen p-6">
      <section className="border shadow-xs rounded-md container mx-auto p-6 max-w-md lg:max-w-2xl">
        <div className="flex flex-col items-center justify-center">
          <BackButton />
          <h1 className="text-2xl text-center">แก้ไขโปรไฟล์</h1>
          <h2 className="text-lg">ข้อมูลส่วนตัว</h2>
          <div className="mt-2">
            <UserForm user={session.user as User} />
          </div>
        </div>
      </section>
    </main>
  );
}
