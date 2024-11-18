import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const EditorPage = () => {
  const { postId } = useParams(); // Récupérer l'ID depuis l'URL

  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [visibleGroup, setVisibleGroup] = useState("");
  const [name, setName] = useState("");
  const [head, setHead] = useState("");
  const [image, setImage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserId(user._id);
      } catch (error) {
        console.error("Erreur lors de la conversion de l'utilisateur depuis le localStorage :", error);
      }
    } else {
      console.error("Aucun utilisateur trouvé dans le localStorage.");
    }
  }, []);

  // Récupérer les données du post si un `postId` est fourni
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${postId}`);
        const post = response.data;

        setHtmlCode(post.HTML || "");
        setCssCode(post.CSS || "");
        setJsCode(post.JS || "");
        setName(post.name || "");
        setHead(post.head || "");
        setImage(post.image || "");

        // Recompiler le code après avoir défini les données
        setTimeout(run, 0); // Utilisation de setTimeout pour s'assurer que le DOM est prêt
      } catch (error) {
        console.error("Erreur lors de la récupération du post :", error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

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

  const handleSave = async () => {
    if (!currentUserId) {
      alert("Utilisateur non connecté. Veuillez vous reconnecter.");
      return;
    }

    try {
      const postData = {
        name,
        head,
        image,
        HTML: htmlCode,
        CSS: cssCode,
        JS: jsCode,
        creator: currentUserId,
      };

      if (postId) {
        await axios.put(`http://localhost:8080/api/updatePost/${postId}`, postData);
        alert("Post mis à jour avec succès !");
      } else {
        const response = await axios.post("http://localhost:8080/api/createPost", postData);
        alert("Post créé avec succès !");
        // Rediriger vers le nouveau post créé
        window.location.href = `/EditorPage/${response.data._id}`;
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du post :", error);
      alert("Erreur lors de la sauvegarde du post");
    }
  };

  const toggleInfoModal = () => {
    setIsInfoModalOpen(!isInfoModalOpen);
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

  useEffect(() => {
    if (htmlCode && cssCode && jsCode) {
      setTimeout(run, 100); // Utilisation de setTimeout pour s'assurer que le DOM est prêt
    }
  }, [htmlCode, cssCode, jsCode]);

  return (
    <div className="EditorContainer">
      <nav className="ActionBar">
        <img src="/img/PPplaceholder.jpg" alt="" />
        <div>
          <button onClick={toggleInfoModal}>
            <img src="/icons/Info.svg" alt="" />
          </button>
          <button>
            <img src="/icons/Settings.svg" alt="" />
          </button>
          <button onClick={handleSave}>{postId ? "Mettre à jour" : "Créer"}</button>
        </div>
      </nav>

      {/* Modal Info */}
      {isInfoModalOpen && (
        <div className={`modal-overlay ${isInfoModalOpen ? "open" : ""}`}>
          <div className="modal-content">
            <h2>Information</h2>
            {/* Informations modales */}
            <button className="closeButton" onClick={toggleInfoModal}>
              Close
            </button>
          </div>
        </div>
      )}

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
