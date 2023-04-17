import './styles.css';
import Login from './pages/Login/Login';
import GlobalPage from './pages/GlobalPage/GlobalPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<Login />}/>
      <Route path="/dashboard" element={<GlobalPage />}/>
      <Route path="/fwanew" element={<GlobalPage />}/>
      <Route path="/fwas" element={<GlobalPage />}/>
      <Route path="/schedularlist" element={<GlobalPage />}/>

      </Routes>
    </Router>
  );
}

export default App;
