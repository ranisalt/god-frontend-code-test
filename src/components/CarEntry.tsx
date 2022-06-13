import type CARS from "../../public/api/cars.json";
import Image, { ImageProps } from "next/image";
import type { ReactNode } from "react";
import { Block, Flex, Link, Text, useTheme } from "vcc-ui";

export type Car = typeof CARS[0];

export const CarEntry = ({
  bodyType,
  id,
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
      <CarBody bodyType={bodyType} />
      <CarModel modelName={modelName} modelType={modelType} />
      <CarImage src={imageUrl} alt={modelName} />

      <Links>
        <CarLink href={`/learn/${id}`}>Learn</CarLink>
        <CarLink href={`/shop/${id}`}>Shop</CarLink>
      </Links>
    </Block>
  );
};

const CarBody = ({ bodyType }: Pick<Car, "bodyType">) => {
  const theme = useTheme();

  return (
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
  );
};

const CarModel = ({
  modelName,
  modelType,
}: Pick<Car, "modelName" | "modelType">) => {
  const theme = useTheme();

  return (
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

const Links = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();

  return (
    <Flex
      extend={{
        columnGap: theme.tokens.buttonPaddingHorizontal,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {children}
    </Flex>
  );
};

const CarLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} arrow="right">
    {children}
  </Link>
);
