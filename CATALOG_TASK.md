# E-commerce Product Catalog Task

Build a modern React Native product catalog app with Redux Toolkit state management.

## Screens

- Home: product list, search, category filter, price sorting, pagination, pull to refresh.
- Product Details: image, description, rating, stock, price, wishlist action.
- Wishlist: persisted saved products with instant remove.
- Settings: dark mode, grid/list preference, clear wishlist, static app preferences.

## State Management

- Redux Toolkit slices for products, wishlist, and preferences.
- Async thunks for DummyJSON product list, categories, and details.
- Redux Persist for wishlist and preferences through AsyncStorage.
- Memoized selectors for filtered products and wishlist derivation.

## Quality Requirements

- TypeScript types for API data and app state.
- Skeleton, empty, and error states.
- Optimized FlatList rendering.
- Clear README with setup and architecture notes.
