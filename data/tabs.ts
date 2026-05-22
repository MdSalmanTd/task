import { icons } from "@/constants/icons";
import type { AppTab } from "@/types/navigation";

export const tabs: AppTab[] = [
  { name: "index", title: "Home", icon: icons.home },
  { name: "wishlist", title: "Wishlist", icon: icons.wallet },
  { name: "settings", title: "Settings", icon: icons.setting },
];
