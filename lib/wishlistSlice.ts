import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/type";
import type { RootState } from "./store";
import { selectAllProducts } from "./productsSlice";

type WishlistState = {
    ids: number[];
};

const initialState: WishlistState = {
    ids: [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        toggleWishlistItem(state, action: PayloadAction<number>) {
            if (state.ids.includes(action.payload)) {
                state.ids = state.ids.filter((id) => id !== action.payload);
                return;
            }

            state.ids.unshift(action.payload);
        },
        removeWishlistItem(state, action: PayloadAction<number>) {
            state.ids = state.ids.filter((id) => id !== action.payload);
        },
        clearWishlist(state) {
            state.ids = [];
        },
    },
});

export const selectWishlistIds = (state: RootState) => state.wishlist.ids;
export const selectWishlistCount = (state: RootState) => state.wishlist.ids.length;
export const selectIsWishlisted = (id: number) => (state: RootState) => state.wishlist.ids.includes(id);

export const selectWishlistProducts = createSelector(
    [selectAllProducts, selectWishlistIds],
    (products, wishlistIds) => {
        const byId = new Map(products.map((product) => [product.id, product]));
        return wishlistIds.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product));
    },
);

export const { clearWishlist, removeWishlistItem, toggleWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
