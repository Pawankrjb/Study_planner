import { useEffect, useMemo, useState,useRef } from 'react';
import api from '../api.js';
import { useNavigate } from 'react-router-dom';

function CourseComparison() {
  const [courses, setCourses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const comparisonRef = useRef(null);
    const navigate = useNavigate();

  // Fetch courses from MongoDB
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.courses || [];

        setCourses(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Get unique categories
  const categories = useMemo(
    () => [...new Set(courses.map((course) => course.category))],
    [courses],
  );

  // Select and deselect courses
  const handleSelect = (id) => {
    setSelectedIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      if (previous.length >= 4) return previous;

      return [...previous, id];
    });

    setComparison([]);
    setError('');
  };

  // Compare selected courses
  const handleCompare = () => {
  if (selectedIds.length < 2) {
    setError('Please select at least two courses');
    return;
  }

  const result = selectedIds
    .map((id) => courses.find((course) => course._id === id))
    .filter(Boolean);

  setComparison(result);
  setError('');

  setTimeout(() => {
    comparisonRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, 100);
};

  // Clear selection
  const handleClear = () => {
    setSelectedIds([]);
    setComparison([]);
    setError('');
  };

  const fields = [
    { label: 'Category', key: 'category' },
    { label: 'Duration', key: 'duration' },
    { label: 'Semesters', key: 'semesters' },
    { label: 'Fees', key: 'fees' },
    { label: 'Eligibility', key: 'eligibility' },
    {
      label: 'Entrance Exams',
      key: 'entranceExams',
      format: (value) => (Array.isArray(value) ? value.join(', ') : value),
    },
  ];

  return (
    <main className="min-h-screen bg-[#1e1c1c] p-8 text-white">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        {/* Header */}
<div className="mb-10 flex items-start justify-between gap-4">
  <div>
    <p className="mb-3 text-sm font-semibold text-gray-400">
      EXPLORE YOUR OPTIONS
    </p>

    <h1 className="text-3xl font-bold text-white">
      Multi-Career Comparison
    </h1>

    <p className="mt-3 text-gray-400">
      Select courses and compare their details side by side.
    </p>
  </div>

  <button
    type="button"
    onClick={() => navigate(-1)}
    className="shrink-0 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100"
  >
    ← Back
  </button>
</div>
           
        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-8 text-black shadow-lg">
            Loading courses...
          </div>
        )}

        {/* Error */}
        {!loading && error && courses.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-red-700">{error}</div>
        )}

        {/* No courses */}
        {!loading && courses.length === 0 && !error && (
          <div className="rounded-2xl bg-white p-8 text-black">
            No courses available.
          </div>
        )}

        {!loading && courses.length > 0 && (
          <>
            {/* Course Selection */}
            <section className="rounded-2xl border border-gray-200 bg-white p-8 text-black shadow-lg">
              <div className="mb-7 flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Select Courses</h2>

                  <p className="mt-2 text-gray-500">
                    Select minimum 2 and maximum 4 courses.
                  </p>
                </div>

                <span className="text-gray-500">
                  {selectedIds.length}/4 Selected
                </span>
              </div>

              {/* Categories */}
              {categories.map((category) => (
                <div key={category} className="mb-8">
                  <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-bold">
                    {category}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courses
                      .filter((course) => course.category === category)
                      .map((course) => {
                        const checked = selectedIds.includes(course._id);

                        const disabled = selectedIds.length >= 4 && !checked;

                        return (
                          <label
                            key={course._id}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition hover:shadow-md ${
                              checked
                                ? 'border-black bg-gray-100'
                                : 'border-gray-200 hover:border-gray-400'
                            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() => handleSelect(course._id)}
                              className="h-4 w-4 accent-black"
                            />

                            <div>
                              <h4 className="font-semibold text-black">
                                {course.courseName}
                              </h4>

                              <p className="text-sm text-gray-500">
                                {course.duration}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </div>
              ))}

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-200 pt-6">
                <button
                  onClick={handleCompare}
                  disabled={selectedIds.length < 2}
                  className="rounded-lg border border-gray-300 bg-black px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Compare Courses →
                </button>

                <button
                  onClick={handleClear}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100"
                >
                  Clear Selection
                </button>
              </div>

              {error && courses.length > 0 && (
                <p className="mt-4 text-sm text-red-700">{error}</p>
              )}
            </section>

            {/* Comparison Table */}
            {comparison.length > 0 && (
              <section    ref={comparisonRef} className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-black shadow-lg">
                <h2 className="mb-6 text-2xl font-bold">Course Comparison</h2>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-200 p-4">Details</th>

                        {comparison.map((course) => (
                          <th
                            key={course._id}
                            className="border border-gray-200 p-4"
                          >
                            {course.courseName}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {fields.map((field) => (
                        <tr key={field.key} className="hover:bg-gray-50">
                          <th className="border border-gray-200 p-4 font-semibold">
                            {field.label}
                          </th>

                          {comparison.map((course) => {
                            const value = course[field.key];

                            const displayValue = field.format
                              ? field.format(value)
                              : (value ?? 'Not available');

                            return (
                              <td
                                key={course._id}
                                className="border border-gray-200 p-4 text-sm text-gray-600"
                              >
                                {displayValue || 'Not available'}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default CourseComparison;
