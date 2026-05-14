import {
  CopyButton,
  type CopyButtonProps,
} from "@/registry/primitives/buttons/copy";

interface CopyButtonDemoProps {
  variant: CopyButtonProps["variant"];
  size: CopyButtonProps["size"];
}

export default function CopyButtonDemo({ variant, size }: CopyButtonDemoProps) {
  return <CopyButton variant={variant} size={size} content="Hello world!" />;
}
