import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Marks( { onStart }) {
  const navigation = useNavigate();
  const [marks, setMarks] = useState({
    english: '',
    physics: '',
    chemistry: '',
    mathematics: '',
    optional: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
      setMarks({ ...marks, [name]: value });
    }
  };
  const filledMarks = Object.values(marks).filter((value) => value !== '');

  const percentage =
    filledMarks.length > 0
      ? filledMarks.reduce((sum, value) => sum + Number(value), 0) /
        filledMarks.length
      : 0;
  const handleSubmit = (e) => {
    e.preventDefault();

    if (filledMarks.length < 4) {
      console.log("please fill all marks")
      alert('Please enter marks for all compulsory subjects.');
      return;
    }
     onStart();
    
  };
  const subjects = [
    { label: 'English', name: 'english' },
    { label: 'Physics', name: 'physics' },
    { label: 'Chemistry', name: 'chemistry' },
    { label: 'Mathematics', name: 'mathematics' },
    { label: 'Optional Subject', name: 'optional' },
  ];
  return (
    <>
      
      
          <h2 className="text-gray-500 mt-2">
            First share your 12th marks, then start the assessment questions.
          </h2>
          <div className="h-[340px] w-[850px] mt-2 bg-gray-200 p-5 rounded-2xl">
            <h1 className="text-xl font-bold ">
              Enter Class 12th Marks (out of 100)
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {subjects.map((subject) => (
                  <label
                    key={subject.name}
                    className="flex flex-col gap-2 text-sm font-semibold text-black"
                  >
                    {subject.label}

                    <input
                      type="number"
                      name={subject.name}
                      min="0"
                      max="100"
                      step="0.01"
                      value={marks[subject.name]}
                      onChange={handleChange}
                      required={subject.name !== 'optional'}
                      placeholder="Enter marks"
                      className="h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-base text-black outline-none focus:border-black"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-5 flex min-h-[70px] items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white p-4">
                <span className="text-sm font-semibold text-black sm:text-base">
                  Calculated 12th percentage
                </span>

                <span className="shrink-0 text-xl font-bold text-black">
                  {percentage.toFixed(2)}%
                </span>
              </div>

              <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => (window.location.href = '/')}
                  className="rounded-lg border border-black bg-white px-5 py-3 text-base font-semibold text-black transition hover:bg-black hover:text-white"
                >
                  Back to Home
                </button>

                <button 
                
                
                  type="submit"
                  className="rounded-lg border border-black bg-black px-5 py-3 text-base font-semibold text-white transition hover:bg-gray-800"
                >
                  Save 12th Marks and Start Assessment →
                </button>
              </div>
            </form>
          </div>
        
 
    </>
  );
}

export default Marks;
