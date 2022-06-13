import { Block, useTheme } from "vcc-ui";

interface Props {
  current: boolean;
  onClick: () => void;
}
export const ControlIndicator = ({ current, onClick }: Props) => {
  const theme = useTheme();

  // using nested block allows larger click area & improved accessibility
  return (
    <Block
      extend={{ cursor: "pointer", padding: theme.baselineGrid / 2 }}
      onClick={() => onClick()}
    >
      <Block
        extend={{
          backgroundColor: current
            ? theme.color.foreground.primary
            : theme.color.ornament.divider,
          borderRadius: "50%",
          height: theme.baselineGrid,
          // there is an attribute "animation" on the theme object, but it is not typed. 150ms is equivalent to the "elk" duration
          transition: "150ms ease-in-out",
          width: theme.baselineGrid,
        }}
      />
    </Block>
  );
};
