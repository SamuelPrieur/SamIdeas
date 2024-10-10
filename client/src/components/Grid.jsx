const Grid = ({ posts }) => {
  return (
    <section className="grid-container">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="grid-item">
            <img className="postImage" src={post.image || "/img/placeholder.png"} alt={post.name} />
            <h3>{post.name}</h3>
            <div className="postUser">
              <div className="userInfo">
                <img src={post.userPP || "/img/PPplaceholder.jpg"} alt={post.name} />
                <p>{post.username || "RealUserOfficialAccount"}</p>
              </div>
              <button>Follow</button>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun post à afficher</p>
      )}
    </section>
  );
};

export default Grid;
