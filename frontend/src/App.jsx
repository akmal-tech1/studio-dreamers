import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Films from "./pages/Films";
import FilmDetail from "./pages/FilmDetail";
import Store from "./pages/Store";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-ink font-body text-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/films" element={<Films />} />
              <Route path="/films/:id" element={<FilmDetail />} />
              <Route path="/store" element={<Store />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <AuthModal />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
