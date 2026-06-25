import api from "./api";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/types/auth.types";

export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);

  return data;
};

export const loginUser = async (payload: LoginPayload) => {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);

  return data;
};
