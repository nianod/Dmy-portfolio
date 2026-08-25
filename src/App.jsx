import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from "./pages/home";
import Skills from "./pages/skills";
import Education from "./pages/education";
import Blogs from "./pages/blogs";
import Projects from "./pages/projects";
import Contact from "./pages/contact";
import Layout from "./Components/layout";
import ParticleBackground from "./ParticleBackground";
import Logger from "./tokio/Loger";
import LoggerLogin from "./tokio/LoggerLogin";
import ProtectedRoute from "./tokio/ProtectedRoute";

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <Router>
      <div className="relative min-h-screen bg-[linear-gradient(to_top,rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url('/bg.jpeg')] bg-cover bg-center">
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="skills" element={<Skills />} />
              <Route path="education" element={<Education />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="projects" element={<Projects />} />
              <Route path="contact" element={<Contact />} />
            </Route>
            <Route path="login" element={<LoggerLogin />} />

            <Route
              path="loger"
              element={
                <ProtectedRoute>
                  <Logger />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
