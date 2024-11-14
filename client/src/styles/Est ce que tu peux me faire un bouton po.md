Est ce que tu peux me faire un bouton pour créer un post ou l'update si il existe déjà?
Voici quelque fichier pour t'aider : 
    - Post.js : est la structure de ma table posts
    - posts.js : est l'ensemble des requettes en rapport avec les posts

Et le code de EditorPage : 

import { useState } from "react";

const EditorPage = () => {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [visibleGroup, setVisibleGroup] = useState("");

  function run() {
    const output = document.getElementById("output");

    // Inject HTML and CSS content
    const documentContent = `
      ${htmlCode}
      <style>${cssCode}</style>
    `;
    output.contentDocument.body.innerHTML = documentContent;

    // Execute JavaScript using eval on contentWindow
    try {
      output.contentWindow.eval(jsCode);
    } catch (error) {
      console.error("Error in JavaScript code:", error);
    }
  }

  const handleLabelClick = (group) => {
    setVisibleGroup(visibleGroup === group ? "" : group);
  };

  const handleHtmlBalise = (e) => {
    const value = e.target.value;

    if (e.key === ">" && value.endsWith(">")) {
      const openingTagMatch = value.match(/<(\w+)>$/);

      if (openingTagMatch) {
        const tagName = openingTagMatch[1];
        const closingTag = `</${tagName}>`;

        const cursorPosition = e.target.selectionStart;
        const newValue = value + closingTag;

        setHtmlCode(newValue);

        setTimeout(() => {
          e.target.setSelectionRange(cursorPosition, cursorPosition);
        }, 0);
      }
    } else {
      setHtmlCode(value);
    }

    run();
  };

  return (
    <div className="EditorContainer">
      <nav className="ActionBar">
        <img src="/img/PPplaceholder.jpg" alt="" />
        <div>
          <button>
            <img src="/icons/Info.svg" alt="" />
          </button>
          <button>
            <img src="/icons/Settings.svg" alt="" />
          </button>
          <button>Enregistrer</button> {/* Bouton à modifier */}
        </div>
      </nav>
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
            <textarea
              className="box"
              name="HTML"
              id="HTML"
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              onKeyUp={handleHtmlBalise}
            ></textarea>
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
            <textarea className="box" name="CSS" id="CSS" value={cssCode} onChange={(e) => setCssCode(e.target.value)} onKeyUp={run}></textarea>
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
            <textarea className="box" name="JS" id="JS" value={jsCode} onChange={(e) => setJsCode(e.target.value)} onKeyUp={run}></textarea>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditorPage;
