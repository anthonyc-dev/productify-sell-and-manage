import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  deleteOrder,
  deleteAllOrders,
} from "../lib/api";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useMyOrders = (options = {}) => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getMyOrders,
    ...options,
  });
};

export const useOrder = (id) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useClearOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
