import { colors, components } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectThemeMode } from "@/lib/preferencesSlice";
import { fetchProductById, selectProductById } from "@/lib/productsSlice";
import { selectIsWishlisted, toggleWishlistItem } from "@/lib/wishlistSlice";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { Image as ExpoImage } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const catalog = components.catalog;
const SafeAreaView = styled(RNSafeAreaView);
const Image = styled(ExpoImage);

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) =>
    selectProductById(state, productId),
  );
  const isWishlisted = useAppSelector(selectIsWishlisted(productId));
  const isDark = useAppSelector(selectThemeMode) === "dark";

  useEffect(() => {
    if (Number.isFinite(productId) && !product) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, product, productId]);

  if (!product) {
    return (
      <SafeAreaView
        className={clsx(
          "flex-1 items-center justify-center gap-2.5 bg-catalog-background px-4",
          isDark && "bg-catalog-dark-background",
        )}
      >
        <ActivityIndicator color={colors.catalogText} />
        <Text className="text-center font-sans-medium text-catalog-muted-text">
          Loading product details
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={clsx(
        "flex-1 bg-catalog-background px-4 pt-2",
        isDark && "bg-catalog-dark-background",
      )}
    >
      <View className="flex-row items-center justify-between border-b border-catalog-border pb-3 dark:border-catalog-dark-border">
        <Pressable
          className={clsx(
            "size-9 items-center justify-center rounded-full",
            isDark ? "bg-catalog-dark-surface" : "bg-catalog-surface",
          )}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={isDark ? "white" : colors.catalogText}
          />
        </Pressable>
        <Text className="font-sans-extrabold text-2xl italic tracking-wide text-catalog-accent">
          Lumiere
        </Text>
        <Pressable
          className={clsx(
            "size-9 items-center justify-center rounded-full",
            isDark ? "bg-catalog-dark-surface" : "bg-catalog-surface",
          )}
          onPress={() => dispatch(toggleWishlistItem(product.id))}
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={22}
            color={
              isWishlisted
                ? colors.favorite
                : isDark
                  ? "white"
                  : colors.catalogText
            }
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={catalog.detailContent}
      >
        <Image
          source={{ uri: product.thumbnail }}
          className={clsx(
            "mt-5 h-65 rounded-3xl bg-catalog-image-surface",
            isDark && "bg-catalog-dark-surface",
          )}
          contentFit="cover"
        />
        <Text className="mt-5 text-[10px] font-sans-bold uppercase tracking-[1.5px] text-catalog-accent">
          {product.category}
        </Text>
        <Text
          className={clsx(
            "mt-1 text-[30px] font-sans-extrabold leading-9 text-catalog-text",
            isDark && "text-catalog-dark-muted-text",
          )}
        >
          {product.title}
        </Text>
        {product.brand ? (
          <Text className="mt-1 text-xs font-sans-medium text-catalog-muted-text">
            by{" "}
            <Text
              className={clsx(
                "font-sans-bold text-catalog-text",
                isDark && "text-catalog-dark-muted-text",
              )}
            >
              {product.brand}
            </Text>
          </Text>
        ) : null}

        <View className="my-4 flex-row flex-wrap items-center gap-2">
          <View className="flex-row items-center gap-1 rounded-full bg-catalog-muted-surface px-3 py-1.5 dark:bg-catalog-dark-surface">
            <Ionicons name="star" size={15} color={colors.warning} />
            <Text
              className={clsx(
                "font-sans-bold text-catalog-text",
                isDark && "text-catalog-dark-muted-text",
              )}
            >
              {product.rating.toFixed(1)}
            </Text>
          </View>
          <Text
            className={clsx(
              "rounded-full px-3 py-1.5 text-xs font-sans-bold",
              product.stock > 0
                ? "bg-success/10 text-success dark:bg-success/20"
                : "bg-destructive/10 text-destructive dark:bg-destructive/20",
            )}
          >
            {product.stock > 0
              ? `In stock - ${product.stock} left`
              : "Out of stock"}
          </Text>
          {product.discountPercentage > 1 ? (
            <Text className="rounded-full bg-catalog-muted-surface px-3 py-1.5 text-xs font-sans-bold text-catalog-accent dark:bg-catalog-dark-surface">
              -{Math.round(product.discountPercentage)}%
            </Text>
          ) : null}
        </View>

        <Text
          className={clsx(
            "font-sans-medium leading-5.5 text-catalog-muted-text",
            isDark && "text-catalog-dark-muted-text",
          )}
        >
          {product.description}
        </Text>

        <View className="mt-6 flex-row items-center justify-between border-t border-catalog-border pt-5 dark:border-catalog-dark-border">
          <View>
            <Text className="text-xs font-sans-medium text-catalog-muted-text">
              Price
            </Text>
            <Text className="text-[32px] font-sans-extrabold text-catalog-accent">
              ${product.price.toFixed(2)}
            </Text>
          </View>
          <Pressable
            className={clsx(
              "flex-row items-center gap-2 rounded-xl px-5 py-3",
              isWishlisted
                ? "bg-destructive/10 dark:bg-destructive/20"
                : "bg-catalog-accent",
            )}
            onPress={() => dispatch(toggleWishlistItem(product.id))}
          >
            <Ionicons
              name={isWishlisted ? "heart" : "heart-outline"}
              size={18}
              color={isWishlisted ? colors.favorite : "#fff"}
            />
            <Text
              className={clsx(
                "font-sans-bold",
                isWishlisted ? "text-destructive" : "text-white",
              )}
            >
              {isWishlisted ? "Wishlisted" : "Add to wishlist"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
