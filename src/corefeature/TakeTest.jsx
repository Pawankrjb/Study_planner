import { useNavigate } from "react-router-dom";

function TakeTest() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1e1c1c] text-white p-8">
   <button
  onClick={() => {
   
      navigate("/");
    
  }}
  className="bg-black text-white px-5 py-2 rounded-lg mb-6"
>
 ← back
</button>
      <h1 className="text-3xl font-bold text-center mb-3 ">
        Take Assessment
      </h1>

      <p className="text-gray-400 text-center mb-10">
        Choose a test to discover and improve your skills.
      </p>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">

        {/* Aptitude Test */}
        <div className="bg-white text-black p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">
            Aptitude Test
          </h2>

          <p className="text-gray-600 mb-5">
            Evaluate your logical reasoning, numerical ability
            and analytical skills.
          </p>

          <p className="mb-2">10 Questions</p>
          <p className="mb-6">15 Minutes</p>

          <button
            onClick={() => navigate("/aptitude-test")}
            className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg w-full"
          >
            Start Test →
          </button>
        </div>

        {/* Personality Test */}
        <div className="bg-white text-black p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">
            Personality Test
          </h2>

          <p className="text-gray-600 mb-5">
            Discover your creativity, leadership, teamwork
            and problem-solving traits.
          </p>

          <p className="mb-2">10 Questions</p>
          <p className="mb-6">10 Minutes</p>

          <button
            onClick={() => navigate("/personality-test")}
            className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg w-full"
          >
            Start Test →
          </button>
        </div>

      </div>
    </div>
  );
}

export default TakeTest;