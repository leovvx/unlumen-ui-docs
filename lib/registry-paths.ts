export function replaceRegistryPaths(inputStr: string): string {
  return inputStr.replace(/(['"])([\s\S]*?)\1/g, (match, quote, content) => {
    if (content.startsWith("@/registry/")) {
      const rest = content.slice("@/registry/".length);
      if (rest.startsWith("lib/")) {
        return `${quote}@/${rest}${quote}`;
      }
      if (rest.startsWith("hooks/")) {
        return `${quote}@/${rest}${quote}`;
      }
      if (rest.startsWith("primitives/")) {
        return `${quote}@/components/unlumen-ui/${rest}${quote}`;
      }
      if (rest.startsWith("components/")) {
        const segments = rest.split("/");
        const name = segments[segments.length - 1];
        return `${quote}@/components/unlumen-ui/${name}${quote}`;
      }
      return `${quote}@/components/unlumen-ui/${rest}${quote}`;
    }

    if (content.startsWith("@workspace/ui/")) {
      const rest = content.slice("@workspace/ui/".length);
      return `${quote}@/${rest}${quote}`;
    }

    return match;
  });
}

export default replaceRegistryPaths;
