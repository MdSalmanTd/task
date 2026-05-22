# Lumiere E-commerce Product Catalog

Expo SDK 54 React Native app for browsing DummyJSON products, filtering and sorting the catalog, viewing product details, and managing a persisted offline wishlist.

The project uses Expo Router for navigation, Redux Toolkit for application state, Redux Persist for durable wishlist/preferences state, NativeWind for styling, and `expo-image` for product media.

## Project Setup

Expo SDK 54 targets React Native 0.81, React 19.1, React Native Web 0.21, and Node.js 20.19.x. Those versions are reflected in `package.json`; use the SDK 54 docs when adding Expo packages or changing native/runtime behavior: https://docs.expo.dev/versions/v54.0.0/

### Prerequisites

- Node.js 20.19.x
- npm
- Expo Go, an emulator/simulator, or a development build target

### Install Dependencies

```bash
npm install
```

When adding Expo SDK packages, prefer Expo's version-aware installer:

```bash
npx expo install <package-name>
```

### Run The App

```bash
npm run start
```

Then choose a target from the Expo CLI output:

- Press `a` for Android emulator/device.
- Press `i` for iOS simulator, if available.
- Press `w` for web.
- Scan the QR code with Expo Go for a physical device.

Platform-specific shortcuts are also available:

```bash
npm run android
npm run ios
npm run web
```

### Quality Check

```bash
npm run lint
```

## App Structure

- `app/_layout.tsx` wraps the app with the Redux `Provider`, Redux Persist `PersistGate`, global styles, custom font loading, and the Expo Router stack.
- `app/(tabs)/index.tsx` renders the product catalog, search, category filters, sorting, grid/list layout, pagination, refresh, and wishlist toggle actions.
- `app/products/[id].tsx` renders product details and fetches a product by id if it is not already in the normalized cache.
- `app/(tabs)/wishlist.tsx` renders persisted wishlist items and hydrates any missing product records from the API.
- `app/(tabs)/settings.tsx` renders persisted preferences, wishlist controls, and cache metadata.
- `lib/store.ts` configures the Redux store, root reducer, middleware, and persistence.
- `lib/productsSlice.ts` owns product entities, async API requests, catalog filters, pagination, loading/error state, and memoized selectors.
- `lib/wishlistSlice.ts` owns saved product IDs and derives wishlist products from the product cache.
- `lib/preferencesSlice.ts` owns theme and catalog layout preferences.
- `lib/persistStorage.ts` selects AsyncStorage on native platforms and `localStorage` on web.
- `lib/hooks.ts` exposes typed Redux hooks.

## Redux Architecture

The Redux layer is split by domain instead of screen. Screens dispatch domain actions and subscribe through typed selectors, while reducers remain responsible for state updates.

### Store Composition

`lib/store.ts` combines three slices:

- `products`: runtime catalog state, normalized product cache, categories, filters, sort order, pagination, async loading flags, and API errors.
- `wishlist`: persisted list of saved product IDs.
- `preferences`: persisted UI preferences for theme and grid/list catalog layout.

Redux Persist wraps the root reducer with this whitelist:

```ts
whitelist: ["wishlist", "preferences"]
```

That means wishlist and preferences survive app restarts, while product API data is treated as a runtime cache and refetched on launch.

### Products Slice

`productsSlice` uses `createEntityAdapter<Product>` to normalize product records by ID. This avoids duplicating product data across catalog, detail, and wishlist screens.

It exposes async thunks for:

- `fetchProducts({ page, refresh })`: loads paginated product lists from `https://dummyjson.com/products`.
- `fetchProductById(id)`: loads a single product for details or wishlist hydration.
- `fetchCategories()`: loads product category slugs.

It also stores UI query state:

- `searchQuery`
- `selectedCategory`
- `sortOrder`
- `page`
- `total`
- `loading`, `refreshing`, `loadingMore`
- `error`

The main catalog selector, `selectVisibleProducts`, combines normalized products with search, category, and sort state. Because it is built with `createSelector`, filtered/sorted results are recomputed only when the relevant inputs change.

### Wishlist Slice

`wishlistSlice` stores only product IDs:

```ts
{
  ids: number[]
}
```

This keeps persisted data small and prevents stale full product objects from being written to storage. `selectWishlistProducts` joins wishlist IDs with `selectAllProducts` to derive display-ready product rows. If a persisted wishlist ID is missing from the runtime product cache, the wishlist screen dispatches `fetchProductById(id)`.

### Preferences Slice

`preferencesSlice` stores lightweight UI preferences:

- `themeMode`: `"light"` or `"dark"`
- `gridView`: `true` for grid catalog layout, `false` for list layout

These preferences are persisted so the app reopens with the user's previous appearance and density choices.

## State Flow Diagram

```text
User interaction
  |
  | dispatch(action / async thunk)
  v
Redux Toolkit slices
  |
  | productsSlice: API cache, filters, pagination, loading state
  | wishlistSlice: persisted product IDs
  | preferencesSlice: persisted theme/layout settings
  v
Redux store + Redux Persist
  |
  | selectors derive screen-ready data
  v
React screens
  |
  | render catalog, details, wishlist, settings
  v
User sees updated UI
```

Async product flow:

```text
Catalog screen mount or refresh
  -> fetchProducts / fetchCategories
  -> DummyJSON API
  -> products adapter upserts normalized products
  -> selectVisibleProducts applies search/category/sort
  -> FlatList renders the current catalog page
```

Wishlist flow:

```text
Heart button press
  -> toggleWishlistItem(productId)
  -> wishlist.ids updates and persists
  -> catalog/detail/wishlist selectors update
  -> saved state survives app restart
```

## Optimization Techniques Used

- Normalized product storage with `createEntityAdapter` to avoid repeated product copies and simplify by-ID lookups.
- Memoized derived data with `createSelector` for catalog filtering/sorting and wishlist product joining.
- Persist whitelist limited to `wishlist` and `preferences`, keeping storage writes small and avoiding large API cache persistence.
- Debounced search input in the catalog screen before writing `searchQuery` to global Redux state.
- Stable callbacks with `useCallback` for product open, wishlist toggle, refresh, and pagination handlers.
- `useMemo` for derived values such as wishlist ID sets, categories, and active sort labels.
- `React.memo` for product cards, skeleton cards, and wishlist rows to reduce unnecessary item re-renders.
- `FlatList` tuning with stable keys, `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `removeClippedSubviews`, and `getItemLayout`.
- Runtime cache reuse between catalog, details, and wishlist screens, with single-product fallback fetches only when an item is missing.
- `expo-image` for product thumbnails with `contentFit`, giving better image rendering behavior than the default React Native image component.
- Separate loading, refreshing, and loading-more flags so the UI can show the cheapest relevant loading state instead of rerendering the whole screen as one global spinner.

## Main Features

- Product catalog with title, category, thumbnail, price, rating, and availability.
- Paginated product loading from DummyJSON.
- Pull to refresh and infinite scroll.
- Debounced search, category filters, and sort options.
- Grid/list catalog layout toggle.
- Product details route powered by Expo Router dynamic segments.
- Wishlist add/remove from catalog and product details.
- Persisted wishlist, theme mode, and layout preference.
- Settings screen with wishlist clearing and cache visibility.
