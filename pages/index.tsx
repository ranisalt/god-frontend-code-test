import CARS from "../public/api/cars.json";
import { useEffect, useRef, useState } from "react";
import { IconButton, SelectInput, useTheme, View } from "vcc-ui";
import { BreakpointHide, CarEntry, Carousel } from "../src/components";

const isDivElement = (el: ChildNode | null): el is HTMLDivElement =>
  el?.nodeName === "DIV";

const HomePage = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const bodyTypes = Array.from(new Set(CARS.map((c) => c.bodyType)));

  const filteredCars =
    filter !== "all" ? CARS.filter((c) => c.bodyType === filter) : CARS;

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
    setCurrentIndex(0);
  }, [filter]);

  useEffect(() => {
    onCarouselMove((_, width) => width * currentIndex);
  }, [currentIndex]);

  return (
    <>
      <View padding={4} paddingBottom={0} width={290}>
        <SelectInput
          label={"Filter by body type"}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">all</option>

          {bodyTypes.map((bodyType) => (
            <option key={bodyType} value={bodyType}>
              {bodyType}
            </option>
          ))}
        </SelectInput>
      </View>

      <Carousel.Container ref={gridRef}>
        {filteredCars.map((car) => (
          <CarEntry key={car.id} {...car} />
        ))}
      </Carousel.Container>

      <Carousel.Controls>
        <BreakpointHide when={theme.breakpoints.untilM}>
          {/* these buttons should use mediacircled-previous and mediacircled-next,
        but they are missing from possible values of "iconName" */}
          <IconButton
            aria-label="Back"
            iconName="navigation-chevronback"
            onClick={() => onCarouselMove((left, width) => left - width)}
            variant="outline"
          />
          <IconButton
            aria-label="Forward"
            iconName="navigation-chevronforward"
            onClick={() => onCarouselMove((left, width) => left + width)}
            variant="outline"
          />
        </BreakpointHide>

        <BreakpointHide when={theme.breakpoints.fromM}>
          {filteredCars.map((_, index) => (
            <Carousel.ControlIndicator
              key={index}
              current={currentIndex === index}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </BreakpointHide>
      </Carousel.Controls>
    </>
  );
};

export default HomePage;
