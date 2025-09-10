"use client";
import axios from "./libs/axios";
import Image from "next/image";
import { login } from "./libs/login";
import Navbar from "./components/Navbar";
import { use, useEffect, useState } from "react";
import { onWebsiteLoaded } from "./libs/checkLoad";
import { useUserStore } from "./store/user";
import { motion } from "motion/react";
import Loading from "./components/Loading";
import { useRouter } from "next/navigation";
import { div } from "motion/react-client";

export default function Home() {
  const backendURL = process.env.BACKEND_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recommend, setRecommend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { username, display_name } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const initial = async () => {
      const tokenExists = !!localStorage.getItem("authToken");
      setIsAuthenticated(tokenExists);

      const userData = localStorage.getItem("user-storage");
      const parsed = userData ? JSON.parse(userData) : null;

      let rec = null;

      if (parsed?.state?.user_id) {
        rec = await axios(
          `ml/recommendations/hybrid/${parsed.state.user_id}?n_recommendations=5`
        );
      } else {
        rec = await axios(`ml/trending?n_recommendations=5`);
      }

      setRecommend(rec.data);
      console.log(rec.data);

      onWebsiteLoaded(() => {
        setIsLoading(false);
      });
    };

    initial();
  }, []);

  // useEffect(() => {
  //   onWebsiteLoaded(() => {
  //     setIsLoading(false);
  //   });
  // }, [isAuthenticated]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start overflow-x-hidden">
      <Navbar />
      {!isLoading ? (
        isAuthenticated ? (
          <>
            <motion.div
              initial={{ translateY: 50 }}
              animate={{ translateY: 0 }}
              className="flex flex-col items-center justify-center gap-10 w-screen min-h-full font-semibold text-6xl pb-10"
            >
              <p>Hello {display_name}! Welcome back.</p>
              <p>What do you want to eat today!?</p>
            </motion.div>
            <div className="flex flex-col items-center justify-center w-screen min-h-[800px]">
              <div className="flex flex-col items-start">
                <div className="text-2xl">Our recommend menu</div>
                <div className="flex gap-4 w-[600px] h-[400px] ">
                  <div className="w-[60%] h-full">
                    <img
                      onClick={() => {
                        router.push(`/product`);
                      }}
                      className="w-full h-full object-cover rounded-md cursor-pointer"
                      src={`${recommend[0]["image"]}`}
                      alt=""
                    />
                  </div>
                  <div className="flex w-[40%] h-full flex-col gap-4">
                    <div className="w-full h-[40%]">
                      <img
                        onClick={() => {
                          router.push(`/product`);
                        }}
                        className="w-full h-full object-cover rounded-md cursor-pointer"
                        src={`${recommend[1]["image"]}`}
                        alt=""
                      />
                    </div>
                    <div className="w-full h-[60%]">
                      <img
                        onClick={() => {
                          router.push(`/product`);
                        }}
                        className="w-full h-full object-cover rounded-md cursor-pointer"
                        src={`${recommend[2]["image"]}`}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ translateY: 50 }}
              animate={{ translateY: 0 }}
              className="flex flex-col items-center justify-center gap-10 w-screen min-h-full font-semibold text-6xl pb-10"
            >
              <p>Welcome to our application!</p>
              <p>Please login before you can order!</p>
            </motion.div>
            <div className="flex flex-col items-center justify-center w-screen min-h-[800px]">
              <div className="flex flex-col items-start">
                <div className="text-2xl">Our recommend menu</div>
                <div className="flex gap-4 w-[600px] h-[400px] ">
                  <div className="w-[60%] h-full">
                    <img
                      onClick={() => {
                        router.push(`/product`);
                      }}
                      className="w-full h-full object-cover rounded-md cursor-pointer"
                      src={`${recommend[0]["image"]}`}
                      alt=""
                    />
                  </div>
                  <div className="flex w-[40%] h-full flex-col gap-4">
                    <div className="w-full h-[40%]">
                      <img
                        onClick={() => {
                          router.push(`/product`);
                        }}
                        className="w-full h-full object-cover rounded-md cursor-pointer"
                        src={`${recommend[1]["image"]}`}
                        alt=""
                      />
                    </div>
                    <div className="w-full h-[60%]">
                      <img
                        onClick={() => {
                          router.push(`/product`);
                        }}
                        className="w-full h-full object-cover rounded-md cursor-pointer"
                        src={`${recommend[2]["image"]}`}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}
