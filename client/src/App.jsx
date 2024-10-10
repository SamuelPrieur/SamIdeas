import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TrendingPage from "@pages/TrendingPage";
import FollowingPage from "@pages/FollowingPage";
import YourWork from "@pages/YourWork";
import EditorPage from "@pages/EditorPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TrendingPage />} />
        <Route path="/FollowingPage" element={<FollowingPage />} />
        <Route path="/YourWork" element={<YourWork />} />
        <Route path="/EditorPage" element={<EditorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
