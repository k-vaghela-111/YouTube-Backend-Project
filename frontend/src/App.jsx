import Register from "./pages/Register"
import Login from "./pages/Login"
import { Toaster } from "react-hot-toast"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App