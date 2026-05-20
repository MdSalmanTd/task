import { tabs } from "@/constants/data";
import { colors, components } from "@/constants/theme";
import { clsx } from "clsx";
import { Image as ExpoImage } from "expo-image";
import { Tabs } from "expo-router";
import { View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
//import { useAuth } from '@clerk/expo';

const tabBar = components.tabBar;

const TabIcon = ({ focused, icon }: TabIconProps) => {
  const isDark = useColorScheme() === "dark";
  return (
    <View className="tabs-icon">
      <View
        className={clsx(
          "size-12 items-center justify-center rounded-full",
          focused ? "bg-catalog-accent" : "bg-transparent",
          isDark && focused && "bg-catalog-dark-accent",
        )}
      >
        <ExpoImage
          source={icon}
          contentFit="contain"
          style={{ width: 24, height: 24 }}
          tintColor={
            focused
              ? isDark
                ? "#ffffff"
                : "#ffffff"
              : isDark
                ? colors.catalogDarkMutedText
                : colors.catalogMutedText
          }
        />
      </View>
    </View>
  );
};
const TabLayout = () => {
  // const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  //  if (!isLoaded) {
  //         return null;
  //     }

  //   if (!isSignedIn) {
  //         return <Redirect href="/(auth)/sign-in" />;
  //     }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: isDark
            ? colors.catalogDarkSurface
            : colors.catalogSurface,
          borderColor: isDark ? colors.catalogDarkBorder : colors.catalogBorder,
          borderWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
          alignItems: "center",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;
