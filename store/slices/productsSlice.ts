import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getCategories, getProductById, getProducts } from "@/api/productsApi";
import type { Product, ProductsResponse, SortOrder } from "@/types/catalog";
import type { RootState } from "../store";

const productsAdapter = createEntityAdapter<Product>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

type ProductsState = ReturnType<typeof productsAdapter.getInitialState> & {
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  sortOrder: SortOrder;
  page: number;
  total: number;
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  selectedProductId: number | null;
};

const initialState: ProductsState = productsAdapter.getInitialState({
  categories: [],
  selectedCategory: "all",
  searchQuery: "",
  sortOrder: "none",
  page: 0,
  total: 0,
  loading: false,
  refreshing: false,
  loadingMore: false,
  error: null,
  selectedProductId: null,
});

export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  { page?: number; refresh?: boolean } | undefined,
  { rejectValue: string }
>("products/fetchProducts", async (params, { rejectWithValue }) => {
  const page = params?.page ?? 0;
  try {
    return await getProducts(page);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Something went wrong",
    );
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>("products/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    return await getProductById(id);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Something went wrong",
    );
  }
});

export const fetchCategories = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>("products/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    return await getCategories();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Something went wrong",
    );
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSortOrder(state, action: PayloadAction<SortOrder>) {
      state.sortOrder = action.payload;
    },
    setSelectedProductId(state, action: PayloadAction<number | null>) {
      state.selectedProductId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.error = null;
        const refresh = action.meta.arg?.refresh;
        const page = action.meta.arg?.page ?? 0;
        state.loading = page === 0 && !refresh;
        state.refreshing = Boolean(refresh);
        state.loadingMore = page > 0;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.loadingMore = false;
        state.page = Math.floor(action.payload.skip / action.payload.limit);
        state.total = action.payload.total;

        if (action.payload.skip === 0) {
          productsAdapter.setAll(state, action.payload.products);
        } else {
          productsAdapter.upsertMany(state, action.payload.products);
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.loadingMore = false;
        state.error = action.payload ?? "Unable to load products";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        productsAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.error = action.payload ?? "Unable to load product details";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

const productSelectors = productsAdapter.getSelectors<RootState>(
  (state) => state.products,
);

export const selectAllProducts = productSelectors.selectAll;
export const selectProductById = productSelectors.selectById;
export const selectProductsMeta = (state: RootState) => state.products;

export const selectVisibleProducts = createSelector(
  [
    selectAllProducts,
    (state: RootState) => state.products.searchQuery,
    (state: RootState) => state.products.selectedCategory,
    (state: RootState) => state.products.sortOrder,
  ],
  (products, searchQuery, selectedCategory, sortOrder) => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch = !query || product.title.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortOrder === "price-asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "price-desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    if (sortOrder === "rating") {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }

    if (sortOrder === "name") {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  },
);

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedProductId,
  setSortOrder,
} = productsSlice.actions;
export default productsSlice.reducer;
