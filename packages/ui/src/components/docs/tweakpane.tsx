"use client";

import * as React from "react";

import { Label } from "@workspace/ui/components/ui/label";
import { UnlumenSlider as Slider } from "@workspace/ui/components/ui/unlumen-slider";
import { Input } from "@workspace/ui/components/ui/input";
import { cn } from "@workspace/ui/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/animate-ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select";
import { Switch } from "@workspace/ui/components/ui/switch";
import {
  ArrowUpDownIcon as ChevronsUpDown,
  Settings02Icon as Settings2Icon,
} from "hugeicons-react";

type BaseBindNumber = { value: number };
type BindNumberSlider = BaseBindNumber & {
  min: number;
  max: number;
  step: number;
};
type BindNumberOptions = BaseBindNumber & { options: Record<string, number> };
type BindNumber = BindNumberSlider | BindNumberOptions | BaseBindNumber;
type BindString = {
  value: string;
  options?: Record<string, string>;
};
type BindOptions = {
  value: string | number | boolean;
  options: Record<string, string | number | boolean>;
};
type BindBoolean = { value: boolean };
type Bind = BindNumber | BindString | BindBoolean | BindOptions;

type FlatBinds = Record<string, Bind>;
type NestedBinds = Record<string, FlatBinds>;
type Binds = FlatBinds | NestedBinds;

interface ControlledTweakpaneProps {
  binds: Binds;
  onBindsChange?: (binds: Binds) => void;
}

interface UncontrolledTweakpaneProps {
  initialBinds: Binds;
  onBindsChange?: (binds: Binds) => void;
}

type TweakpaneProps = ControlledTweakpaneProps | UncontrolledTweakpaneProps;

interface NumericInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onValueChange,
  className,
  min,
  max,
  step,
  ...props
}) => {
  const [display, setDisplay] = React.useState<string>(value.toString());

  React.useEffect(() => setDisplay(value.toString()), [value]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setDisplay(v);
      if (v !== "") {
        let n = Number(v);
        if (!isNaN(n)) {
          if (min !== undefined && n < min) n = min;
          if (max !== undefined && n > max) n = max;
          if (step !== undefined) n = Math.round(n / step) * step;
          onValueChange(n);
        }
      }
    },
    [min, max, step, onValueChange],
  );

  const handleBlur = React.useCallback(
    () => setDisplay(value.toString()),
    [value],
  );

  return (
    <Input
      {...props}
      className={cn(
        '[&[type="number"]::-webkit-inner-spin-button]:appearance-none [&[type="number"]::-webkit-outer-spin-button]:appearance-none text-sm',
        className,
      )}
      min={min}
      max={max}
      step={step}
      autoComplete="off"
      type="number"
      inputMode="numeric"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

const isNestedBinds = (binds: Binds): binds is NestedBinds =>
  Object.values(binds).every(
    (v) =>
      typeof v === "object" &&
      v !== null &&
      !("value" in v) &&
      Object.values(v).every(
        (inner) =>
          typeof inner === "object" && inner !== null && "value" in inner,
      ),
  );

const renderNumber = (
  key: string,
  bind: BindNumber,
  onChange: (value: number) => void,
) => {
  return "min" in bind && "max" in bind ? (
    <div key={key} className="flex flex-col gap-1.5">
      <Label
        className="text-xs text-muted-foreground leading-none"
        htmlFor={key}
      >
        {key}
      </Label>
      <div className="flex items-center gap-2">
        <Slider
          min={bind.min}
          max={bind.max}
          step={bind.step}
          value={bind.value}
          onChange={(v) => onChange(v as number)}
          showValue={false}
          className="flex-1 min-w-[80px]"
        />
        <NumericInput
          id={key}
          value={bind.value}
          min={bind.min}
          max={bind.max}
          step={bind.step}
          onValueChange={onChange}
          className="w-[52px] h-7 rounded-md px-2 shrink-0 text-xs"
        />
      </div>
    </div>
  ) : "options" in bind ? (
    <div key={key} className="flex flex-col gap-1.5">
      <Label
        className="text-xs text-muted-foreground leading-none"
        htmlFor={key}
      >
        {key}
      </Label>
      <Select
        value={bind.value.toString()}
        onValueChange={(v) => onChange(Number(v))}
      >
        <SelectTrigger
          id={key}
          className="h-7 rounded-md shadow-none px-2 text-sm w-full"
        >
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(bind.options).map(([k, v]) => (
            <SelectItem className="!h-7 text-sm" key={k} value={v.toString()}>
              {k}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ) : (
    <div key={key} className="flex flex-col gap-1.5">
      <Label
        className="text-xs text-muted-foreground leading-none"
        htmlFor={key}
      >
        {key}
      </Label>
      <NumericInput
        id={key}
        value={bind.value}
        onValueChange={onChange}
        className="h-7 rounded-md px-2 text-xs w-full"
      />
    </div>
  );
};

const renderString = (
  key: string,
  bind: BindString,
  onChange: (value: string | number | boolean) => void,
) => {
  return bind?.options ? (
    <div key={key} className="flex flex-col gap-1.5">
      <Label
        className="text-xs text-muted-foreground leading-none"
        htmlFor={key}
      >
        {key}
      </Label>
      <Select
        value={String(bind.value)}
        onValueChange={(v) => {
          const realValue = Object.values(bind.options ?? {}).find(
            (opt) => String(opt) === v,
          );
          onChange(realValue ?? v);
        }}
      >
        <SelectTrigger id={key} className="h-7 rounded-md px-2 text-xs w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(bind.options).map(([k, value]) => (
            <SelectItem className="!h-7 text-xs" key={k} value={String(value)}>
              {k}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ) : (
    <div key={key} className="flex flex-col gap-1.5">
      <Label
        className="text-xs text-muted-foreground leading-none"
        htmlFor={key}
      >
        {key}
      </Label>
      <Input
        id={key}
        value={bind.value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 rounded-md px-2 text-xs w-full"
      />
    </div>
  );
};

const renderBoolean = (
  key: string,
  bind: BindBoolean,
  onChange: (value: boolean) => void,
) => {
  return (
    <div key={key} className="flex flex-col gap-1.5">
      <Label
        className="text-xs text-muted-foreground leading-none"
        htmlFor={key}
      >
        {key}
      </Label>
      <div className="h-7 flex items-center">
        <Switch id={key} checked={bind.value} onCheckedChange={onChange} />
      </div>
    </div>
  );
};

const renderBind = (
  key: string,
  bind: Bind,
  onChange: (value: unknown) => void,
) => {
  if ("value" in bind) {
    if ("options" in bind) {
      if (typeof bind.value === "number") {
        return renderNumber(key, bind as unknown as BindNumber, onChange);
      }
      return renderString(key, bind as unknown as BindString, (v) =>
        onChange(v),
      );
    }
    if (typeof bind.value === "number") {
      return renderNumber(key, bind as BindNumber, onChange);
    }
    if (typeof bind.value === "string") {
      return renderString(key, bind as BindString, onChange);
    }
    if (typeof bind.value === "boolean") {
      return renderBoolean(key, bind as BindBoolean, onChange);
    }
  }
  return null;
};

const renderFlatBinds = (
  binds: FlatBinds,
  onBindsChange: (binds: FlatBinds) => void,
): React.ReactNode => (
  <div className="flex flex-wrap gap-x-4 gap-y-3 px-3 py-3">
    {Object.entries(binds).map(([key, bind]) => (
      <div key={key} className="min-w-[140px] flex-1">
        {renderBind(key, bind, (value) =>
          onBindsChange({ ...binds, [key]: { ...bind, value } } as FlatBinds),
        )}
      </div>
    ))}
  </div>
);

const renderNestedBinds = (
  binds: NestedBinds,
  onBindsChange: (binds: NestedBinds) => void,
): React.ReactNode[] =>
  Object.entries(binds).map(([groupKey, groupBind]) => (
    <Collapsible key={groupKey} defaultOpen className="flex flex-col">
      <CollapsibleTrigger className="cursor-pointer flex items-center justify-between px-3 py-2 ">
        <span className="text-sm gap-2 font-medium flex items-center text-foreground">
          <Settings2Icon className="size-4 me-1 text-muted-foreground" />
          {groupKey}
        </span>
        <ChevronsUpDown className="size-3 text-muted-foreground" />
      </CollapsibleTrigger>

      <CollapsibleContent
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {renderFlatBinds(groupBind, (updatedGroupBind) =>
          onBindsChange({ ...binds, [groupKey]: updatedGroupBind }),
        )}
      </CollapsibleContent>
    </Collapsible>
  ));

const renderBinds = (binds: Binds, onBindsChange: (binds: Binds) => void) =>
  isNestedBinds(binds)
    ? renderNestedBinds(binds, onBindsChange as (b: NestedBinds) => void)
    : renderFlatBinds(binds, onBindsChange as (b: FlatBinds) => void);

const Tweakpane = ({ onBindsChange, ...props }: TweakpaneProps) => {
  const [localBinds, setLocalBinds] = React.useState<Binds>(
    "binds" in props ? props.binds : props.initialBinds,
  );

  const handleBindsChange = React.useCallback(
    (binds: Binds) => {
      setLocalBinds(binds);
      onBindsChange?.(binds);
    },
    [onBindsChange],
  );

  React.useEffect(() => {
    if ("binds" in props) setLocalBinds(props.binds);
  }, [props]);

  return (
    <div className=" p-1.5 size-full">
      <div className="overflow-y-auto bg-background rounded-none border-y border-border/50 size-full flex flex-col divide-y divide-border/40">
        {renderBinds(localBinds, handleBindsChange)}
      </div>
    </div>
  );
};

export { Tweakpane, type TweakpaneProps, type Binds };
