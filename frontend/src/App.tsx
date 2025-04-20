import { Routes, Route } from "react-router";
import Login from "./pages/login/login-page";
import Home from "./pages/home/home-page";
function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
