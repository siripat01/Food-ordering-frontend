"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { onWebsiteLoaded } from "../libs/checkLoad";
import { motion } from "motion/react";
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";
import { login } from "../libs/login";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import axios from "../libs/axios";

type ProductType = {
  _id: string;
  product_name: string;
  userId: string;
  status: string;
  price: number; // fixed type
  description: string;
  createAt: string;
  addon: [];
  Finish: boolean | null;
};

export default function order() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [orders, setOrders] = useState<ProductType[]>([]);
  const [state, setState] = useState<string | null>("pending");
  const router = useRouter();

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    setState(newValue);
  };

  useEffect(() => {
    const tokenExists = !!localStorage.getItem("authToken");
    setIsAuthenticated(tokenExists);
  }, []);

  useEffect(() => {
    const fecthOrder = async () => {
      if (!isAuthenticated) {
        // router.push("/");
        login();
        return;
      }

      const userData = localStorage.getItem("user-storage");
      const parsed = userData ? JSON.parse(userData) : null;

      if (!parsed) return;

      const res = await axios.get(
        `/order/user/${parsed.state.user_id}/status/${state}`
      );

      setOrders(res.data.orders);

      onWebsiteLoaded(() => {
        setIsLoading(false);
      });
    };

    fecthOrder();
  }, [isAuthenticated]);

  useEffect(() => {
    const changeState = async () => {
      const userData = localStorage.getItem("user-storage");
      const parsed = userData ? JSON.parse(userData) : null;

      if (!parsed) return;

      const res = await axios.get(
        `/order/user/${parsed.state.user_id}/status/${state}`
      );

      setOrders(res.data.orders);
    };

    changeState();
  }, [state]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ translateY: 50 }}
        animate={{ translateY: 0 }}
        className="flex flex-col items-center justify-center gap-10 w-screen h-screen font-semibold text-6xl pb-10"
      >
        <p>Welcome to our application!</p>
        <p>Please login before you can order!</p>
      </motion.div>
    );
  }

  if (!orders.length && state === "pending") {
    return (
      <>
        <Navbar />
        <div className="w-screen h-screen flex flex-col items-center justify-center overflow-x-hidden">
          <p>You haven't been order yet.</p>
          <p>Please go to our product or our line chatbot!</p>
        </div>
      </>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start overflow-x-hidden">
      <Navbar />
      <div className="flex flex-col items-center justify-start w-full h-fit py-12">
        <div className="w-[80%] h-12">
          <Select
            className="h-fit w-fit"
            defaultValue="pending"
            onChange={handleChange}
          >
            <Option value="pending">Pending</Option>
            <Option value="making">Making</Option>
            <Option value="complete">Complete</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </div>
        <div className="flex flex-col items-center justify-start gap-4 w-[80%] h-fit">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`w-full flex items-center justify-between px-4 border-l-2 ${
                order.status == "pending"
                  ? "border-[#666]"
                  : order.status == "making"
                  ? "border-[#ddff00]"
                  : "border-[#02B150]"
              }`}
            >
              <p className="flex-2 text-start">{order._id}</p>
              <p className="flex-1 text-center">{order.product_name}</p>
              <p className="flex-1 text-center">{order.price}</p>
              <p className="flex-1 text-center">{order.status}</p>
              <p className="flex-2 text-end overflow-hidden truncate">{order.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
