"use client"
import { u } from "motion/react-client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function logout() {

  const router = useRouter()

  useEffect(() => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user-storage")

    router.push("/")
  
  }, [])
  

  return <div>logout</div>;
}
