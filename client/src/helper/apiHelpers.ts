import { ApiErrorProps } from "../types/ApiError.types";

export function isApiError(error: unknown): error is ApiErrorProps {
  return (error as ApiErrorProps).response?.data?.message !== undefined;
}
