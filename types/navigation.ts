import type { ImageSourcePropType } from "react-native";

export type AppTab = {
  name: string;
  title: string;
  icon: ImageSourcePropType;
};

export type TabIconProps = {
  focused: boolean;
  icon: ImageSourcePropType;
};
