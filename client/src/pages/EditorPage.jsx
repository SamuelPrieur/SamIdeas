import { useState } from "react";
import axios from "axios";

const EditorPage = ({ postId, existingData }) => {
  const [htmlCode, setHtmlCode] = useState(existingData?.HTML || "");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [visibleGroup, setVisibleGroup] = useState("");
  const [name, setName] = useState(existingData?.name || "");
  const [head, setHead] = useState(existingData?.head || "");
  const [image, setImage] = useState(existingData?.image || "");

  function run() {
    const output = document.getElementById("output");
    const documentContent = `
      ${htmlCode}
      <style>${cssCode}</style>
    `;
    output.contentDocument.body.innerHTML = documentContent;

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

  const handleSave = async () => {
    try {
      const postData = { name, head, image, HTML: htmlCode, creator: "creatorId" }; 
      // Remplacez "creatorId" par l'identifiant du créateur

      if (postId) {
        // Mise à jour si un postId est fourni
        await axios.put(`/api/posts/${postId}`, postData);
        alert("Post mis à jour avec succès !");
      } else {
        // Création d'un nouveau post
        await axios.post("/api/posts", postData);
        alert("Post créé avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du post:", error);
      alert("Erreur lors de la sauvegarde du post");
    }
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
          <button onClick={handleSave}>{postId ? "Mettre à jour" : "Créer"}</button>
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
