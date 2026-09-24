import LoginPage from "./pages/loginPage";
import DashboardPage from "./pages/DashboardPage"
import SignupPage from './pages/SignupPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HistoryPage from './pages/HistoryPage';

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage/>}></Route>
      <Route path="/dashboard" element={<DashboardPage/>}></Route>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;