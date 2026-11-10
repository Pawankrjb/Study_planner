import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    question: "Find the missing number: 3, 8, 18, 38, 78, ?",
    options: ["148", "158", "168", "178"],
    answer: "158"
  },
  {
    question: "A person walks 10 km north, 5 km east, 10 km south and 5 km east. How far is he from the starting point?",
    options: ["5 km", "10 km", "15 km", "20 km"],
    answer: "10 km"
  },
  {
    question: "A product is marked 40% above cost price and sold at a discount of 15%. Find the profit percentage.",
    options: ["15%", "17%", "19%", "21%"],
    answer: "19%"
  },
  {
    question: "A can complete a work in 12 days and B in 18 days. How many days will they take together?",
    options: ["6.2 days", "7.2 days", "8.2 days", "9.2 days"],
    answer: "7.2 days"
  },
  {
    question: "The average of 8 numbers is 24. If 32 is replaced by 48, what is the new average?",
    options: ["25", "26", "27", "28"],
    answer: "26"
  },
  {
    question: "If 35 students like Mathematics, 30 like Science and 15 like both, how many like neither subject in a class of 60?",
    options: ["5", "10", "15", "20"],
    answer: "10"
  },
  {
    question: "Choose the grammatically correct sentence.",
    options: [
      "Neither of the students have completed the assignment.",
      "Neither of the students has completed the assignment.",
      "Neither students has completed the assignment.",
      "Neither student have completed the assignment."
    ],
    answer: "Neither of the students has completed the assignment."
  },
  {
    question: "Choose the closest meaning of 'Meticulous'.",
    options: ["Careless", "Detailed and precise", "Confused", "Impatient"],
    answer: "Detailed and precise"
  },
  {
    question: "If all developers are logical thinkers and some logical thinkers are designers, which conclusion is definitely true?",
    options: [
      "All designers are developers",
      "Some developers are designers",
      "All developers are logical thinkers",
      "No designer is a developer"
    ],
    answer: "All developers are logical thinkers"
  },
  {
    question: "Five people P, Q, R, S and T stand in a row. S is before P, P is before Q, Q is before R and R is before T. Who stands in the middle?",
    options: ["P", "Q", "R", "S"],
    answer: "Q"
  }
];

function AptitudeTest() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(15 * 60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;

    if (time === 0) {
      handleSubmit();
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

  const score = questions.filter(
    (q, index) => answers[index] === q.answer
  ).length;

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#1e1c1c] text-white flex items-center justify-center">
        <div className="bg-white text-black p-10 rounded-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">Test Completed!</h1>
          <p className="text-xl mb-2">
            Your Score: {score}/10
          </p>
          <p className="mb-6">
            Percentage: {score * 10}%
          </p>

          <button
            onClick={() => navigate("/take-test")}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1c1c] text-white p-8">
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
      <div className="max-w-3xl mx-auto">
        

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Aptitude Test</h1>

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
                  setAnswers({ ...answers, [current]: option })
                }
                className={`w-full text-left border p-4 rounded-lg ${
                  answers[current] === option
                    ? "bg-black text-white"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {option}
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

export default AptitudeTest;