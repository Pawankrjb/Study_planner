import React, { useEffect } from 'react';
import { useState } from 'react';
import api from '../api.js';


function Question() {
  
  const [question, setQuestion] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const getquestion = async () => {
      try {
        const res = await api.get('/question');
        setQuestion(res.data);
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
      }
    };
    getquestion();
  }, []);
  if (question.length === 0) {
    return <p className="p-5 text-black">Loading question...</p>;
  }

  const currentQuestion = question[currentIndex];
  const questionId = currentQuestion._id || currentQuestion.id;

 const handleNext = async () => {
  if (currentIndex < question.length - 1) {
    setCurrentIndex(currentIndex + 1);
  } else {
    try {
      const res = await api.post('/assessment', {
        answers: answers,
      });

      console.log('ML Recommendation:', res.data);
      alert(JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.error(
        'Assessment error:',
        error.response?.data || error.message
      );
    }
  }
};
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  return (
    <>
      <h2 className="text-gray-500 mt-2">
        Answer all 10 question. Your answers will decide the best path after
        12th.
      </h2>
      <div className="h-[340px] w-[850px] mt-2 bg-gray-200 p-5 rounded-2xl">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">
          {currentQuestion.question}
        </h1>

        <div className="space-y-3">
          {currentQuestion.options?.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 text-1 text-gray-900 ${
                answers[questionId] === option.id
                  ? 'border-black bg-black'
                  : 'border-gray-200 hover:border-black'
              }`}
            >
              <input
                type="radio"
                name={`question-${questionId}`}
                value={option.id}
                checked={answers[questionId] === option.id}
                onChange={() =>
                  setAnswers({
                    ...answers,

                    [questionId]: option.id,
                  })
                }
                className="h-3 w-5 accent-black"
              />

              {option.text}
            </label>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between">
          {/* <button
            type="button"
            onClick={() => (window.location.href = '/')}
            className="rounded-xl border border-gray-300  px-5 py-3 font-semibold bg-black text-white  hover:bg-white hover:text-black"
          >
            Back to Home
          </button> */}

          <div className="mt-2 flex items-center justify-between  gap-70 ">
            <button
              type="button"
              onClick={() => (window.location.href = '/')}
              className="rounded-xl border border-gray-300 px-5 py-3 font-semibold bg-black text-white hover:bg-white hover:text-black"
            >
              Back to Home
            </button>

            <div className="flex items-center gap-4 mt-1">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold bg-black text-white hover:bg-white hover:text-black"
              >
                Previous
              </button>

              <p className="text-center text-gray-500">
                Question {currentIndex + 1} of {question.length}
              </p>

              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl px-5 py-3 ml-3 border border-gray-300 font-semibold bg-black text-white hover:bg-white hover:text-black"
              >
                {currentIndex === question.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Question;
