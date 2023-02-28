import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import groovy from "react-syntax-highlighter/dist/esm/languages/hljs/groovy";
import a11yLight from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-light";
SyntaxHighlighter.registerLanguage("javascript", groovy);

type CodeRenderProps = {
  children: string | string[];
};

export default function CodeRender(props: CodeRenderProps) {
  return (
    <SyntaxHighlighter language="groovy" style={a11yLight}>
      {props.children}
    </SyntaxHighlighter>
  );
}
