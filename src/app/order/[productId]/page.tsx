"use client";

import Loading from "@/app/components/Loading";
import axios from "../../libs/axios";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { TextareaAutosize } from "@material-ui/core";
import { motion } from "motion/react";
import { onWebsiteLoaded } from "@/app/libs/checkLoad";
import { login } from "@/app/libs/login";

type ProductType = {
  _id: string;
  product_name: string;
  status: string;
  price: number; // fixed type
  image: string;
  description: string;
  createAt: string;
  updateAt: string;
};

export default function ProductId({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [description, setDescription] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter();
  const sendOrder = async () => {
    if (!product) return;

    try {
      const userData = localStorage.getItem("user-storage");
      const parsed = userData ? JSON.parse(userData) : null;

      const orderPayload = {
        product_name: product.product_name,
        userId: parsed.state.user_id , // คุณอาจดึงจาก context / auth
        price: product.price,
        addon: [], // ปรับตาม addon ถ้ามี
        status: "pending",
        description: description || "", // ข้อความเพิ่มเติมจาก textarea
        // product_id: product._id, // ส่ง productId ให้ backend ด้วย
      };

      console.log(orderPayload);
      
      const res = await axios.post("/ai/order", orderPayload);
      console.log(res);
      

      if (res.status === 200 || res.status === 201) {
        alert("สั่งซื้อเรียบร้อย! 🎉");
        router.push("/order")
      } else {
        alert("เกิดข้อผิดพลาดในการสั่งซื้อ 😢");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ 😢");
    }
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
      onWebsiteLoaded(() => {
        setIsLoading(false);
      });
    };

    fecthOrder();
  }, [isAuthenticated]);

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;

      const res = await axios.get(`/ai/product?product_id=${resolved.productId}`);
      setProduct(res.data);
    }
    resolveParams();
  }, [params]);

  if (!product) return <Loading />;

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

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start overflow-x-hidden">
      <Navbar />
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          onClick={() => router.back()}
          className="w-fit h-fit absolute top-4 left-4 px-5 py-2 rounded-full bg-[#333] opacity-80 
        hover:opacity-100 cursor-pointer transition-all duration-300"
        >
          Back
        </div>
        <div className="flex flex-col gap-12 items-start w-1/2 h-[80%]">
          <div className="flex items-center justify-between w-full h-10 border-l-4 border-[#02B150] px-4 text-2xl">
            <div>{product.product_name}</div>
            <div>{product.price}</div>
          </div>
          <div className="w-full h-fit flex items-center justify-between gap-8">
            <img
              className="w-[50%] h-[18vw] object-cover rounded-xl outline-2 outline-[#666] outline-offset-2"
              src={`${product.image}`}
              alt=""
            />
            <div className="w-[50%] h-full flex flex-col items-start justify-between gap-2">
              <div className="w-full h-fit flex flex-col items-start justify-start gap-2">
                <div className="text-2xl">{product.product_name}</div>
                <div>{product.description}</div>
                <div>
                  วันที่ : {product.updateAt.split("T")[0].replaceAll("-", "/")}
                </div>
              </div>

              <TextareaAutosize
                style={{
                  width: "100%",
                  borderRadius: 20,
                  paddingLeft: 12,
                  paddingRight: 40,
                  paddingTop: 8,
                  paddingBottom: 8,
                  background: "#303030",
                  outline: "none",
                  border: "none",
                  resize: "none",
                }}
                maxRows={3}
                placeholder="เพิ่มเติมถึงแม่ค้า!"
                onChange={(events) => setDescription(events.target.value)}
              />
            </div>
          </div>
          <div onClick={sendOrder} className="w-[48%] bg-[#02B150] py-2 rounded-xl text-center cursor-pointer outline-2 outline-offset-2 outline-[#aaa] hover:outline-white transition-all duration-300">
            ซื้อเลย!!!
          </div>
        </div>
      </div>
    </div>
  );
}
