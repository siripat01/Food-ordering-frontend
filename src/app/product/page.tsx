"use client";
import api from "../libs/axios";
import React, { useEffect, useState } from "react";
import { onWebsiteLoaded } from "../libs/checkLoad";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";
import order from "../order/page";

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

export default function Product() {
  // fixed PascalCase
  const [products, setProducts] = useState<ProductType[]>([]);
  // const [recommend, setRecommend] = useState<ProductType[]>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getProducts = async () => {
      const res = await api.get("/ai/product");
      setProducts(res.data.products || []); // avoid undefined

      const userData = localStorage.getItem("user-storage");
      const parsed = userData ? JSON.parse(userData) : null;

      // let rec = null;

      // if (!parsed) {
      //   rec = await api.get(
      //     "http://localhost:8080/trending?n_recommendations=3"
      //   );
      // } else {
      //   rec = await api.get(
      //     `http://localhost:8080/recommendations/hybrid/${parsed.state.user_id}?n_recommendations=3`
      //   );
      // }

      // setRecommend(rec.data);
      // console.log(rec.data);
      

      onWebsiteLoaded(() => {
        setIsLoading(false);
      });
    };
    getProducts();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
      {/* Navbar fixed */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Page content */}
      <div className="flex-1 pt-[60px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loading />
          </div>
        ) : (
          <div className=" w-full flex justify-center items-center py-24">
            <div className="w-[60%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  className="flex flex-col h-80 bg-[#333] rounded-xl overflow-hidden text-white"
                  key={product._id}
                >
                  <img
                    className="w-full h-[50%] object-cover"
                    src={product.image}
                    alt={product.product_name}
                    loading="lazy"
                  />
                  <div className="flex-1 flex flex-col items-start justify-between p-4">
                    <div className="flex flex-col items-start justify-start">
                      <p className="font-medium">{product.product_name}</p>
                      <p className="text-sm opacity-70">${product.price}</p>
                      <p
                        className={`text-sm ${
                          product.status === "avalible"
                            ? "text-[#02B150]"
                            : "text-[#b10202]"
                        }`}
                      >
                        {product.status}
                      </p>
                      <p className="text-xs opacity-70">
                        {product.description}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`order/${product._id}`)}
                      className="w-full py-1 bg-[#02B150] rounded-md cursor-pointer"
                      disabled={product.status !== "avalible"}
                    >
                      สั่งซื้อเลย!
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
