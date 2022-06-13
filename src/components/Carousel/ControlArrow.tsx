import { Block, IconButton, IconButtonProps, useTheme } from "vcc-ui";

export const ControlArrow = (props: IconButtonProps) => {
  const theme = useTheme();

  return (
    <Block extend={{ [theme.breakpoints.untilM]: { display: "none" } }}>
      <IconButton {...props} variant="outline" />
    </Block>
  );
};
