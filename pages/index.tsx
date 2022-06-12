import CARS from "../public/api/cars.json";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Block, Flex, IconButton, Link, Text, useTheme, View } from "vcc-ui";

type Car = typeof CARS[0];

const isDivElement = (el: ChildNode | null): el is HTMLDivElement =>
  el?.nodeName === "DIV";

type ScrollDirection = "forward" | "back";

const getChildWidth = (current: HTMLDivElement) => {
  const { firstChild } = current;
  if (!isDivElement(firstChild)) return;

  const { nextSibling } = firstChild;
  if (!isDivElement(nextSibling)) return;

  return nextSibling.offsetLeft - firstChild.offsetLeft;
};

const HomePage = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: ScrollDirection) => {
    const { current } = gridRef;
    if (!current) return;

    const columnWidth = getChildWidth(current);
    if (!columnWidth) return;

    current.scrollBy({
      left: direction === "forward" ? columnWidth : -columnWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const { current } = gridRef;
    if (!current) return;

    const columnWidth = getChildWidth(current);
    if (!columnWidth) return;

    current.scrollTo({ left: currentIndex * columnWidth, behavior: "smooth" });
  }, [currentIndex]);

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
        extend={{
          columnGap: theme.baselineGrid,
          [theme.breakpoints.untilM]: { display: "none" },
        }}
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

      <View
        padding={4}
        paddingTop={0}
        direction="row"
        justifyContent="center"
        extend={{
          columnGap: theme.baselineGrid / 2,
          [theme.breakpoints.fromM]: { display: "none" },
        }}
      >
        {CARS.map((_, index) => (
          <Block
            key={index}
            extend={{ cursor: "pointer", padding: theme.baselineGrid / 2 }}
            onClick={() => setCurrentIndex(index)}
          >
            <Block
              extend={{
                backgroundColor:
                  currentIndex === index
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
        ))}
      </View>
    </>
  );
};

const ListEntry = ({ id, bodyType, imageUrl, modelName, modelType }: Car) => {
  const theme = useTheme();

  return (
    <Block
      extend={{
        scrollSnapAlign: "center",
        [theme.breakpoints.fromM]: { scrollSnapAlign: "start" },
      }}
    >
      <Text
        variant="bates"
        subStyle="emphasis"
        extend={{
          color: theme.color.foreground.secondary,
          textTransform: "uppercase",
        }}
      >
        {bodyType}
      </Text>

      <Flex
        extend={{
          columnGap: theme.baselineSubGrid,
          marginBottom: 2 * theme.baselineGrid,
          [theme.breakpoints.fromM]: { flexDirection: "row" },
        }}
      >
        <Text as="span" variant="columbus" subStyle="emphasis">
          {modelName}
        </Text>

        <Text
          as="span"
          variant="columbus"
          extend={{ color: theme.color.foreground.secondary }}
        >
          {modelType}
        </Text>
      </Flex>

      <Block
        extend={{
          aspectRatio: "4 / 3",
          marginBlock: theme.baselineGrid,
          position: "relative",
          // each item is as wide as possible, sans the container padding (4 * baseline grid on each side), so it sits perfectly centered
          width: `calc(100vw - ${8 * theme.baselineGrid}px)`,
          [theme.breakpoints.fromM]: { width: 290 },
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
          columnGap: theme.tokens.buttonPaddingHorizontal,
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
