"use client";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import Login from "./Login";
import { useUserStore } from "../store/user";
import { div } from "motion/react-client";
import { onWebsiteLoaded } from "../libs/checkLoad";
import { useRouter } from "next/navigation";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user_id, picture_url } = useUserStore();
  const [isLoading, setIdLoading] = useState(true);
  const router = useRouter()

  const [pages, setPages] = useState({
    home: ["HOME", "/"],
    about: ["ABOUT", "/about"],
    product: ["PRODUCT", "/product"],
    order: ["ORDER", "/order"],
    contract: ["CONTACT", "/contact"],
  });

  useEffect(() => {
    const tokenExists = !!localStorage.getItem("authToken");
    setIsAuthenticated(tokenExists);

    // ไม่ต้อง log state หลัง setState, ใช้ tokenExists แทน
  }, []);

  useEffect(() => {
    onWebsiteLoaded(() => {
      setIdLoading(false);
    });
  }, [isAuthenticated]);

  return (
    <div className="sticky top-0 left-0 w-screen min-h-[70px] flex justify-between items-center px-[15%] bg-[#333] text-white z-99">
      {/* Left */}
      <div className="flex flex-1 items-center justify-start gap-2">
        <div className="w-[36px] h-[36px] rounded-full overflow-hidden">
          <img
            className="w-full h-full object-contain"
            src="../favicon.ico"
            alt="Logo"
          />
        </div>
        <div className="text-xl font-medium whitespace-nowrap">GRAB FOOT</div>
      </div>

      {/* Center Menu */}
      <div className="flex-1 flex items-center justify-between gap-4 text-sm">
        {Object.entries(pages).map(([key, [label, path]]) => (
          <motion.div
            key={key}
            whileHover={{ paddingBottom: 6 }}
            className="cursor-pointer flex items-center justify-center gap-2 font-medium"
          >
            <div onClick={() => router.push(path)}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-end">
        {!isLoading ? (
          isAuthenticated && picture_url ? (
            <img 
              src={picture_url}
              alt="User profile"
              className="w-[36px] h-[36px] rounded-full object-cover"
            />
          ) : (
            <Login />
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Navbar;
