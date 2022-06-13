import type { ReactNode } from "react";
import { ThemeBreakpoints, View } from "vcc-ui";

export const BreakpointHide = ({
  when,
  children,
}: {
  when: ThemeBreakpoints[keyof ThemeBreakpoints];
  children: ReactNode;
}) => (
  <View display="contents" extend={{ [when]: { display: "none" } }}>
    {children}
  </View>
);
