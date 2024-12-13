import React, { useState, useEffect, useRef } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Prism from "prismjs";
import "prismjs/themes/prism.css";

const CodeInput = ({ lang, code, setCode, readOnly, placeholder, onKeyUp }) => {
  const refEditing = useRef(null);
  const refPre = useRef(null);

  const handleInput = () => {
    const editing = refEditing.current;
    setCode(editing.value);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  useEffect(() => {
    // Synchroniser le défilement
    const synchronizeScroll = () => {
      if (refEditing.current && refPre.current) {
        const toTop = refEditing.current.scrollTop;
        const toLeft = refEditing.current.scrollLeft;

        refPre.current.scrollTop = toTop;
        refPre.current.scrollLeft = toLeft;
      }
    };

    const textarea = refEditing.current;
    if (textarea) {
      textarea.addEventListener("scroll", synchronizeScroll);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("scroll", synchronizeScroll);
      }
    };
  }, []);

  return (
    <div className="code-input">
      <pre className="highlighting" aria-hidden="true" ref={refPre}>
        <code className={`language-${lang}`}>{code}</code>
      </pre>
      <textarea
        className="editing"
        ref={refEditing}
        onInput={handleInput}
        onKeyUp={onKeyUp}
        value={code}
        spellCheck="false"
        placeholder={placeholder}
      ></textarea>
    </div>
  );
};

const EditorPage = () => {
  const { postId } = useParams();

  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [visibleGroup, setVisibleGroup] = useState("");
  const [name, setName] = useState("");
  const [head, setHead] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("head", head);
      if (imageFile) formData.append("image", imageFile);

      const response = await axios.put(`http://localhost:8080/api/updatePost/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Paramètres mis à jour avec succès !");
      setIsSettingsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres :", error);
      alert("Une erreur est survenue.");
    }
  };

  const run = () => {
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        ${head}
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>${jsCode}</script>
      </body>
      </html>
    `;

    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const output = document.getElementById("output");
    output.src = url;
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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("head", head);
      formData.append("HTML", htmlCode);
      formData.append("CSS", cssCode);
      formData.append("JS", jsCode);
      formData.append("creator", currentUserId);
      if (imageFile) formData.append("image", imageFile);

      if (postId) {
        const response = await axios.get(`http://localhost:8080/api/posts/${postId}`);
        const originalPost = response.data;

        if (originalPost.creator === currentUserId) {
          await axios.put(`http://localhost:8080/api/updatePost/${postId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          alert("Post mis à jour avec succès !");
        } else {
          const newResponse = await axios.post("http://localhost:8080/api/createPost", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          alert("Vous n'êtes pas le créateur de ce post. Une copie a été créée avec succès !");
          window.location.href = `/EditorPage/${newResponse.data._id}`;
        }
      } else {
        const response = await axios.post("http://localhost:8080/api/createPost", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Post créé avec succès !");
        window.location.href = `/EditorPage/${response.data._id}`;
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du post :", error);
      alert("Erreur lors de la sauvegarde du post");
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const toggleInfoModal = () => {
    setIsInfoModalOpen(!isInfoModalOpen);
  };

  const handleHtmlBalise = (e) => {
    const textarea = e.target;
    const value = textarea.value;
    const cursorPosition = textarea.selectionStart;

    if (e.key === ">" && value.endsWith(">")) {
      const openingTagMatch = value.slice(0, cursorPosition).match(/<(\w+)>$/);
      if (openingTagMatch) {
        const tagName = openingTagMatch[1];
        const closingTag = `</${tagName}>`;

        const newValue = value.slice(0, cursorPosition) + closingTag + value.slice(cursorPosition);

        setHtmlCode(newValue);

        setTimeout(() => {
          textarea.setSelectionRange(cursorPosition, cursorPosition);
        }, 0);
      }
    }
  };

  useEffect(() => {
    if (htmlCode || cssCode || jsCode) {
      setTimeout(run, 100);
    }
  }, [htmlCode, cssCode, jsCode]);

  const handleDownloadZip = () => {
    const zip = new JSZip();

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${name || "Mon Projet"}</title>
        ${head}
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        ${htmlCode}
        <script src="script.js"></script>
      </body>
      </html>
    `;

    zip.file("index.html", fullHtml.trim());
    zip.file("style.css", cssCode);
    zip.file("script.js", jsCode);

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${name || "project"}.zip`);
    });
  };

  return (
    <div className="EditorContainer">
      <nav className="ActionBar">
        <NavLink to={`/`} className="logo">
          <img src="/img/logo.svg" alt="" />
        </NavLink>
        <div>
          <button onClick={() => setIsInfoModalOpen(!isInfoModalOpen)}>
            <img src="/icons/Info.svg" alt="" />
          </button>
          <button onClick={() => setIsSettingsModalOpen(true)}>
            <img src="/icons/Settings.svg" alt="" />
          </button>
          <button onClick={handleDownloadZip}>
            <img src="/icons/Download.svg" alt="" />
          </button>
          <button onClick={handleSave}>{postId ? (isCreator ? "Mettre à jour" : "Créer une copie") : "Créer"}</button>
        </div>
      </nav>

      {/* Modal Info */}
      {isInfoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Information</h2>
            <h3>1. Agrandir une section</h3>
            <p className="Information">
              Vous pouvez cliquer sur <i className="fa-brands fa-html5"></i> HTML, <i className="fa-brands fa-css3-alt"></i> CSS, et{" "}
              <i className="fa-brands fa-js"></i> JS pour l'agrandir.
            </p>
            <h3>2. Changer la taille de l'output</h3>
            <p className="Information">Vous pouvez redimensionner la taille de l'output avec l'icône en bas à droite de celui-ci.</p>
            <h3>3. Modifier le head</h3>
            <p className="Information">Vous pouvez modifier la balise head de votre projet en vous rendant sur le bouton avec l'icône paramètre.</p>
            <button className="closeButton" onClick={toggleInfoModal}>
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
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <div>
                  <label>Nom :</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label>Image :</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
              </div>
              <div className="head">
                <label>Head :</label>
                <textarea value={head} onChange={(e) => setHead(e.target.value)} rows="4"></textarea>
              </div>
              <div>
                <button type="button" onClick={handleSaveSettings}>
                  Enregistrer
                </button>
                <button type="button" onClick={() => setIsSettingsModalOpen(false)}>
                  Annuler
                </button>
              </div>
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
            <CodeInput
              className="box"
              lang="html"
              code={htmlCode}
              setCode={setHtmlCode}
              placeholder="Écrivez votre code HTML ici..."
              onKeyUp={handleHtmlBalise}
            />
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
            <CodeInput className="box" lang="css" code={cssCode} setCode={setCssCode} placeholder="Écrivez votre code CSS ici..." onKeyUp={run} />
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
            <CodeInput
              className="box"
              lang="javascript"
              code={jsCode}
              setCode={setJsCode}
              placeholder="Écrivez votre code JavaScript ici..."
              onKeyUp={run}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditorPage;
