# E-commerce Product Catalog

Expo SDK 54 React Native app for browsing DummyJSON products, filtering and sorting the catalog, viewing product details, and managing an offline wishlist.

## Setup

```bash
npm install
npm run start
```

Then open the app with Expo Go, an emulator, or a development build from the Expo CLI output.

## Features

- Product catalog with image, title, category, price, rating, and availability.
- Async product fetching from `https://dummyjson.com/products`.
- Infinite scrolling, pull to refresh, skeleton loading, empty states, and error UI.
- Debounced search, category filters, price sorting, and grid/list toggle.
- Product details screen using `app/products/[id].tsx`.
- Persisted wishlist with instant add/remove syncing across screens.
- Settings screen for dark mode, grid view, clear wishlist, and static preferences.

## Redux Architecture

- `lib/store.ts` configures Redux Toolkit and Redux Persist.
- `lib/productsSlice.ts` owns normalized product entities, async thunks, pagination state, category/search/sort filters, and memoized selectors.
- `lib/wishlistSlice.ts` persists wishlist product IDs and derives visible wishlist products from the normalized product cache.
- `lib/preferencesSlice.ts` persists theme and grid/list display preferences.
- `lib/hooks.ts` provides typed `useAppDispatch` and `useAppSelector` helpers.

Persisted state is limited to `wishlist` and `preferences`; product data is cached in memory for the session and refetched on launch.

## Optimization Notes

- Product state uses `createEntityAdapter` for normalized storage.
- Catalog filtering and sorting use memoized selectors.
- Product cards and wishlist rows use `React.memo`.
- FlatList uses stable keys, limited render batches, windowing, and `removeClippedSubviews`.
- Search input is debounced before updating global Redux state.
