import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/header/Navbar.js";
import Home from "./components/pages/Home";
import Blogs from "./components/pages/Blogs";
import Contact from "./components/pages/Contact";
import NoPage from "./components/pages/Nopage.js";
import Footer from "./components/footer/Footer.js";
import "../node_modules/react-bootstrap/dist/react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
export default function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Footer/>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);