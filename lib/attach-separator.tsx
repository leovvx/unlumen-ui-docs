import type { BuildPageTreeOptions } from "fumadocs-core/source";
import { REFINED_UI_SECTIONS } from "./refined-ui";

export const Separator = ({
  icon,
  name,
}: {
  icon: React.ReactNode;
  name: string;
}) => {
  return (
    <span className="flex items-center gap-2">
      {icon && (
        <span className="relative flex items-center justify-center text-muted-foreground [&_svg]:size-[16px]">
          {icon}
        </span>
      )}
      <span className="text-sm font-medium tracking-tight text-foreground/50">
        {name}
      </span>
    </span>
  );
};

export const attachSeparator: BuildPageTreeOptions["attachSeparator"] = (
  node,
) => {
  const section = REFINED_UI_SECTIONS.find((s) => s.name === node.name);

  if (section) {
    const IconComponent = section.Icon;
    node.name = (
      <Separator
        icon={<IconComponent {...section.iconProps} />}
        name={section.name}
      />
    );
  }

  return node;
};
