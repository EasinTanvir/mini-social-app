import api from "./api";
import { RegisterRequest, RegisterResponse } from "@/types/auth.types";

export const registerUser = async (payload: RegisterRequest) => {
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);

  return data;
};
