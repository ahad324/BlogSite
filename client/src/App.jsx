import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import Home from './pages/Home.jsx';
import Post from './pages/Post.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import UpdateProfile from './components/auth/UpdateProfile.jsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/update" element={<UpdateProfile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
