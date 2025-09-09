import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  user_id: string;
  username: string;
  display_name: string;
  picture_url: string;
  email: string;
  studentId: string;
};

type UserActions = {
  setUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
};

export const useUserStore = create(
  persist<UserState & UserActions>(
    (set) => ({
      user_id: "",
      username: "",
      display_name: "",
      picture_url: "",
      email: "",
      studentId: "",

      setUser: (user) => set(user),
      clearUser: () =>
        set({
          user_id: "",
          username: "",
          display_name: "",
          picture_url: "",
          email: "",
          studentId: "",
        }),
    }),
    {
      name: "user-storage", // key ใน localStorage
    }
  )
);
