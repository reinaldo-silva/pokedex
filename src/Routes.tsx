import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export { Router };
