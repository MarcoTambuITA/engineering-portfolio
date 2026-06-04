import { visit } from "unist-util-visit";

export function rehypeExtractRawCode() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    visit(tree, (node) => {
      if (node?.type === "element" && node?.tagName === "pre") {
        const [codeEl] = node.children;
        if (codeEl.tagName !== "code") return;
        
        let rawCode = "";
        visit(codeEl, (child) => {
          if (child.type === "text") {
            rawCode += child.value;
          }
        });
        
        node.properties = node.properties || {};
        node.properties["raw"] = rawCode;
      }
    });
  };
}
