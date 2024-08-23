import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroDetails from "./hero/details/page";
import HeroesList from "./hero/list/page";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroesList />} />
        <Route path="/hero/:id/details" element={<HeroDetails />} />
      </Routes>
    </Router>
  );
}
