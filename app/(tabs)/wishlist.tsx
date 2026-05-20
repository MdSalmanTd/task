import { colors, components } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectThemeMode } from "@/lib/preferencesSlice";
import { fetchProductById } from "@/lib/productsSlice";
import {
  removeWishlistItem,
  selectWishlistIds,
  selectWishlistProducts,
} from "@/lib/wishlistSlice";
import type { Product } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import { styled } from "nativewind";
import { memo, useCallback, useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const catalog = components.catalog;
const SafeAreaView = styled(RNSafeAreaView);
const Image = styled(ExpoImage);

type WishlistRowProps = {
  product: Product;
  onOpen: (id: number) => void;
  onRemove: (id: number) => void;
};

const WishlistRowComponent = ({
  product,
  onOpen,
  onRemove,
}: WishlistRowProps) => (
  <Pressable
    className="flex-row items-center gap-3 rounded-lg border border-catalog-border bg-catalog-surface p-2.5"
    onPress={() => onOpen(product.id)}
  >
    <Image
      source={{ uri: product.thumbnail }}
      className="size-21.5 rounded-lg bg-catalog-image-surface"
      contentFit="contain"
    />
    <View className="flex-1 gap-1">
      <Text
        className="text-[15px] font-sans-bold text-catalog-text"
        numberOfLines={2}
      >
        {product.title}
      </Text>
      <Text className="mb-2 text-xs font-sans-medium capitalize text-catalog-muted-text">
        {product.category}
      </Text>
      <Text className="text-base font-sans-extrabold text-catalog-text">
        ${product.price.toFixed(2)}
      </Text>
    </View>
    <Pressable
      className="size-9.5 items-center justify-center"
      onPress={() => onRemove(product.id)}
      hitSlop={8}
    >
      <Ionicons name="trash-outline" size={20} color={colors.destructive} />
    </Pressable>
  </Pressable>
);

const WishlistRow = memo(WishlistRowComponent);

export default function WishlistScreen() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectWishlistProducts);
  const wishlistIds = useAppSelector(selectWishlistIds);
  const isDark = useAppSelector(selectThemeMode) === "dark";

  const openProduct = useCallback((id: number) => {
    router.push({ pathname: "/products/[id]", params: { id: String(id) } });
  }, []);

  const removeItem = useCallback(
    (id: number) => {
      dispatch(removeWishlistItem(id));
    },
    [dispatch],
  );

  useEffect(() => {
    wishlistIds.forEach((id) => {
      if (!products.some((product) => product.id === id)) {
        dispatch(fetchProductById(id));
      }
    });
  }, [dispatch, products, wishlistIds]);

  return (
    <SafeAreaView
      className={clsx(
        "flex-1 bg-catalog-background p-4",
        isDark && "bg-catalog-dark-background",
      )}
    >
      <View className="flex-row items-center justify-between pb-3.5 pt-2">
        <Text
          className={clsx(
            "pb-4 pt-2 text-[28px] font-sans-extrabold text-catalog-text",
            isDark && "text-white",
          )}
        >
          Wishlist
        </Text>
        <Text
          className={clsx(
            "font-sans-bold text-catalog-muted-text",
            isDark && "text-catalog-dark-muted-text",
          )}
        >
          {wishlistIds.length} saved
        </Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <WishlistRow
            product={item}
            onOpen={openProduct}
            onRemove={removeItem}
          />
        )}
        contentContainerStyle={catalog.wishlistContent}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center gap-2.5 px-6">
            <Ionicons name="heart-outline" size={42} color="#94a3b8" />
            <Text
              className={clsx(
                "text-lg font-sans-bold text-catalog-text",
                isDark && "text-white",
              )}
            >
              Your wishlist is empty
            </Text>
            <Text className="text-center font-sans-medium text-catalog-muted-text">
              Save products from the catalog and they will stay here after
              restart.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
