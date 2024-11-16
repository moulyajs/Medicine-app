
import './App.css';
import "react-toastify/dist/ReactToastify.css";
import Search from "./components/search.jsx";
import Cart from './components/Cart.jsx';
import { BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from './components/NavBar.jsx';
import {ToastContainer} from "react-toastify";
import Specialists from './components/Specialists.jsx';
import SpecialistDoctors from './components/SpecialistDoctors.jsx';
import CheckOut from './components/CheckOut.jsx';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <ToastContainer/>
        <NavBar />
        <Routes>
          <Route path="/cart" element={<Cart />} />
          <Route path="/" element={<Search />} />  {/* This will match exactly */}
          <Route path="/specialists" element={<Specialists/>}/>
          <Route path="/specialist/:specialistId" element={<SpecialistDoctors />} />
          <Route path="/checkout" element={<CheckOut/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;