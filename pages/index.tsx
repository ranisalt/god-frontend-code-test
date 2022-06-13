import { useEffect, useState } from "react";
import { IconButton, SelectInput, Spinner, useTheme, View } from "vcc-ui";
import { BreakpointHide, Car, CarEntry, Carousel } from "../src/components";
import { useFetch } from "../src/hooks";

const isDivElement = (el: ChildNode | null): el is HTMLDivElement =>
  el?.nodeName === "DIV";

const HomePage = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const [gridRef, setGridRef] = useState<HTMLDivElement | null>(null);
  const allCars = useFetch<Car[]>("/api/cars.json");

  const bodyTypes = Array.from(new Set(allCars?.map((c) => c.bodyType)));

  const filteredCars =
    filter !== "all" ? allCars?.filter((c) => c.bodyType === filter) : allCars;

  const getColumnWidth = () => {
    if (!gridRef) return;

    const { firstChild } = gridRef;
    if (!isDivElement(firstChild)) return;

    const { nextSibling } = firstChild;
    if (!isDivElement(nextSibling)) return;

    return nextSibling.offsetLeft - firstChild.offsetLeft;
  };

  const onCarouselMove = (
    nextOffset: (offsetLeft: number, columnWidth: number) => number
  ) => {
    const columnWidth = getColumnWidth();
    if (!gridRef || !columnWidth) return;

    const left = nextOffset(gridRef.scrollLeft, columnWidth);
    gridRef.scrollTo({ left, behavior: "smooth" });
  };

  useEffect(() => {
    const columnWidth = getColumnWidth();
    if (!gridRef || !columnWidth) return;

    let handle: number | undefined;
    const listener = (ev: Event) => {
      const { scrollLeft } = ev.target as HTMLDivElement;

      if (handle) {
        window.cancelAnimationFrame(handle);
      }

      handle = window.requestAnimationFrame(() =>
        setCurrentIndex(Math.round(scrollLeft / columnWidth))
      );
    };

    gridRef?.addEventListener("scroll", listener);
    return () => gridRef?.removeEventListener("scroll", listener);
  }, [filteredCars, gridRef]);

  useEffect(() => {
    gridRef?.scrollTo({ left: 0, behavior: "smooth" });
  }, [filter]);

  if (!allCars || !filteredCars) {
    return (
      <View alignItems="center" justifyContent="center" height="100vh">
        <Spinner size={48} />
      </View>
    );
  }

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

      <Carousel.Container ref={(ref) => setGridRef(ref)}>
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
              onClick={() => onCarouselMove((_, width) => index * width)}
            />
          ))}
        </BreakpointHide>
      </Carousel.Controls>
    </>
  );
};

export default HomePage;
