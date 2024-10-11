import { useState } from "react";

const EditorPage = () => {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [visibleGroup, setVisibleGroup] = useState("");

  function run() {
    let output = document.getElementById("output");
    output.contentDocument.body.innerHTML = htmlCode + "<style>" + cssCode + "</style>";
    output.contentWindow.eval(jsCode);
  }

  const handleLabelClick = (group) => {
    setVisibleGroup(visibleGroup === group ? "" : group);
  };

  const handleHtmlBalise = (e) => {
    let value = e.target.innerText;

    if (e.key === ">" && value.endsWith(">")) {
      const openingTagMatch = value.match(/<(\w+)>$/);

      if (openingTagMatch) {
        const tagName = openingTagMatch[1];
        const closingTag = `</${tagName}>`;

        const cursorPosition = window.getSelection().anchorOffset;
        const newValue = value + closingTag;

        setHtmlCode(newValue);

        setTimeout(() => {
          const selection = window.getSelection();
          const range = document.createRange();
          range.setStart(e.target.firstChild, cursorPosition);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }, 0);
      }
    } else {
      setHtmlCode(value);
    }

    run();
  };

  return (
    <div className="EditorContainer">
      <div className="Editor">
        <iframe className="box" id="output"></iframe>
        <section className="container">
          <div
            className="input-group"
            style={{
              display: visibleGroup === "HTML" || visibleGroup === "" ? "flex" : "none",
            }}
          >
            <label htmlFor="HTML" onClick={() => handleLabelClick("HTML")}>
              <i className="fa-brands fa-html5"></i> HTML
            </label>
            <textarea className="box" name="HTML" id="HTML" onInput={(e) => setHtmlCode(e.target.innerText)} onKeyUp={handleHtmlBalise}></textarea>
          </div>

          <div
            className="input-group"
            style={{
              display: visibleGroup === "CSS" || visibleGroup === "" ? "flex" : "none",
            }}
          >
            <label htmlFor="CSS" onClick={() => handleLabelClick("CSS")}>
              <i className="fa-brands fa-css3-alt"></i> CSS
            </label>
            <textarea className="box" name="CSS" id="CSS" onInput={(e) => setCssCode(e.target.innerText)} onKeyUp={run}></textarea>
          </div>

          <div
            className="input-group"
            style={{
              display: visibleGroup === "JS" || visibleGroup === "" ? "flex" : "none",
            }}
          >
            <label htmlFor="JS" onClick={() => handleLabelClick("JS")}>
              <i className="fa-brands fa-js"></i> JS
            </label>
            <textarea className="box" name="JS" id="JS" onInput={(e) => setJsCode(e.target.innerText)} onKeyUp={run}></textarea>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditorPage;
