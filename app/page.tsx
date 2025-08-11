// "use client";

// import { useGlobalState } from "@/context";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";


// export default function Page() {
//   const { user, token, authChecking } = useGlobalState();
//   const router = useRouter();

//   useEffect(() => {
//     if (authChecking) return; // Wait for auth check to complete

//     if (token && user?.id) {
//       // router.push(`/${user.id}`);
//       router.push('/');
//     }
//   }, [authChecking, router]);

//   return <div>
//     Hi welcome to the SMS.
//   </div>;
// }


"use client";

import { useGlobalState } from "@/context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user, token, authChecking } = useGlobalState();
  const router = useRouter();

  useEffect(() => {
    if (authChecking) return; // Wait for auth check to complete

    if (token && user?.role) {
      switch (user.role.toLowerCase()) {
        case "admin":
          router.push("/admin-dashboard");
          break;
        case "teacher":
          router.push("/teacher-dashboard");
          break;
        case "student":
          router.push("/student-dashboard");
          break;
        case "parent":
          router.push("/parent-dashboard");
          break;
        default:
          router.push("/"); // optional fallback
          break;
      }
    }
  }, [authChecking, token, user, router]);

  return <div>Hi, welcome to the School Management System.</div>;
}



