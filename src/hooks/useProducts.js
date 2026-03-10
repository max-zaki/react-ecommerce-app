import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'https://fakestoreapi.com';

const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

const fetchProductsByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error('Failed to fetch products by category');
  return res.json();
};

export const useAllProducts = () =>
  useQuery({ queryKey: ['products'], queryFn: fetchProducts });

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

export const useProductsByCategory = (category) =>
  useQuery({
    queryKey: ['products', category],
    queryFn: () => fetchProductsByCategory(category),
    enabled: !!category,
  });
