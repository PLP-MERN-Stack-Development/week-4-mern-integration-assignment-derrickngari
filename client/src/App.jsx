import { useState } from 'react'
import Navbar from './componets/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';
import BlogPage from './pages/BlogPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AddBlog from './pages/AddBlog';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="min-h-screen bg-linear-to-r from-slate-900 to-slate-950 flex flex-col items-center text-gray-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blogs" element={<AddBlog />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
