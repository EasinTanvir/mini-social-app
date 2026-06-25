import api from "./api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth.types";

export const registerUser = async (payload: RegisterRequest) => {
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);

  return data;
};

export const loginUser = async (payload: LoginRequest) => {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);

  return data;
};
