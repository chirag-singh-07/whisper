import { useMutation } from "@tanstack/react-query";
import { client } from "../api/client";
import { useSession } from "../context/AuthContext";
import Toast from "react-native-toast-message";

export const useLogin = () => {
  const { signIn } = useSession();

  return useMutation({
    mutationFn: async (credentials: any) => {
      return client<any>("/auth/login", {
        method: "POST",
        body: credentials,
        skipAuth: true,
      });
    },
    onSuccess: (data) => {
      if (data && data.data && data.data.tokens) {
        signIn(
          data.data.tokens.accessToken,
          data.data,
          data.data.tokens.refreshToken,
        );
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message || "Something went wrong",
      });
      console.log(error);
    },
  });
};

export const useLogout = () => {
  const { signOut } = useSession();

  return useMutation({
    mutationFn: () => client("/auth/logout", { method: "POST" }),
    onSuccess: () => {
      signOut();
      Toast.show({
        type: "success",
        text1: "Logged out",
        text2: "See you soon!",
      });
    },
    onError: (error: any) => {
      // Even if backend fails, we usually want to clear local session
      signOut();
      console.log("Backend logout failed:", error);
    },
  });
};

export const useRegister = () => {
  const { signIn } = useSession();

  return useMutation({
    mutationFn: async (credentials: any) => {
      return client<any>("/auth/register", {
        method: "POST",
        body: credentials,
        skipAuth: true,
      });
    },
    onSuccess: (data) => {
      if (data && data.data && data.data.tokens) {
        signIn(
          data.data.tokens.accessToken,
          data.data,
          data.data.tokens.refreshToken,
        );
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error.message || "Something went wrong",
      });
      console.log(error);
    },
  });
};
