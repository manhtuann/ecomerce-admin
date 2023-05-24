import { signIn, useSession } from "next-auth/react";
import Nav from "./Nav";

export default function Layout({ children }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-blue-900 min-h-screen flex ">
        <Nav />
        <div className="bg-white w-screen rounded-lg mt-2 mr-2 mb-2  ">
          <div className="m-2">{children}</div>
        </div>
      </div>
    );
  }
}
