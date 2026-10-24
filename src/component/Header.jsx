

import { NavLink, Route, Routes } from 'react-router-dom';
import Feature from '../component/Feature'
import Home from '../pages/Home';
import About from './About';

function Header() {
  return (
    <>
    
   <nav>
     <NavLink to="/">Home</NavLink>
     <NavLink to="/about">About</NavLink>
     <NavLink to="/feature">Feature</NavLink>
     <NavLink ></NavLink>
     
   </nav>

   <Routes>
     <Route path='/' element={<Home></Home>}></Route>
     <Route path="/about" element={<About />} />
     <Route path='/feature' element={<Feature></Feature>}></Route>


   </Routes>
    </>
  )

}
export default Header;