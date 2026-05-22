import type { Product, ProductsResponse } from "@/types/catalog";

const API_BASE_URL = "https://dummyjson.com/products";
const PAGE_SIZE = 20;

const parseResponse = async <T>(
  response: Response,
  errorMessage: string,
): Promise<T> => {
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
};

export const getProducts = async (page = 0): Promise<ProductsResponse> => {
  const response = await fetch(
    `${API_BASE_URL}?limit=${PAGE_SIZE}&skip=${page * PAGE_SIZE}`,
  );
  return parseResponse<ProductsResponse>(response, "Unable to fetch products");
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  return parseResponse<Product>(response, "Product details are unavailable");
};

export const getCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const data = await parseResponse<
    Array<string | { slug: string; name: string }>
  >(response, "Unable to fetch categories");
  return data.map((category) =>
    typeof category === "string" ? category : category.slug,
  );
};
