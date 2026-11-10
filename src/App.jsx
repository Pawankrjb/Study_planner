import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import About from './component/About';
import Feature from './component/Feature';
import Costomer from './component/Costomer';
import Assessment from './component/Assessment';

import CareerComparison from './features/career_comparison';
import CollegeRecommendation from './features/college_recommendation';
import StudyPlanner from './features/study_planner';
import WhatIfAnalysis from './features/what_if_analysis';
import CareerDetails from './features/career_details';
import Classroom from './features/classroom';
import Card from './component/Card';
import TakeTest from './corefeature/TakeTest';
import AptitudeTest from './corefeature/AptitudeTest';
import PersonalityTest from './corefeature/Personality';

import Smart_career from './features/Smart_career';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/feature" element={<Feature />} />
      <Route path="/costomer" element={<Costomer />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/career-recommendation" element={<Smart_career />} />
      <Route path="/take-test" element={<TakeTest/>} />
      <Route path="/career-comparison" element={<CareerComparison />} />
      <Route path="/college-recommendation" element={<CollegeRecommendation />}/>
      <Route path="/study-planner" element={<StudyPlanner />} />
      <Route path="/what-if-analysis" element={<WhatIfAnalysis />} />
      <Route path="/career-details" element={<CareerDetails />} />
      <Route path="/classroom" element={<Classroom />} />
      <Route path="/aptitude-test" element={<AptitudeTest />} />
      <Route path="/personality-test" element={<PersonalityTest />} />
      {/* // <Route path="/question" element={<Question />} ></Route> */}
    </Routes>
  );
}

export default App;
