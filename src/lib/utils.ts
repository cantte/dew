import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { orderStatus } from "~/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getOrderStatusLabel = (status: string) => {
  return orderStatus.find((s) => s.id === status)?.label;
};
