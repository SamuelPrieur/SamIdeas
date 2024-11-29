import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // Modal des paramètres
  const [isCreator, setIsCreator] = useState(false);

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

        setIsCreator(post.creator === currentUserId);
        setTimeout(run, 0);
      } catch (error) {
        console.error("Erreur lors de la récupération du post :", error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, currentUserId]);

  const handleSaveSettings = async () => {
    try {
      const updatedData = { name, head, image };
      await axios.put(`http://localhost:8080/api/updatePost/${postId}`, updatedData);
      alert("Paramètres mis à jour avec succès !");
      setIsSettingsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres :", error);
      alert("Une erreur est survenue.");
    }
  };

  const run = () => {
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
  };

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
        creator: currentUserId, // L'utilisateur connecté est toujours le créateur dans ce cas
      };

      if (postId) {
        // Récupérer le post pour vérifier le créateur
        const response = await axios.get(`http://localhost:8080/api/posts/${postId}`);
        const originalPost = response.data;

        if (originalPost.creator === currentUserId) {
          // L'utilisateur est le créateur : mettre à jour le post
          await axios.put(`http://localhost:8080/api/updatePost/${postId}`, postData);
          alert("Post mis à jour avec succès !");
        } else {
          // L'utilisateur n'est pas le créateur : créer un nouveau post
          const newResponse = await axios.post("http://localhost:8080/api/createPost", postData);
          alert("Vous n'êtes pas le créateur de ce post. Une copie a été créée avec succès !");
          // Rediriger vers le nouveau post créé
          window.location.href = `/EditorPage/${newResponse.data._id}`;
        }
      } else {
        // Pas de `postId`, création d'un nouveau post
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
    if (htmlCode || cssCode || jsCode) {
      setTimeout(run, 100); // Utilisation de setTimeout pour s'assurer que le DOM est prêt
    }
  }, [htmlCode, cssCode, jsCode]);

  return (
    <div className="EditorContainer">
      <nav className="ActionBar">
        <NavLink
          to={`/`}
          className="logo"
          style={{
            backgroundImage: `url("/img/PPplaceholder.jpg")`,
          }}
        ></NavLink>
        <div>
          <button onClick={() => setIsInfoModalOpen(!isInfoModalOpen)}>
            <img src="/icons/Info.svg" alt="" />
          </button>
          <button onClick={() => setIsSettingsModalOpen(true)}>
            <img src="/icons/Settings.svg" alt="" />
          </button>
          <button onClick={handleSave}>{postId ? (isCreator ? "Mettre à jour" : "Créer une copie") : "Créer"}</button>
        </div>
      </nav>

      {/* Modal Info */}
      {isInfoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Information</h2>
            <p>Voici les instructions...</p>
            <button className="closeButton" onClick={() => setIsInfoModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal Settings */}
      {isSettingsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Modifier les paramètres du post</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSettings();
              }}
            >
              <label>
                Nom :
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                Image (URL) :
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
              </label>
              <label>
                Head :<textarea value={head} onChange={(e) => setHead(e.target.value)} rows="4"></textarea>
              </label>
              <button type="submit">Enregistrer</button>
              <button type="button" onClick={() => setIsSettingsModalOpen(false)}>
                Annuler
              </button>
            </form>
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
