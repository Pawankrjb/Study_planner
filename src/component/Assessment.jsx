import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Marks from './Marks'
import Question from './Question';
function Assessment() {
   const[ show,setShow]=useState(true);
     

  return (
    <>
      <main className="min-h-screen bg-[#1e1c1c]  p-10 text-black flex justify-center item-center  ">
        <div className="h-[550px] w-[900px] bg-white p-5 rounded-2xl">
          <h1>Assessment</h1>
          <h2 className="text-3xl font-bold mt-3">
            Career Path Assessment (20 Questions)
          </h2>
           {show ? (
  <Marks onStart={() => setShow(false)} />
) : (
  <Question />
)}

          
        </div>
      </main>
    </>
  );
}

export default Assessment;
