// components/CodeHighlight.tsx
import hljs from "highlight.js";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/base16/chalk.css";
import { useEffect } from "react";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);
interface CodeHighlightProps {
  code: string;
  language: string;
}

const CodeHighlight: React.FC<CodeHighlightProps> = ({ code, language }) => {
  useEffect(() => {
    var highlightedBlocks = document.querySelectorAll("code");
    highlightedBlocks.forEach(function (block) {
      block.removeAttribute("data-highlighted");
    });
    hljs.highlightAll();
  }, [language, code]);

  return (
    <pre>
      <code id={language} className={language}>
        {code}
      </code>
    </pre>
  );
};

export default CodeHighlight;
