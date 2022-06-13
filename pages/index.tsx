import CARS from "../public/api/cars.json";
import Image, { ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { Block, Flex, Link, SelectInput, Text, useTheme, View } from "vcc-ui";
import { Carousel } from "../src/components";

type Car = typeof CARS[0];

const isDivElement = (el: ChildNode | null): el is HTMLDivElement =>
  el?.nodeName === "DIV";

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const modelTypes = Array.from(new Set(CARS.map((c) => c.modelType)));

  const filteredCars =
    filter !== "all" ? CARS.filter((c) => c.modelType === filter) : CARS;

  const onCarouselMove = (
    nextOffset: (offsetLeft: number, columnWidth: number) => number
  ) => {
    const { current } = gridRef;
    if (!current) return;

    const { firstChild } = current;
    if (!isDivElement(firstChild)) return;

    const { nextSibling } = firstChild;
    if (!isDivElement(nextSibling)) return;

    const columnWidth = nextSibling.offsetLeft - firstChild.offsetLeft;

    const left = nextOffset(current.scrollLeft, columnWidth);
    current.scrollTo({ left, behavior: "smooth" });
  };

  useEffect(() => {
    onCarouselMove((_, width) => width * currentIndex);
  }, [currentIndex]);

  return (
    <>
      <View padding={4} paddingBottom={0} display="inline-flex">
        <SelectInput
          label={"Filter by type"}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">all</option>
          {modelTypes.map((modelType) => (
            <option key={modelType} value={modelType}>
              {modelType}
            </option>
          ))}
        </SelectInput>
      </View>

      <Carousel.Container ref={gridRef}>
        {filteredCars.map((car) => (
          <CarouselEntry key={car.id} {...car} />
        ))}
      </Carousel.Container>

      <Carousel.Controls>
        {/* these buttons should use mediacircled-previous and mediacircled-next,
        but they are missing from possible values of "iconName" */}
        <Carousel.ControlArrow
          aria-label={"Back"}
          iconName={"navigation-chevronback"}
          onClick={() => onCarouselMove((left, width) => left - width)}
        />
        <Carousel.ControlArrow
          aria-label={"Forward"}
          iconName={"navigation-chevronforward"}
          onClick={() => onCarouselMove((left, width) => left + width)}
        />

        {filteredCars.map((_, index) => (
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
