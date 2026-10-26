import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import About from './component/About';
import Feature from './component/Feature';
import Costomer from './component/Costomer';
import Assessment from './component/Assessment';
import Question from './component/Question';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/feature" element={<Feature />} />
      <Route path="/costomer" element={<Costomer />} />
      <Route  path="/assessment" element={<Assessment />}></Route>
      {/* <Route path="/question" element={<Question />} ></Route> */}
    </Routes>
  )
}

export default App;