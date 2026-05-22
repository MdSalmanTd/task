import { colors, components } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    selectGridView,
    selectThemeMode,
    toggleGridView,
    toggleThemeMode,
} from "@/store/slices/preferencesSlice";
import { selectAllProducts } from "@/store/slices/productsSlice";
import {
    clearWishlist,
    selectWishlistCount,
} from "@/store/slices/wishlistSlice";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { styled } from "nativewind";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const catalog = components.catalog;

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const gridView = useAppSelector(selectGridView);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const cachedProducts = useAppSelector(selectAllProducts).length;
  const isDark = themeMode === "dark";

  const confirmClearWishlist = () => {
    Alert.alert(
      "Clear wishlist?",
      "This removes all saved products from local storage.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => dispatch(clearWishlist()),
        },
      ],
    );
  };

  return (
    <SafeAreaView
      className={clsx("flex-1 bg-stone-50 px-4 pt-2", isDark && "bg-zinc-950")}
    >
      <View className="mb-5 flex-row items-center justify-between border-b border-stone-200 pb-3 dark:border-zinc-800">
        <Text className="font-sans-extrabold text-[28px] italic tracking-wide text-amber-600">
          Lumiere
        </Text>
        <Pressable
          className={clsx(
            "size-9 items-center justify-center rounded-full",
            isDark ? "bg-zinc-800" : "bg-white",
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={catalog.wishlistContent}
      >
        <Text
          className={clsx(
            "mb-5 text-2xl font-sans-extrabold text-zinc-900",
            isDark && "text-white",
          )}
        >
          Settings
        </Text>

        <View
          className={clsx(
            "mb-3 rounded-2xl border border-stone-100 bg-white p-4",
            isDark && "border-zinc-800 bg-zinc-900",
          )}
        >
          <Text
            className={clsx(
              "mb-3 text-[11px] font-sans-bold uppercase tracking-[1.8px]",
              isDark ? "text-zinc-100" : "text-zinc-400",
            )}
          >
            Appearance
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text
                className={clsx(
                  "text-sm font-sans-bold text-zinc-900",
                  isDark && "text-white",
                )}
              >
                Dark mode
              </Text>
              <Text
                className={clsx(
                  "mt-0.5 text-xs font-sans-medium",
                  isDark ? "text-zinc-200" : "text-zinc-400",
                )}
              >
                Switch between light and dark theme
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => {
                dispatch(toggleThemeMode());
              }}
            />
          </View>
        </View>

        <View
          className={clsx(
            "mb-3 rounded-2xl border border-stone-100 bg-white p-4",
            isDark && "border-zinc-800 bg-zinc-900",
          )}
        >
          <Text
            className={clsx(
              "mb-3 text-[11px] font-sans-bold uppercase tracking-[1.8px]",
              isDark ? "text-zinc-100" : "text-zinc-400",
            )}
          >
            Data & Wishlist
          </Text>
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text
                className={clsx(
                  "text-sm font-sans-bold text-zinc-900",
                  isDark && "text-zinc-100",
                )}
              >
                Wishlist items
              </Text>
              <Text
                className={clsx(
                  "mt-0.5 text-xs font-sans-medium",
                  isDark ? "text-zinc-300" : "text-zinc-400",
                )}
              >
                {wishlistCount} saved items
              </Text>
            </View>
            <Pressable
              className="rounded-lg bg-red-50 px-3 py-1.5"
              onPress={confirmClearWishlist}
            >
              <Text className="text-xs font-sans-bold text-red-500">Clear</Text>
            </Pressable>
          </View>
          <View className="border-t border-stone-100 pt-3 dark:border-zinc-800">
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className={clsx(
                    "text-sm font-sans-bold text-zinc-900",
                    isDark && "text-zinc-100",
                  )}
                >
                  Cached products
                </Text>
                <Text
                  className={clsx(
                    "mt-0.5 text-xs font-sans-medium",
                    isDark ? "text-zinc-300" : "text-zinc-400",
                  )}
                >
                  {cachedProducts} products cached
                </Text>
              </View>
              <View
                className={clsx(
                  "rounded-lg px-3 py-1.5",
                  isDark ? "bg-zinc-800" : "bg-stone-50",
                )}
              >
                <Text
                  className={clsx(
                    "text-xs font-sans-bold",
                    isDark ? "text-zinc-300" : "text-zinc-500",
                  )}
                >
                  Runtime
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          className={clsx(
            "mb-3 rounded-2xl border border-stone-100 bg-white p-4",
            isDark && "border-zinc-800 bg-zinc-900",
          )}
        >
          <Text
            className={clsx(
              "mb-3 text-[11px] font-sans-bold uppercase tracking-[1.8px]",
              isDark ? "text-zinc-100" : "text-zinc-400",
            )}
          >
            Preferences
          </Text>
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text
                  className={clsx(
                    "text-sm font-sans-bold text-zinc-900",
                    isDark && "text-zinc-100",
                  )}
                >
                  Grid product view
                </Text>
                <Text
                  className={clsx(
                    "mt-0.5 text-xs font-sans-medium",
                    isDark ? "text-zinc-300" : "text-zinc-400",
                  )}
                >
                  Switch catalog layout density
                </Text>
              </View>
              <Switch
                value={gridView}
                onValueChange={() => {
                  dispatch(toggleGridView());
                }}
              />
            </View>
            <View className="border-t border-stone-100 dark:border-zinc-800" />
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text
                  className={clsx(
                    "text-sm font-sans-bold text-zinc-900",
                    isDark && "text-zinc-100",
                  )}
                >
                  Price alerts
                </Text>
                <Text
                  className={clsx(
                    "mt-0.5 text-xs font-sans-medium",
                    isDark ? "text-zinc-300" : "text-zinc-400",
                  )}
                >
                  Notify on price drops
                </Text>
              </View>
              <Switch value />
            </View>
            <View className="border-t border-stone-100 dark:border-zinc-800" />
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text
                  className={clsx(
                    "text-sm font-sans-bold text-zinc-900",
                    isDark && "text-zinc-100",
                  )}
                >
                  Show out-of-stock
                </Text>
                <Text
                  className={clsx(
                    "mt-0.5 text-xs font-sans-medium",
                    isDark ? "text-zinc-300" : "text-zinc-400",
                  )}
                >
                  Display unavailable items
                </Text>
              </View>
              <Switch value />
            </View>
          </View>
        </View>

        <View
          className={clsx(
            "rounded-2xl border border-stone-100 bg-white p-4",
            isDark && "border-zinc-800 bg-zinc-900",
          )}
        >
          <Text
            className={clsx(
              "mb-3 text-[11px] font-sans-bold uppercase tracking-[1.8px]",
              isDark ? "text-zinc-100" : "text-zinc-400",
            )}
          >
            About
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text
                className={clsx(
                  "text-sm font-sans-medium",
                  isDark ? "text-zinc-300" : "text-zinc-400",
                )}
              >
                Version
              </Text>
              <Text
                className={clsx(
                  "text-sm font-sans-bold text-zinc-900",
                  isDark && "text-zinc-100",
                )}
              >
                1.0.0
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text
                className={clsx(
                  "text-sm font-sans-medium",
                  isDark ? "text-zinc-300" : "text-zinc-400",
                )}
              >
                API
              </Text>
              <Text
                className={clsx(
                  "text-sm font-sans-bold text-zinc-900",
                  isDark && "text-zinc-100",
                )}
              >
                DummyJSON v1
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text
                className={clsx(
                  "text-sm font-sans-medium",
                  isDark ? "text-zinc-300" : "text-zinc-400",
                )}
              >
                State
              </Text>
              <Text
                className={clsx(
                  "text-sm font-sans-bold text-zinc-900",
                  isDark && "text-zinc-100",
                )}
              >
                Redux Toolkit
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text
                className={clsx(
                  "text-sm font-sans-medium",
                  isDark ? "text-zinc-300" : "text-zinc-400",
                )}
              >
                Persistence
              </Text>
              <Text
                className={clsx(
                  "text-sm font-sans-bold text-zinc-900",
                  isDark && "text-zinc-100",
                )}
              >
                AsyncStorage
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
