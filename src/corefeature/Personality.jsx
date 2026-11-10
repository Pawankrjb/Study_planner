import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    question: "When you face a difficult problem, what do you usually do?",
    options: [
      { text: "Analyze the problem step by step", trait: "Analytical Thinking" },
      { text: "Try a creative solution", trait: "Creativity" },
      { text: "Discuss it with others", trait: "Teamwork" },
      { text: "Take responsibility and decide quickly", trait: "Leadership" }
    ]
  },
  {
    question: "What role do you prefer in a group project?",
    options: [
      { text: "Team leader", trait: "Leadership" },
      { text: "Idea generator", trait: "Creativity" },
      { text: "Research and analysis", trait: "Analytical Thinking" },
      { text: "Team coordinator", trait: "Teamwork" }
    ]
  },
  {
    question: "If your team disagrees with your idea, what will you do?",
    options: [
      { text: "Listen to everyone's opinion", trait: "Teamwork" },
      { text: "Explain my idea confidently", trait: "Leadership" },
      { text: "Find a better alternative", trait: "Creativity" },
      { text: "Compare all ideas logically", trait: "Analytical Thinking" }
    ]
  },
  {
    question: "Which activity interests you the most?",
    options: [
      { text: "Solving puzzles and challenges", trait: "Analytical Thinking" },
      { text: "Designing something new", trait: "Creativity" },
      { text: "Managing a team", trait: "Leadership" },
      { text: "Working with people", trait: "Teamwork" }
    ]
  },
  {
    question: "How do you handle failure?",
    options: [
      { text: "Analyze my mistakes", trait: "Analytical Thinking" },
      { text: "Try a different approach", trait: "Creativity" },
      { text: "Take responsibility", trait: "Leadership" },
      { text: "Ask others for feedback", trait: "Teamwork" }
    ]
  },
  {
    question: "When starting a new project, what is your first step?",
    options: [
      { text: "Create a detailed plan", trait: "Analytical Thinking" },
      { text: "Think of innovative ideas", trait: "Creativity" },
      { text: "Assign responsibilities", trait: "Leadership" },
      { text: "Discuss with team members", trait: "Teamwork" }
    ]
  },
  {
    question: "What motivates you the most?",
    options: [
      { text: "Solving complex problems", trait: "Analytical Thinking" },
      { text: "Creating something unique", trait: "Creativity" },
      { text: "Achieving team goals", trait: "Teamwork" },
      { text: "Taking on challenges", trait: "Leadership" }
    ]
  },
  {
    question: "If you have limited time to complete a task, what will you do?",
    options: [
      { text: "Prioritize tasks logically", trait: "Analytical Thinking" },
      { text: "Find a faster creative solution", trait: "Creativity" },
      { text: "Delegate work to others", trait: "Leadership" },
      { text: "Coordinate with the team", trait: "Teamwork" }
    ]
  },
  {
    question: "Which environment do you prefer?",
    options: [
      { text: "Independent problem-solving", trait: "Analytical Thinking" },
      { text: "Creative and flexible environment", trait: "Creativity" },
      { text: "Competitive leadership environment", trait: "Leadership" },
      { text: "Collaborative team environment", trait: "Teamwork" }
    ]
  },
  {
    question: "What would you do if a team member was struggling?",
    options: [
      { text: "Help them understand the problem", trait: "Analytical Thinking" },
      { text: "Suggest a different approach", trait: "Creativity" },
      { text: "Guide and motivate them", trait: "Leadership" },
      { text: "Work together to finish the task", trait: "Teamwork" }
    ]
  }
];

function PersonalityTest() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(10 * 60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;

    if (time === 0) {
      setSubmitted(true);
      return;
    }

    const timer = setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time, submitted]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const traits = {
    "Creativity": 0,
    "Leadership": 0,
    "Teamwork": 0,
    "Analytical Thinking": 0
  };

  Object.values(answers).forEach(trait => {
    traits[trait]++;
  });

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (submitted) {
    const maxScore = Math.max(...Object.values(traits));

    return (
      <div className="min-h-screen bg-[#1e1c1c] text-white flex items-center justify-center p-8">

        <div className="bg-white text-black p-10 rounded-2xl max-w-xl w-full">

          <h1 className="text-3xl font-bold text-center mb-6">
            Personality Test Result
          </h1>

          <div className="space-y-5">

            {Object.entries(traits).map(([trait, score]) => (
              <div key={trait}>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{trait}</span>
                  <span>{score}/10</span>
                </div>

                <div className="bg-gray-200 h-3 rounded-full">
                  <div
                    className="bg-black h-3 rounded-full"
                    style={{ width: `${score * 10}%` }}
                  />
                </div>
              </div>
            ))}

          </div>

          <p className="text-center mt-6 font-semibold">
            Your strongest trait: {
              Object.keys(traits).filter(
                trait => traits[trait] === maxScore
              ).join(", ")
            }
          </p>

         <button
  onClick={() => {
    if (window.confirm("Are you sure you want to exit the test?")) {
      navigate("/take-test");
    }
  }}
  className="bg-black text-white px-5 py-2 rounded-lg mb-6"
>
  ✕ Exit Test
</button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1c1c] text-white p-8">

      <button
        onClick={() => navigate(-1)}
        className="bg-black text-white px-5 py-2 rounded-lg mb-6"
      >
        ← Back
      </button>

      <div className="max-w-3xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-2xl font-bold">
            Personality Test
          </h1>

          <div className="bg-white text-black px-5 py-2 rounded-lg font-bold">
            {minutes}:{String(seconds).padStart(2, "0")}
          </div>

        </div>

        <div className="bg-white text-black p-8 rounded-2xl">

          <div className="flex justify-between mb-6">
            <p>Question {current + 1} of 10</p>
            <p>{Object.keys(answers).length}/10 Answered</p>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div
              className="bg-black h-2 rounded-full"
              style={{ width: `${((current + 1) / 10) * 100}%` }}
            />
          </div>

          <h2 className="text-xl font-semibold mb-8">
            {questions[current].question}
          </h2>

          <div className="space-y-4">

            {questions[current].options.map((option, index) => (

              <button
                key={index}
                onClick={() =>
                  setAnswers({
                    ...answers,
                    [current]: option.trait
                  })
                }
                className={`w-full text-left border p-4 rounded-lg ${
                  answers[current] === option.trait
                    ? "bg-black text-white"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {option.text}
              </button>

            ))}

          </div>

          <div className="flex justify-between mt-10">

            <button
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
              className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-30"
            >
              Previous
            </button>

            {current === 9 ? (

              <button
                onClick={handleSubmit}
                className="bg-black text-white px-6 py-3 rounded-lg"
              >
                Submit Test
              </button>

            ) : (

              <button
                onClick={() => setCurrent(current + 1)}
                className="bg-black text-white px-6 py-3 rounded-lg"
              >
                Next →
              </button>

            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default PersonalityTest;