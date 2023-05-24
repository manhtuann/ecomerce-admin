import Layout from "@/components/Layout";
import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between p-4">
        <h2>
          Hello,<b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img
            src={session?.user?.image}
            alt=""
            className="w-6 h-6 rounded-lg"
          />
          <h2 className=" px-2">{session?.user?.name}</h2>
        </div>
      </div>
    </Layout>
  );
}
