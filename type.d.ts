import type { ImageSourcePropType } from "react-native";

export type SortOrder = "none" | "price-asc" | "price-desc" | "rating" | "name";
export type ThemeMode = "light" | "dark";

export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand?: string;
    sku?: string;
    thumbnail: string;
    images: string[];
    availabilityStatus?: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

declare global {
    interface AppTab {
        name: string;
        title: string;
        icon: ImageSourcePropType;
    }

    interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }
}

export {};
