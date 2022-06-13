import { forwardRef, ReactNode } from "react";
import { useTheme, View } from "vcc-ui";

export const Container = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children }, ref) => {
    const theme = useTheme();

    return (
      <View
        display="grid"
        padding={4}
        extend={{
          columnGap: 2 * theme.baselineGrid,
          gridAutoFlow: "column",

          // snap scroll configuration
          overflow: "auto",
          scrollPaddingInline: 4 * theme.baselineGrid,
          scrollSnapType: "x mandatory",

          // hide scrollbar
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        ref={ref}
      >
        {children}
      </View>
    );
  }
);
