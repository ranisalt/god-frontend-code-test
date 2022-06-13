import { Block, IconButton, useTheme } from "vcc-ui";

export enum ScrollDirection {
  FORWARD = 1,
  BACK = -1,
}

export const ControlArrow = ({
  direction,
  onClick,
}: {
  direction: ScrollDirection;
  onClick: (direction: ScrollDirection) => void;
}) => {
  const theme = useTheme();
  const isForward = direction === ScrollDirection.FORWARD;

  // these buttons should use mediacircled-previous and mediacircled-next, but they are missing from possible values of "iconName"
  return (
    <Block extend={{ [theme.breakpoints.untilM]: { display: "none" } }}>
      <IconButton
        aria-label={isForward ? "Forward" : "Back"}
        iconName={
          isForward ? "navigation-chevronforward" : "navigation-chevronback"
        }
        onClick={() => onClick(direction)}
        variant="outline"
      />
    </Block>
  );
};
