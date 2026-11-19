import {Routes, Route} from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import {Dealers, Dealer, AddReview} from "./Portal";
export default function App() {
  return <Routes>
    <Route path="/" element={<Dealers/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/dealer/:id" element={<Dealer/>}/>
    <Route path="/review/:id" element={<AddReview/>}/>
  </Routes>;
}
