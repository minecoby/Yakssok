import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";
import Login from "./pages/Login";
import Invited from "./pages/Invited";
import Create from "./pages/Create";
import Result from "./pages/Result"
import AppLayout from "./AppLayout";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login/:code" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/callback/:code" element={<AuthCallback />} />
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/invited" element={<Invited />} />
          <Route path="/invite/:code" element={<Invited />} />
          <Route path="/create" element={<Create />} />
          <Route path="/result/:inviteCode" element={<Result />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
