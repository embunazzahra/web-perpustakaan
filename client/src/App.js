import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import MainPage from "./pages/mainpage";
import PeminjamanPage from "./pages/peminjaman";
import Penerbit from "./pages/penerbit";
import Pengarang from "./pages/pengarang";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Peminjaman" element={<PeminjamanPage />} />
        <Route path="/Penerbit" element={<Penerbit />} />
        <Route path="/Pengarang" element={<Pengarang />} />
      </Routes>
    </Router>
  );
}

export default App;
