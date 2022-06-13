import { ReactNode } from "react";
import { useTheme, View } from "vcc-ui";

export const Controls = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();

  return (
    <View
      direction="row"
      padding={4}
      paddingTop={0}
      extend={{
        columnGap: theme.baselineGrid / 2,
        justifyContent: "center",
        [theme.breakpoints.fromM]: {
          columnGap: theme.baselineGrid,
          display: "none",
          justifyContent: "end",
        },
      }}
    >
      {children}
    </View>
  );
};
