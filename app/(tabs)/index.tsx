import { colors, components } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    selectGridView,
    selectThemeMode,
    toggleGridView,
    toggleThemeMode,
} from "@/store/slices/preferencesSlice";
import {
    fetchCategories,
    fetchProducts,
    selectProductsMeta,
    selectVisibleProducts,
    setSearchQuery,
    setSelectedCategory,
    setSortOrder,
} from "@/store/slices/productsSlice";
import {
    selectWishlistIds,
    toggleWishlistItem,
} from "@/store/slices/wishlistSlice";
import type { Product, SortOrder } from "@/types/catalog";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import { styled } from "nativewind";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    type LayoutChangeEvent,
    Modal,
    Pressable,
    RefreshControl,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const catalog = components.catalog;
const SafeAreaView = styled(RNSafeAreaView);
const Image = styled(ExpoImage);

const LIST_ROW_HEIGHT = 140;
const GRID_ROW_HEIGHT = 230;

const sortOptions: { label: string; value: SortOrder }[] = [
  { label: "Default", value: "none" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Name A–Z", value: "name" },
];

type ProductCardProps = {
  product: Product;
  wishlisted: boolean;
  gridView: boolean;
  isDark: boolean;
  onOpen: (id: number) => void;
  onToggleWishlist: (id: number) => void;
};

const ProductCardComponent = ({
  product,
  wishlisted,
  gridView,
  isDark,
  onOpen,
  onToggleWishlist,
}: ProductCardProps) => {
  const availability =
    product.stock > 0
      ? (product.availabilityStatus ?? "In stock")
      : "Out of stock";

  return (
    <Pressable
      className={clsx(
        "mb-3 flex-1 overflow-hidden rounded-2xl border",
        isDark
          ? "border-catalog-dark-border bg-catalog-dark-surface"
          : "border-catalog-border bg-catalog-surface",
        gridView ? "flex-col" : "flex-row items-center h-32",
      )}
      onPress={() => onOpen(product.id)}
      accessibilityRole="button"
    >
      <Image
        source={{ uri: product.thumbnail }}
        className={clsx(
          isDark ? "bg-catalog-dark-surface" : "bg-catalog-image-surface",
          gridView ? "h-33 w-full" : "h-full w-28 rounded-l-2xl",
        )}
        contentFit="cover"
      />

      {/* Dynamic text bounding box layout container wrapper */}
      <View className="flex-1 justify-between p-3 h-full flex-col">
        <View className="w-full">
          <Text
            className="mb-0.5 text-[9px] font-sans-bold uppercase tracking-[1.5px] text-catalog-accent"
            numberOfLines={1}
          >
            {product.category}
          </Text>
          <View className="flex-row items-start justify-between w-full">
            <Text
              className={clsx(
                "flex-1 text-xs font-sans-bold leading-4 pr-1",
                isDark ? "text-white" : "text-catalog-text",
              )}
              numberOfLines={2}
              style={{ flexShrink: 1, flexWrap: "wrap" }}
            >
              {product.title}
            </Text>
            <Pressable
              className="size-7 items-center justify-center -mt-1"
              onPress={() => onToggleWishlist(product.id)}
              hitSlop={8}
            >
              <Ionicons
                name={wishlisted ? "heart" : "heart-outline"}
                size={20}
                color={
                  wishlisted
                    ? colors.favorite
                    : isDark
                      ? colors.catalogDarkMutedText
                      : colors.catalogMutedText
                }
              />
            </Pressable>
          </View>
        </View>

        <View className="w-full mt-auto">
          <View className="flex-row items-center justify-between w-full">
            <Text className="text-sm font-sans-extrabold text-catalog-accent">
              ${product.price.toFixed(2)}
            </Text>
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={12} color={colors.warning} />
              <Text
                className={clsx(
                  "text-xs font-sans-semibold",
                  isDark
                    ? "text-catalog-dark-muted-text"
                    : "text-catalog-muted-text",
                )}
              >
                {product.rating.toFixed(1)}
              </Text>
            </View>
          </View>
          <Text
            className={clsx(
              "mt-1 text-[10px] font-sans-semibold",
              product.stock > 0 ? "text-success" : "text-destructive",
            )}
          >
            {availability}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const ProductCard = memo(ProductCardComponent);

const SkeletonCardComponent = ({
  gridView,
  isDark,
}: {
  gridView: boolean;
  isDark: boolean;
}) => (
  <View
    className={clsx(
      "mb-3 flex-1 overflow-hidden rounded-2xl border",
      isDark
        ? "border-catalog-dark-border bg-catalog-dark-surface"
        : "border-catalog-border bg-catalog-surface",
      gridView ? "flex-col pb-3" : "flex-row items-center h-32",
    )}
  >
    <View
      className={clsx(
        isDark ? "bg-catalog-dark-surface" : "bg-catalog-image-surface",
        gridView ? "h-33 w-full" : "h-full w-28",
      )}
    />
    <View className="flex-1 p-3 h-full justify-between flex-col">
      <View className="w-full">
        <View
          className={clsx(
            "mb-2 h-3.5 w-[40%] rounded-lg",
            isDark ? "bg-catalog-dark-surface" : "bg-catalog-muted-surface",
          )}
        />
        <View
          className={clsx(
            "mb-1.5 h-4 w-[85%] rounded-lg",
            isDark ? "bg-catalog-dark-surface" : "bg-catalog-muted-surface",
          )}
        />
      </View>
      <View className="flex-row justify-between items-center w-full">
        <View
          className={clsx(
            "h-4 w-[30%] rounded-lg",
            isDark ? "bg-catalog-dark-surface" : "bg-catalog-muted-surface",
          )}
        />
        <View
          className={clsx(
            "h-3 w-[20%] rounded-lg",
            isDark ? "bg-catalog-dark-surface" : "bg-catalog-muted-surface",
          )}
        />
      </View>
    </View>
  </View>
);

const SkeletonCard = memo(SkeletonCardComponent);

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectVisibleProducts);
  const meta = useAppSelector(selectProductsMeta);
  const wishlistIds = useAppSelector(selectWishlistIds);
  const themeMode = useAppSelector(selectThemeMode);
  const gridView = useAppSelector(selectGridView);

  const [searchText, setSearchText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const buttonRef = useRef<View>(null);

  const isDark = themeMode === "dark";
  const wishlistSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);
  const canLoadMore =
    meta.ids.length < meta.total &&
    !meta.loadingMore &&
    !meta.loading &&
    !meta.refreshing;

  useEffect(() => {
    dispatch(fetchProducts({ page: 0 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setSearchQuery(searchText));
    }, 300);

    return () => clearTimeout(timeout);
  }, [dispatch, searchText]);

  const openProduct = useCallback((id: number) => {
    router.push({ pathname: "/products/[id]", params: { id: String(id) } });
  }, []);

  const onToggleWishlist = useCallback(
    (id: number) => {
      dispatch(toggleWishlistItem(id));
    },
    [dispatch],
  );

  const onRefresh = useCallback(() => {
    dispatch(fetchProducts({ page: 0, refresh: true }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (canLoadMore) {
      dispatch(fetchProducts({ page: meta.page + 1 }));
    }
  }, [canLoadMore, dispatch, meta.page]);

  const categories = useMemo(
    () => ["all", ...meta.categories],
    [meta.categories],
  );

  const activeSortLabel = useMemo(() => {
    const found = sortOptions.find((opt) => opt.value === meta.sortOrder);
    return found ? found.label : "Default";
  }, [meta.sortOrder]);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        wishlisted={wishlistSet.has(item.id)}
        gridView={gridView}
        isDark={isDark}
        onOpen={openProduct}
        onToggleWishlist={onToggleWishlist}
      />
    ),
    [gridView, isDark, onToggleWishlist, openProduct, wishlistSet],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<Product> | null | undefined, index: number) => {
      const columns = gridView ? 2 : 1;
      const rowHeight = gridView ? GRID_ROW_HEIGHT : LIST_ROW_HEIGHT;
      const rowIndex = Math.floor(index / columns);

      return {
        length: rowHeight,
        offset: rowHeight * rowIndex,
        index,
      };
    },
    [gridView],
  );

  const handleDropdownLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setButtonLayout((prev) => ({
      x: prev?.x ?? 0,
      y: prev?.y ?? 0,
      width,
      height,
    }));
  }, []);

  const measureDropdownButton = useCallback(() => {
    if (!buttonRef.current?.measureInWindow) {
      return;
    }

    buttonRef.current.measureInWindow((x, y, width, height) => {
      setButtonLayout({ x, y, width, height });
    });
  }, []);

  return (
    <SafeAreaView
      className={clsx(
        "flex-1 bg-catalog-background px-4 pt-2",
        isDark && "bg-catalog-dark-background",
      )}
    >
      {/* Header */}
      <View className="mb-5 flex-row items-center justify-between border-b border-catalog-border pb-3 dark:border-catalog-dark-border">
        <Text className="font-sans-extrabold text-[28px] italic tracking-wide text-catalog-accent">
          Lumiere
        </Text>
        <Pressable
          className={clsx(
            "size-9 items-center justify-center rounded-full",
            isDark ? "bg-catalog-dark-surface" : "bg-catalog-surface",
          )}
          onPress={() => dispatch(toggleThemeMode())}
        >
          <Ionicons
            name={isDark ? "sunny-outline" : "moon-outline"}
            size={18}
            color={isDark ? "#fbbf24" : colors.catalogText}
          />
        </Pressable>
      </View>

      {/* Search Input Bar */}
      <View
        className={clsx(
          "mb-4 h-12 flex-row items-center gap-2.5 rounded-xl border border-catalog-border bg-catalog-surface px-3.5",
          isDark && "border-catalog-dark-border bg-catalog-dark-surface",
        )}
      >
        <Ionicons name="search" size={20} color={colors.catalogMutedText} />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search products"
          placeholderTextColor="#94a3b8"
          className={clsx(
            "flex-1 font-sans-medium text-catalog-text",
            isDark && "text-white",
          )}
        />
      </View>

      {/* Category Horizontal Filter Tags */}
      <View className="mb-4 h-10">
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 2 }}
          renderItem={({ item }) => (
            <Pressable
              className={clsx(
                "h-10 items-center justify-center rounded-xl px-4 mr-2",
                isDark
                  ? "bg-catalog-dark-surface border border-catalog-dark-border"
                  : "bg-catalog-muted-surface",
                meta.selectedCategory === item &&
                  (isDark ? "bg-catalog-accent" : "bg-catalog-text"),
              )}
              onPress={() => dispatch(setSelectedCategory(item))}
            >
              <Text
                className={clsx(
                  "font-sans-semibold capitalize",
                  isDark ? "text-zinc-100" : "text-catalog-text",
                  meta.selectedCategory === item && "text-white",
                )}
              >
                {item === "all" ? "All" : item.replace("-", " ")}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Control Actions Bar: Sort & Layout Toggles */}
      <View className="mb-4 flex-row items-center justify-between gap-3 z-10">
        {/* Customized Dropdown Trigger Button */}
        <Pressable
          ref={buttonRef}
          onLayout={handleDropdownLayout}
          className={clsx(
            "inline-flex h-9 flex-row items-center gap-2 pl-3 pr-2.5 rounded-xl bg-white border border-stone-200 shadow-sm",
            isDark && "bg-zinc-900 border-zinc-800",
          )}
          onPress={() => {
            measureDropdownButton();
            setDropdownOpen(true);
          }}
        >
          <Text
            className={clsx(
              "text-xs font-sans-medium text-zinc-800",
              isDark && "text-zinc-200",
            )}
          >
            {activeSortLabel}
          </Text>
          <Ionicons
            name="chevron-down"
            size={13}
            color={isDark ? "#a1a1aa" : "#71717a"}
          />
        </Pressable>

        {/* Column Layout Grid/List Selectors */}
        <View className="flex-row gap-1">
          <Pressable
            className={clsx(
              "size-9 items-center justify-center rounded-lg border border-catalog-border",
              gridView ? "bg-catalog-accent" : "bg-catalog-surface",
              isDark &&
                !gridView &&
                "border-catalog-dark-border bg-catalog-dark-surface",
            )}
            onPress={() => !gridView && dispatch(toggleGridView())}
          >
            <Ionicons
              name="grid"
              size={15}
              color={gridView ? "#fff" : colors.catalogMutedText}
            />
          </Pressable>
          <Pressable
            className={clsx(
              "size-9 items-center justify-center rounded-lg border border-catalog-border",
              !gridView ? "bg-catalog-accent" : "bg-catalog-surface",
              isDark &&
                gridView &&
                "border-catalog-dark-border bg-catalog-dark-surface",
            )}
            onPress={() => gridView && dispatch(toggleGridView())}
          >
            <Ionicons
              name="list"
              size={17}
              color={!gridView ? "#fff" : colors.catalogMutedText}
            />
          </Pressable>
        </View>
      </View>

      {/* Styled Positioned Dropdown Modal Content */}
      <Modal
        visible={dropdownOpen}
        transparent
        animationType="none"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <Pressable
          className="flex-1 bg-transparent"
          onPress={() => setDropdownOpen(false)}
        >
          <View
            style={{
              position: "absolute",
              top: buttonLayout
                ? buttonLayout.y + buttonLayout.height + 6
                : 200,
              left: buttonLayout ? buttonLayout.x : 16,
              width: 164,
            }}
            className={clsx(
              "rounded-xl border shadow-xl overflow-hidden py-1",
              isDark
                ? "bg-catalog-dark-surface border-catalog-dark-border"
                : "bg-white border-stone-200",
            )}
          >
            {sortOptions.map((item) => {
              const isSelected =
                meta.sortOrder === item.value ||
                (meta.sortOrder === "none" && item.value === "none");
              return (
                <Pressable
                  key={item.value}
                  className={clsx(
                    "w-full px-3.5 py-2",
                    isSelected
                      ? isDark
                        ? "bg-amber-950/40"
                        : "bg-amber-50"
                      : isDark
                        ? "active:bg-zinc-800/50"
                        : "active:bg-stone-50",
                  )}
                  onPress={() => {
                    dispatch(setSortOrder(item.value));
                    setDropdownOpen(false);
                  }}
                >
                  <Text
                    className={clsx(
                      "text-xs font-sans-medium",
                      isSelected
                        ? "text-amber-600 dark:text-amber-400 font-sans-semibold"
                        : isDark
                          ? "text-zinc-200"
                          : "text-zinc-600",
                    )}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* Main Grid/List View Cards List Content */}
      {meta.error ? (
        <View className="flex-1 items-center justify-center gap-2.5 px-6">
          <Ionicons
            name="cloud-offline-outline"
            size={34}
            color={colors.destructive}
          />
          <Text
            className={clsx(
              "text-lg font-sans-bold text-catalog-text",
              isDark && "text-white",
            )}
          >
            Could not load products
          </Text>
          <Text className="text-center font-sans-medium text-catalog-muted-text dark:text-catalog-dark-muted-text">
            {meta.error}
          </Text>
          <Pressable
            className="mt-1.5 rounded-lg bg-catalog-text px-4.5 py-3 dark:bg-catalog-dark-surface"
            onPress={onRefresh}
          >
            <Text className="font-sans-bold text-white">Try again</Text>
          </Pressable>
        </View>
      ) : meta.loading ? (
        <FlatList
          data={Array.from({ length: 6 }, (_, index) => index)}
          numColumns={gridView ? 2 : 1}
          key={gridView ? "skeleton-grid" : "skeleton-list"}
          keyExtractor={(item) => String(item)}
          renderItem={() => (
            <SkeletonCard gridView={gridView} isDark={isDark} />
          )}
          columnWrapperStyle={gridView ? catalog.columnGap : undefined}
          contentContainerStyle={catalog.listContent}
        />
      ) : (
        <FlatList
          data={products}
          key={gridView ? "main-grid-view" : "main-list-view"}
          numColumns={gridView ? 2 : 1}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProduct}
          getItemLayout={getItemLayout}
          columnWrapperStyle={gridView ? catalog.columnGap : undefined}
          contentContainerStyle={catalog.listContent}
          refreshControl={
            <RefreshControl
              refreshing={meta.refreshing}
              onRefresh={onRefresh}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.35}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={40}
          windowSize={7}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center gap-2.5 px-6 pt-10">
              <Ionicons
                name="cube-outline"
                size={34}
                color={colors.catalogMutedText}
              />
              <Text
                className={clsx(
                  "text-lg font-sans-bold text-catalog-text",
                  isDark && "text-white",
                )}
              >
                No products found
              </Text>
              <Text className="text-center font-sans-medium text-catalog-muted-text dark:text-catalog-dark-muted-text">
                Try a different search term or category.
              </Text>
            </View>
          }
          ListFooterComponent={
            meta.loadingMore ? (
              <ActivityIndicator
                style={catalog.footerLoader}
                color={colors.catalogText}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
