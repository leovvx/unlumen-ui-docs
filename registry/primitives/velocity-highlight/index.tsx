"use client";

import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  type Transition,
  useMotionValue,
} from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

type HighlightMode = "children" | "parent";

type Bounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 1250,
  damping: 40,
  mass: 0.5,
};

const MAX_AXIS_SPEED = 1800;
const MAX_STRETCH = 0.28;
const MAX_SQUASH = 0.2;
const STRETCH_TRANSITION = {
  type: "spring" as const,
  damping: 22,
  stiffness: 700,
};
const SETTLE_TRANSITION = {
  type: "spring" as const,
  damping: 24,
  stiffness: 460,
};
const STRETCH_DURATION = 110;

const DEFAULT_BOUNDS_OFFSET: Bounds = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
};

type HighlightContextType<T extends string> = {
  as?: keyof HTMLElementTagNameMap;
  mode: HighlightMode;
  activeValue: T | null;
  setActiveValue: (value: T | null) => void;
  setBounds: (bounds: DOMRect) => void;
  clearBounds: () => void;
  id: string;
  hover: boolean;
  click: boolean;
  className?: string;
  style?: React.CSSProperties;
  activeClassName?: string;
  setActiveClassName: (className: string) => void;
  transition?: Transition;
  disabled?: boolean;
  enabled?: boolean;
  exitDelay?: number;
  forceUpdateBounds?: boolean;
  scaleX?: unknown;
  scaleY?: unknown;
};

const HighlightContext = React.createContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HighlightContextType<any> | undefined
>(undefined);

function useHighlight<T extends string>(): HighlightContextType<T> {
  const context = React.useContext(HighlightContext);
  if (!context) {
    throw new Error("useHighlight must be used within a HighlightProvider");
  }
  return context as unknown as HighlightContextType<T>;
}

type BaseHighlightProps<T extends React.ElementType = "div"> = {
  as?: T;
  ref?: React.Ref<HTMLDivElement>;
  mode?: HighlightMode;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  className?: string;
  style?: React.CSSProperties;
  transition?: Transition;
  hover?: boolean;
  click?: boolean;
  disabled?: boolean;
  enabled?: boolean;
  exitDelay?: number;
};

type ParentModeHighlightProps = {
  boundsOffset?: Partial<Bounds>;
  containerClassName?: string;
  forceUpdateBounds?: boolean;
};

type ControlledParentModeHighlightProps<T extends React.ElementType = "div"> =
  BaseHighlightProps<T> &
    ParentModeHighlightProps & {
      mode: "parent";
      controlledItems: true;
      children: React.ReactNode;
    };

type ControlledChildrenModeHighlightProps<T extends React.ElementType = "div"> =
  BaseHighlightProps<T> & {
    mode?: "children" | undefined;
    controlledItems: true;
    children: React.ReactNode;
  };

type UncontrolledParentModeHighlightProps<T extends React.ElementType = "div"> =
  BaseHighlightProps<T> &
    ParentModeHighlightProps & {
      mode: "parent";
      controlledItems?: false;
      itemsClassName?: string;
      children: React.ReactElement | React.ReactElement[];
    };

type UncontrolledChildrenModeHighlightProps<
  T extends React.ElementType = "div",
> = BaseHighlightProps<T> & {
  mode?: "children";
  controlledItems?: false;
  itemsClassName?: string;
  children: React.ReactElement | React.ReactElement[];
};

type HighlightProps<T extends React.ElementType = "div"> =
  | ControlledParentModeHighlightProps<T>
  | ControlledChildrenModeHighlightProps<T>
  | UncontrolledParentModeHighlightProps<T>
  | UncontrolledChildrenModeHighlightProps<T>;

function Highlight<T extends React.ElementType = "div">({
  ref,
  ...props
}: HighlightProps<T>) {
  const {
    as: Component = "div",
    children,
    value,
    defaultValue,
    onValueChange,
    className,
    style,
    transition = DEFAULT_TRANSITION,
    hover = false,
    click = true,
    enabled = true,
    controlledItems,
    disabled = false,
    exitDelay = 200,
    mode = "children",
  } = props;

  const localRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

  const propsBoundsOffset = (props as ParentModeHighlightProps)?.boundsOffset;
  const boundsOffset = propsBoundsOffset ?? DEFAULT_BOUNDS_OFFSET;
  const boundsOffsetTop = boundsOffset.top ?? 0;
  const boundsOffsetLeft = boundsOffset.left ?? 0;
  const boundsOffsetWidth = boundsOffset.width ?? 0;
  const boundsOffsetHeight = boundsOffset.height ?? 0;

  const boundsOffsetRef = React.useRef({
    top: boundsOffsetTop,
    left: boundsOffsetLeft,
    width: boundsOffsetWidth,
    height: boundsOffsetHeight,
  });

  React.useEffect(() => {
    boundsOffsetRef.current = {
      top: boundsOffsetTop,
      left: boundsOffsetLeft,
      width: boundsOffsetWidth,
      height: boundsOffsetHeight,
    };
  }, [
    boundsOffsetTop,
    boundsOffsetLeft,
    boundsOffsetWidth,
    boundsOffsetHeight,
  ]);

  const [activeValue, setActiveValue] = React.useState<string | null>(
    value ?? defaultValue ?? null,
  );
  const [boundsState, setBoundsState] = React.useState<Bounds | null>(null);
  const [activeClassNameState, setActiveClassNameState] =
    React.useState<string>("");

  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const lastBoundsRef = React.useRef<{
    bounds: Bounds;
    timestamp: number;
  } | null>(null);
  const stretchRunRef = React.useRef(0);

  const triggerStretch = React.useCallback(
    (nextBounds: Bounds) => {
      const timestamp = performance.now();
      const previous = lastBoundsRef.current;
      lastBoundsRef.current = { bounds: nextBounds, timestamp };

      if (!previous) return;

      const elapsed = Math.max(timestamp - previous.timestamp, 16);
      const horizontal = Math.min(
        (Math.abs(nextBounds.left - previous.bounds.left) /
          elapsed /
          MAX_AXIS_SPEED) *
          1000,
        1,
      );
      const vertical = Math.min(
        (Math.abs(nextBounds.top - previous.bounds.top) /
          elapsed /
          MAX_AXIS_SPEED) *
          1000,
        1,
      );

      if (horizontal === 0 && vertical === 0) return;

      const nextScaleX = Math.max(
        1 - MAX_SQUASH,
        Math.min(
          1 + MAX_STRETCH,
          1 + horizontal * MAX_STRETCH - vertical * MAX_SQUASH,
        ),
      );
      const nextScaleY = Math.max(
        1 - MAX_SQUASH,
        Math.min(
          1 + MAX_STRETCH,
          1 + vertical * MAX_STRETCH - horizontal * MAX_SQUASH,
        ),
      );
      const run = ++stretchRunRef.current;

      animate(scaleX, nextScaleX, STRETCH_TRANSITION);
      animate(scaleY, nextScaleY, STRETCH_TRANSITION);

      window.setTimeout(() => {
        if (stretchRunRef.current !== run) return;
        animate(scaleX, 1, SETTLE_TRANSITION);
        animate(scaleY, 1, SETTLE_TRANSITION);
      }, STRETCH_DURATION);
    },
    [scaleX, scaleY],
  );

  const safeSetActiveValue = (id: string | null) => {
    setActiveValue((prev) => {
      if (prev !== id) {
        onValueChange?.(id);
        return id;
      }
      return prev;
    });
  };

  const safeSetBoundsRef = React.useRef<
    ((bounds: DOMRect) => void) | undefined
  >(undefined);

  React.useEffect(() => {
    safeSetBoundsRef.current = (bounds: DOMRect) => {
      if (!localRef.current) return;

      const containerRect = localRef.current.getBoundingClientRect();
      const offset = boundsOffsetRef.current;
      const newBounds: Bounds = {
        top: bounds.top - containerRect.top + offset.top,
        left: bounds.left - containerRect.left + offset.left,
        width: bounds.width + offset.width,
        height: bounds.height + offset.height,
      };

      triggerStretch(newBounds);

      setBoundsState((prev) => {
        if (
          prev &&
          prev.top === newBounds.top &&
          prev.left === newBounds.left &&
          prev.width === newBounds.width &&
          prev.height === newBounds.height
        ) {
          return prev;
        }
        return newBounds;
      });
    };
  });

  const safeSetBounds = (bounds: DOMRect) => {
    safeSetBoundsRef.current?.(bounds);
  };

  const clearBounds = React.useCallback(() => {
    lastBoundsRef.current = null;
    stretchRunRef.current += 1;
    animate(scaleX, 1, SETTLE_TRANSITION);
    animate(scaleY, 1, SETTLE_TRANSITION);
    setBoundsState((prev) => (prev === null ? prev : null));
  }, [scaleX, scaleY]);

  React.useEffect(() => {
    if (value !== undefined) setActiveValue(value);
    else if (defaultValue !== undefined) setActiveValue(defaultValue);
  }, [value, defaultValue]);

  const id = React.useId();

  React.useEffect(() => {
    if (mode !== "parent") return;
    const container = localRef.current;
    if (!container) return;

    const onScroll = () => {
      if (!activeValue) return;
      const activeEl = container.querySelector<HTMLElement>(
        `[data-value="${activeValue}"][data-highlight="true"]`,
      );
      if (activeEl)
        safeSetBoundsRef.current?.(activeEl.getBoundingClientRect());
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [mode, activeValue]);

  const render = (children: React.ReactNode) => {
    if (mode === "parent") {
      return React.createElement(
        Component as React.ElementType,
        {
          ref: localRef,
          "data-slot": "motion-highlight-container",
          style: { position: "relative", zIndex: 1 },
          className: (props as ParentModeHighlightProps)?.containerClassName,
          ...(hover && {
            onMouseLeave: () => {
              safeSetActiveValue(null);
              clearBounds();
            },
          }),
        },
        <>
          <AnimatePresence initial={false} mode="wait">
            {boundsState && (
              <motion.div
                data-slot="motion-highlight"
                animate={{
                  top: boundsState.top,
                  left: boundsState.left,
                  width: boundsState.width,
                  height: boundsState.height,
                  opacity: 1,
                }}
                initial={{
                  top: boundsState.top,
                  left: boundsState.left,
                  width: boundsState.width,
                  height: boundsState.height,
                  opacity: 0,
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    ...transition,
                    delay: (transition?.delay ?? 0) + (exitDelay ?? 0) / 1000,
                  },
                }}
                transition={transition}
                style={{
                  position: "absolute",
                  zIndex: 0,
                  scaleX,
                  scaleY,
                  ...style,
                }}
                className={cn(className, activeClassNameState)}
              />
            )}
          </AnimatePresence>
          {children}
        </>,
      );
    }

    return children;
  };

  return (
    <HighlightContext.Provider
      value={{
        mode,
        activeValue,
        setActiveValue: safeSetActiveValue,
        id,
        hover,
        click,
        className,
        style,
        transition,
        disabled,
        enabled,
        exitDelay,
        setBounds: safeSetBounds,
        clearBounds,
        activeClassName: activeClassNameState,
        setActiveClassName: setActiveClassNameState,
        forceUpdateBounds: (props as ParentModeHighlightProps)
          ?.forceUpdateBounds,
        scaleX,
        scaleY,
      }}
    >
      {enabled
        ? controlledItems
          ? render(children)
          : render(
              React.Children.map(children, (child, index) =>
                React.isValidElement(child) ? (
                  <HighlightItem key={index} className={props?.itemsClassName}>
                    {child}
                  </HighlightItem>
                ) : (
                  child
                ),
              ),
            )
        : children}
    </HighlightContext.Provider>
  );
}

function getNonOverridingDataAttributes(
  element: React.ReactElement,
  dataAttributes: Record<string, unknown>,
): Record<string, unknown> {
  return Object.keys(dataAttributes).reduce<Record<string, unknown>>(
    (acc, key) => {
      if ((element.props as Record<string, unknown>)[key] === undefined) {
        acc[key] = dataAttributes[key];
      }
      return acc;
    },
    {},
  );
}

type ExtendedChildProps = React.ComponentProps<"div"> & {
  id?: string;
  ref?: React.Ref<HTMLElement>;
  "data-active"?: string;
  "data-value"?: string;
  "data-disabled"?: boolean;
  "data-highlight"?: boolean;
  "data-slot"?: string;
};

type HighlightItemProps<T extends React.ElementType = "div"> =
  React.ComponentProps<T> & {
    as?: T;
    children: React.ReactNode;
    id?: string;
    value?: string;
    className?: string;
    style?: React.CSSProperties;
    transition?: Transition;
    activeClassName?: string;
    disabled?: boolean;
    exitDelay?: number;
    asChild?: boolean;
    forceUpdateBounds?: boolean;
  };

function HighlightItem<T extends React.ElementType>({
  ref,
  as,
  children,
  id,
  value,
  className,
  style,
  transition,
  disabled = false,
  activeClassName,
  exitDelay,
  asChild = false,
  forceUpdateBounds,
  ...props
}: HighlightItemProps<T>) {
  const itemId = React.useId();
  const {
    activeValue,
    setActiveValue,
    mode,
    setBounds,
    hover,
    click,
    enabled,
    className: contextClassName,
    style: contextStyle,
    transition: contextTransition,
    id: contextId,
    disabled: contextDisabled,
    exitDelay: contextExitDelay,
    forceUpdateBounds: contextForceUpdateBounds,
    setActiveClassName,
    scaleX,
    scaleY,
  } = useHighlight();

  const Component = (as ?? "div") as React.ElementType;
  const isValidChild = React.isValidElement<ExtendedChildProps>(children);
  const element = isValidChild ? children : null;
  const childValue =
    id ??
    value ??
    element?.props?.["data-value"] ??
    element?.props?.id ??
    itemId;
  const isActive = activeValue === childValue;
  const isDisabled = disabled === undefined ? contextDisabled : disabled;
  const itemTransition = transition ?? contextTransition;

  const localRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

  const refCallback = React.useCallback((node: HTMLElement | null) => {
    localRef.current = node as HTMLDivElement;
  }, []);

  React.useEffect(() => {
    if (mode !== "parent") return;
    let rafId: number;
    let previousBounds: Bounds | null = null;
    const shouldUpdateBounds =
      forceUpdateBounds === true ||
      (contextForceUpdateBounds && forceUpdateBounds !== false);

    const updateBounds = () => {
      if (!localRef.current) return;

      const bounds = localRef.current.getBoundingClientRect();

      if (shouldUpdateBounds) {
        if (
          previousBounds &&
          previousBounds.top === bounds.top &&
          previousBounds.left === bounds.left &&
          previousBounds.width === bounds.width &&
          previousBounds.height === bounds.height
        ) {
          rafId = requestAnimationFrame(updateBounds);
          return;
        }
        previousBounds = bounds;
        rafId = requestAnimationFrame(updateBounds);
      }

      setBounds(bounds);
    };

    if (isActive) {
      updateBounds();
      setActiveClassName(activeClassName ?? "");
    }

    if (shouldUpdateBounds) return () => cancelAnimationFrame(rafId);
  }, [
    mode,
    isActive,
    activeValue,
    setBounds,
    activeClassName,
    setActiveClassName,
    forceUpdateBounds,
    contextForceUpdateBounds,
  ]);

  if (!isValidChild || !element) return children;

  const dataAttributes = {
    "data-active": isActive ? "true" : "false",
    "aria-selected": isActive,
    "data-disabled": isDisabled,
    "data-value": childValue,
    "data-highlight": true,
  };

  const commonHandlers = hover
    ? {
        onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
          setActiveValue(childValue);
          element.props.onMouseEnter?.(e);
        },
        ...(mode !== "parent" && {
          onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
            setActiveValue(null);
            element.props.onMouseLeave?.(e);
          },
        }),
      }
    : click
      ? {
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            setActiveValue(childValue);
            element.props.onClick?.(e);
          },
        }
      : {};

  if (asChild) {
    if (mode === "children") {
      return React.cloneElement(
        element,
        {
          key: childValue,
          ref: refCallback,
          className: cn("relative", element.props.className),
          ...getNonOverridingDataAttributes(element, {
            ...dataAttributes,
            "data-slot": "motion-highlight-item-container",
          }),
          ...commonHandlers,
          ...props,
        },
        <>
          <AnimatePresence initial={false} mode="wait">
            {isActive && !isDisabled && (
              <motion.div
                layoutId={`transition-background-${contextId}`}
                data-slot="motion-highlight"
                style={{
                  position: "absolute",
                  zIndex: 0,
                  scaleX,
                  scaleY,
                  ...contextStyle,
                  ...style,
                }}
                className={cn(contextClassName, activeClassName)}
                transition={itemTransition}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: {
                    ...itemTransition,
                    delay:
                      (itemTransition?.delay ?? 0) +
                      (exitDelay ?? contextExitDelay ?? 0) / 1000,
                  },
                }}
                {...dataAttributes}
              />
            )}
          </AnimatePresence>

          {React.createElement(
            Component,
            {
              "data-slot": "motion-highlight-item",
              style: { position: "relative", zIndex: 1 },
              className,
              ...dataAttributes,
            },
            children,
          )}
        </>,
      );
    }

    return React.cloneElement(element, {
      ref: refCallback,
      ...getNonOverridingDataAttributes(element, {
        ...dataAttributes,
        "data-slot": "motion-highlight-item",
      }),
      ...commonHandlers,
    });
  }

  return enabled
    ? React.createElement(
        Component,
        {
          key: childValue,
          ref: localRef,
          "data-slot": "motion-highlight-item-container",
          className: cn(mode === "children" && "relative", className),
          ...dataAttributes,
          ...props,
          ...commonHandlers,
        },
        <>
          {mode === "children" && (
            <AnimatePresence initial={false} mode="wait">
              {isActive && !isDisabled && (
                <motion.div
                  layoutId={`transition-background-${contextId}`}
                  data-slot="motion-highlight"
                  style={{
                    position: "absolute",
                    zIndex: 0,
                    scaleX,
                    scaleY,
                    ...contextStyle,
                    ...style,
                  }}
                  className={cn(contextClassName, activeClassName)}
                  transition={itemTransition}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: {
                      ...itemTransition,
                      delay:
                        (itemTransition?.delay ?? 0) +
                        (exitDelay ?? contextExitDelay ?? 0) / 1000,
                    },
                  }}
                  {...dataAttributes}
                />
              )}
            </AnimatePresence>
          )}

          {React.cloneElement(element, {
            style: { position: "relative", zIndex: 1 },
            className: element.props.className,
            ...getNonOverridingDataAttributes(element, {
              ...dataAttributes,
              "data-slot": "motion-highlight-item",
            }),
          })}
        </>,
      )
    : children;
}

export {
  Highlight,
  HighlightItem,
  useHighlight,
  type HighlightProps,
  type HighlightItemProps,
};
