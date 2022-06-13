import CARS from "../public/api/cars.json";
import Image, { ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Block,
  Flex,
  IconButton,
  Link,
  Text,
  useTheme,
  View,
  ViewProps,
} from "vcc-ui";
import { Carousel } from "../src/components";
import { ScrollDirection } from "../src/components/Carousel";

type Car = typeof CARS[0];

const isDivElement = (el: ChildNode | null): el is HTMLDivElement =>
  el?.nodeName === "DIV";

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

    current.scrollBy({ left: columnWidth * direction, behavior: "smooth" });
  };

  useEffect(() => {
    const { current } = gridRef;
    if (!current) return;

    const columnWidth = getChildWidth(current);
    if (!columnWidth) return;

    current.scrollTo({ left: columnWidth * currentIndex, behavior: "smooth" });
  }, [currentIndex]);

  const { BACK, FORWARD } = Carousel.ScrollDirection;
  return (
    <>
      <Carousel.Container ref={gridRef}>
        <>
          {CARS.map((car) => (
            <CarouselEntry key={car.id} {...car} />
          ))}
        </>
      </Carousel.Container>

      <Carousel.Controls>
        <Carousel.ControlArrow direction={BACK} onClick={scroll} />
        <Carousel.ControlArrow direction={FORWARD} onClick={scroll} />

        {CARS.map((_, index) => (
          <Carousel.ControlIndicator
            key={index}
            current={currentIndex === index}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Carousel.Controls>
    </>
  );
};

const CarouselEntry = ({
  id,
  bodyType,
  imageUrl,
  modelName,
  modelType,
}: Car) => {
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

      <CarImage src={imageUrl} alt={modelName} />

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

const CarImage = ({ src, alt }: Pick<ImageProps, "src" | "alt">) => {
  const theme = useTheme();

  return (
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
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
    </Block>
  );
};

export default HomePage;
