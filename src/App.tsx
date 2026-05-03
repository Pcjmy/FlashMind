import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import DeckDetails from "@/pages/DeckDetails";
import StudyMode from "@/pages/StudyMode";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="deck/:id" element={<DeckDetails />} />
          <Route path="study/:id" element={<StudyMode />} />
        </Route>
        <Route path="*" element={<div className="text-center py-20 text-xl font-medium text-gray-500">页面未找到</div>} />
      </Routes>
    </Router>
  );
}
