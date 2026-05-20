export const colors = {
  background: "#fff9e3",
  foreground: "#081126",
  card: "#fff8e7",
  muted: "#f6eecf",
  mutedForeground: "rgba(0, 0, 0, 0.6)",
  primary: "#081126",
  accent: "#ea7a53",
  border: "rgba(0, 0, 0, 0.1)",
  success: "#16a34a",
  destructive: "#dc2626",
  subscription: "#8fd1bd",
  catalogBackground: "#f8fafc",
  catalogDarkBackground: "#000000",
  catalogSurface: "#ffffff",
  catalogMutedSurface: "#e2e8f0",
  catalogImageSurface: "#f1f5f9",
  catalogBorder: "#e2e8f0",
  catalogMutedText: "#64748b",
  catalogDarkMutedText: "#a1a1aa",
  catalogText: "#0f172a",
  catalogDarkSurface: "#121212",
  catalogDarkBorder: "#27272a",
  catalogAccent: "#f97316",
  favorite: "#e11d48",
  warning: "#f59e0b",
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  18: 72,
  20: 80,
  24: 96,
  30: 120,
} as const;

export const components = {
  tabBar: {
    height: spacing[18],
    horizontalInset: spacing[5],
    radius: spacing[8],
    iconFrame: spacing[12],
    itemPaddingVertical: spacing[2],
  },
  catalog: {
    listContent: {
      paddingBottom: 128,
      gap: spacing[3],
    },
    chipList: {
      gap: spacing[2],
      paddingTop: spacing[4],
      paddingBottom: spacing[2],
    },
    sortList: {
      gap: spacing[2],
      paddingRight: spacing[2],
    },
    wishlistContent: {
      paddingBottom: 128,
      gap: spacing[3],
      flexGrow: 1,
    },
    detailContent: {
      paddingBottom: spacing[9],
    },
    columnGap: {
      gap: spacing[3],
    },
    footerLoader: {
      marginVertical: spacing[5],
    },
  },
} as const;

export const theme = {
  colors,
  spacing,
  components,
} as const;
