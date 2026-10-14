import axios, { AxiosError } from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  // Sesi disimpan di httpOnly cookie dari backend
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Terjadi kesalahan";
    return Promise.reject(new Error(message));
  },
);

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};
