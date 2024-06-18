import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { orderStatus } from "~/constants";
import type { ProductDiscount } from "~/types/product";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getOrderStatusLabel = (status: string) => {
  return orderStatus.find((s) => s.id === status)?.label;
};

export const applyDiscount = (price: number, discounts: ProductDiscount[]) => {
  return discounts.reduce((acc, discount) => {
    if (discount.isPercentage) {
      return acc - acc * (discount.discount / 100);
    }

    return acc - discount.discount;
  }, price);
};
