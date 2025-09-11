"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../libs/axios";
import { useUserStore } from "../store/user";

export default function Callback() {
  const router = useRouter();
  // Corrected line: Destructure the action directly from the hook
  // without using a selector. Actions are stable references.
  const { setUser } = useUserStore();

  useEffect(() => {
    const handleLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        localStorage.setItem("authToken", token);

        try {
          const res = await api.get(`/ai/users/me?token=${token}`);
          console.log("User info:", JSON.parse(res.data));

          const useData = JSON.parse(res.data)

          if (!useData.picture_url) {
            useData.picture_url = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
          }

          setUser(JSON.parse(res.data)); // ✅ This will now work correctly

          router.push("/"); // redirect
        } catch (error) {
          console.error("Failed to fetch user info", error);
          router.push("/");
        }
      } else {
        router.push("/");
      }
    };

    handleLogin();
  }, [setUser, router]);

  return <div>Processing login...</div>;
}
