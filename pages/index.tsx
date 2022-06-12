import CARS from "../public/api/cars.json";
import Image from "next/image";
import { useRef } from "react";
import { Block, Flex, IconButton, Link, Text, useTheme, View } from "vcc-ui";

type Car = typeof CARS[0];

const isDivElement = (el: ChildNode | null): el is HTMLDivElement =>
  el?.nodeName === "DIV";

type ScrollDirection = "forward" | "back";

const HomePage = () => {
  const { tokens, ...theme } = useTheme();
  const gridRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: ScrollDirection) => {
    const { current } = gridRef;
    if (!current) return;

    const { firstChild } = current;
    if (!isDivElement(firstChild)) return;

    const { nextSibling } = firstChild;
    if (!isDivElement(nextSibling)) return;

    const amount = nextSibling.offsetLeft - firstChild.offsetLeft;
    current.scrollBy({
      left: direction === "forward" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <View
        display="grid"
        padding={4}
        extend={{
          columnGap: 2 * theme.baselineGrid,
          scrollPaddingInline: 4 * theme.baselineGrid,
          gridAutoFlow: "column",
          overflow: "auto",
          scrollbarWidth: "none",
          scrollSnapType: "x mandatory",
        }}
        ref={gridRef}
      >
        {CARS.map((car) => (
          <ListEntry key={car.id} {...car} />
        ))}
      </View>

      <View
        padding={4}
        paddingTop={0}
        direction="row"
        justifyContent="end"
        extend={{ columnGap: theme.baselineGrid }}
      >
        {/* these buttons should use mediacircled-previous and mediacircled-next, but they are missing from possible values of "iconName" */}
        <IconButton
          aria-label="Back"
          iconName="navigation-chevronback"
          onClick={() => scroll("back")}
          variant="outline"
        />
        <IconButton
          aria-label="Forward"
          iconName="navigation-chevronforward"
          onClick={() => scroll("forward")}
          variant="outline"
        />
      </View>
    </>
  );
};

const ListEntry = ({ id, bodyType, imageUrl, modelName, modelType }: Car) => {
  const { breakpoints, color, tokens, ...theme } = useTheme();

  return (
    <Block
      extend={{
        scrollSnapAlign: "center",
        [breakpoints.fromM]: { scrollSnapAlign: "start" },
      }}
    >
      <Text
        variant="bates"
        subStyle="emphasis"
        extend={{
          color: color.foreground.secondary,
          textTransform: "uppercase",
        }}
      >
        {bodyType}
      </Text>

      <Flex
        extend={{
          columnGap: theme.baselineSubGrid,
          marginBottom: 2 * theme.baselineGrid,
          [breakpoints.fromM]: { flexDirection: "row" },
        }}
      >
        <Text as="span" variant="columbus" subStyle="emphasis">
          {modelName}
        </Text>

        <Text
          as="span"
          variant="columbus"
          extend={{ color: color.foreground.secondary }}
        >
          {modelType}
        </Text>
      </Flex>

      <Block
        extend={{
          aspectRatio: "4 / 3",
          width: 290,
          position: "relative",
          marginBlock: theme.baselineGrid,
        }}
      >
        <Image
          src={imageUrl}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt={modelName}
        />
      </Block>

      <Flex
        extend={{
          columnGap: tokens.buttonPaddingHorizontal,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Link href={`/learn/${id}`} arrow="right">
          Learn
        </Link>
        <Link href={`/shop/${id}`} arrow="right">
          Shop
        </Link>
      </Flex>
    </Block>
  );
};

export default HomePage;
