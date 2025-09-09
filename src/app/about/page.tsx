"use client";

import { motion } from "motion/react";
import { div } from "motion/react-client";
import React from "react";
import Navbar from "../components/Navbar";

export default function about() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start overflow-hidden">
        <Navbar />
      <motion.div
        initial={{ translateY: 50 }}
        animate={{ translateY: 0 }}
        className="flex flex-col items-center justify-center gap-10 w-screen h-full font-semibold text-2xl pb-10 text-center"
      >
        This project was created as part of the development of a project for the
        programming course.
      </motion.div>
    </div>
  );
}
