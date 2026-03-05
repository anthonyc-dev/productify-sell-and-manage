import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rateProduct, getProductRatings, getMyProductRatings } from "../lib/api";

export const useRateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, rating, feedback }) => rateProduct({ productId, rating, feedback }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useProductRatings = (productId) => {
  return useQuery({
    queryKey: ["ratings", productId],
    queryFn: () => getProductRatings(productId),
    enabled: !!productId,
  });
};

export const useMyProductRatings = () => {
  return useQuery({
    queryKey: ["myProductRatings"],
    queryFn: getMyProductRatings,
  });
};
