import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../firebase/products';

export const useAllProducts = () =>
  useQuery({ queryKey: ['products'], queryFn: getAllProducts });

export const useProductsByCategory = (category) =>
  useQuery({
    queryKey: ['products', category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
  });

/** Derives unique categories from all products */
export const useCategories = () => {
  const { data: products } = useAllProducts();
  const categories = products
    ? [...new Set(products.map((p) => p.category))].sort()
    : [];
  return { data: categories, isLoading: !products };
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => updateProduct(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
};
