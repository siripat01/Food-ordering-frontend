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
import api from "../libs/axios";

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

  const handleChangeStatus = async (
    orderId: string,
    status: string,
    userId?: string
  ) => {
    const payload: any = { status };

    if (userId) {
      payload.userId = userId;
    }

    await api.put(`/ai/order/${orderId}`, payload);

    const res = await api.get(`/ai/order/status/${state}`);
    setOrders(res.data.orders);

    api.post("/ai/message/push/order-update", {
      order_id: orderId,
      status: status,
    });
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

      const res = await api.get(`/ai/order/status/${state}`);

      console.log(res.data.orders);

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

      const res = await api.get(`/ai/order/status/${state}`);

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
        <div className="w-screen h-full flex flex-col items-center justify-center py-12 overflow-x-hidden">
          <div className="w-[90%] ">
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
          <div className="w-[90%] flex flex-col items-center justify-center h-full">
            <p>No one has been order yet.</p>
            <p>User going to order soon!</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start overflow-x-hidden">
      <Navbar />
      <div className="w-[90%] h-12 pb-6 pt-12">
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
      <div className="flex flex-col items-center justify-start w-full h-fit pt-6 pb-12">
        <div className="flex flex-col items-center justify-start gap-4 w-[90%] h-fit">
          <div
            className={`w-full flex items-center justify-between px-4 border-l-2 ${
              state == "pending"
                ? "border-[#666]"
                : state == "making"
                ? "border-[#ddff00]"
                : state == "cancelled"
                ? "border-[#ff0000]"
                : "border-[#02B150]"
            }`}
          >
            <p className="flex-2 text-start">Order ID</p>
            <p className="flex-2 text-center">UserId</p>
            <p className="flex-[1.5] text-center">Product name</p>
            <p className="flex-[1.5] text-center">Price</p>
            <p className="flex-[1.5] text-center">Date</p>
            <p className="flex-[2.5] text-end overflow-hidden truncate">
              Description
            </p>
          </div>
          {orders.map((order) => (
            <div
              key={order._id}
              className="w-full flex flex-col items-start gap-y-4"
            >
              <div
                className={`w-full flex items-center justify-between px-4 border-l-2 ${
                  order.status == "pending"
                    ? "border-[#666]"
                    : order.status == "making"
                    ? "border-[#ddff00]"
                    : order.status == "cancelled"
                    ? "border-[#ff0000]"
                    : "border-[#02B150]"
                }`}
              >
                <p className="flex-2 text-start">{order._id}</p>
                <p className="flex-2 text-center">{order.userId}</p>
                <p className="flex-[1.5] text-center">{order.product_name}</p>
                <p className="flex-[1.5] text-center">{order.price}</p>
                <p className="flex-[1.5] text-center">
                  {order.createAt.split("T")[0].replaceAll("-", "/")}{" "}
                  {order.createAt.split("T")[1].split(".")[0]}
                </p>
                <p className="flex-[2.5] text-end overflow-hidden truncate">
                  {order.description}
                </p>
              </div>
              {state !== "cancelled" && (
                <div className="flex items-center justify-start gap-4">
                  {state !== "pending" && (
                    <button
                      onClick={() => handleChangeStatus(order._id, "pending")}
                      className="flex items-center justify-center px-3 text-sm py-2 border-[#888] border-1 rounded-md cursor-pointer text-[#666]"
                    >
                      Pending
                    </button>
                  )}
                  {state !== "making" && (
                    <button
                      onClick={() => handleChangeStatus(order._id, "making")}
                      className="flex items-center justify-center px-3 text-sm py-2 border-[#888] border-1 rounded-md cursor-pointer text-[#e19701]"
                    >
                      Making
                    </button>
                  )}
                  {state !== "complete" && (
                    <button
                      onClick={() =>
                        handleChangeStatus(order._id, "complete", order.userId)
                      }
                      className="flex items-center justify-center px-3 text-sm py-2 border-[#888] border-1 rounded-md cursor-pointer text-[#02B150]"
                    >
                      Complete
                    </button>
                  )}
                  {(state === "pending" || state === "making") && (
                    <button
                      onClick={() => handleChangeStatus(order._id, "cancelled")}
                      className="flex items-center justify-center px-3 text-sm py-2 border-[#888] border-1 rounded-md cursor-pointer text-[#f00]"
                    >
                      Cancelled
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
