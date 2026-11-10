import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import Navbar from "../component/Navbar.jsx";
import Footer from "../component/Footer.jsx";

function Smart_career() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCareerRecommendation = async () => {
      try {
        const response = await api.get("/profile");

        setUser(response.data);
        setRecommendations(response.data.Recommand || []);

      } catch (error) {
        console.error("Career Recommendation Error:", error);

        setError(
          error.response?.data?.message ||
          "Unable to fetch career recommendations."
        );

      } 
      finally{
        setLoading(false);
      }
    };

    fetchCareerRecommendation();
  }, []);

 

  const topCareer = recommendations[0];

  return (
    <main className="min-h-screen bg-[#1e1c1c] p-6 text-white md:p-8">

      <Navbar />

      {/* PAGE HEADER */}
      <section className="mx-auto mt-10 max-w-[1400px]">

        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          Career Guidance Platform
        </p>

        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          Smart Career Recommendation
        </h1>

        <p className="mt-3 max-w-2xl leading-relaxed text-gray-400">
          Discover career opportunities based on your academic
          performance, interests and assessment results.
        </p>

        {user && (
          <p className="mt-5 text-lg">
            Welcome, <span className="font-bold">{user.name}</span>
          </p>
        )}

      </section>

      {recommendations.length === 0 ? (

        /* NO RECOMMENDATION */
        <section className="mx-auto mt-10 max-w-[1400px]">

          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-black shadow-lg">

            <h2 className="text-2xl font-bold">
              No Recommendation Available
            </h2>

            <p className="mt-4 text-gray-600">
              Complete your career assessment to discover your suitable career.
            </p>

            <button
              onClick={() => navigate("/assessment")}
              className="mt-7 rounded-lg bg-black px-7 py-3 font-semibold text-white transition-all hover:bg-gray-800"
            >
              Start Assessment →
            </button>

          </div>

        </section>

      ) : (

        <>

          {/* TOP CAREER MATCH */}
          <section className="mx-auto mt-10 max-w-[1400px]">

            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-black shadow-lg">

              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Your Best Career Match
              </p>

              <div className="mt-7 flex flex-col justify-between gap-8 md:flex-row md:items-center">

                <div>

                  <h2 className="text-3xl font-bold md:text-4xl">
                    {topCareer.career}
                  </h2>

                  <p className="mt-4 max-w-xl leading-relaxed text-gray-600">
                    This career has been recommended based on your
                    assessment results and machine learning prediction.
                  </p>

                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 p-7">

                  <h2 className="text-5xl font-bold">
                    {topCareer.percentage}%
                  </h2>

                  <p className="mt-2 text-sm font-semibold text-gray-500">
                    Match Percentage
                  </p>

                </div>

              </div>

              <button
                onClick={() => navigate("/career-details")}
                className="mt-8 rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all hover:-translate-y-1 hover:bg-gray-800"
              >
                Explore Career →
              </button>

            </div>

          </section>

          {/* ALL CAREER RECOMMENDATIONS */}
          <section className="mx-auto mt-12 max-w-[1400px]">

            <h2 className="text-2xl font-bold">
              Your Career Recommendations
            </h2>

            <p className="mt-2 text-gray-400">
              Careers suggested by your assessment results.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

              {recommendations.map((career, index) => (

                <div
                  key={career._id || index}
                  className="rounded-2xl border border-gray-200 bg-white p-6 text-black shadow-lg transition-all duration-300 hover:-translate-y-2"
                >

                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Career Option {index + 1}
                  </p>

                  <h3 className="mt-4 text-xl font-bold">
                    {career.career}
                  </h3>

                  <div className="mt-7 flex items-center justify-between">

                    <span className="text-sm text-gray-500">
                      Match Score
                    </span>

                    <span className="text-2xl font-bold">
                      {career.percentage}%
                    </span>

                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">

                    <div
                      className="h-full rounded-full bg-black transition-all duration-700"
                      style={{
                        width: `${career.percentage}%`
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </section>

        </>
      )}

      {/* ABOUT RECOMMENDATION */}
      <section className="mx-auto mt-12 max-w-[1400px]">

        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-black shadow-lg">

          <h2 className="text-2xl font-bold">
            About Your Recommendation
          </h2>

          <p className="mt-4 leading-relaxed text-gray-600">
            Your career recommendation is generated using your
            assessment responses and machine learning model.
            The suggested career provides guidance to help you
            explore suitable professional opportunities.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">

            <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">

              <p className="text-sm text-gray-500">
                Total Recommendations
              </p>

              <p className="mt-2 text-2xl font-bold">
                {recommendations.length}
              </p>

            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">

              <p className="text-sm text-gray-500">
                Assessment Status
              </p>

              <p className="mt-2 text-2xl font-bold">
                Completed
              </p>

            </div>

          </div>

          <button
            onClick={() => navigate("/assessment")}
            className="mt-7 rounded-lg border border-gray-300 bg-black px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800"
          >
            Retake Assessment →
          </button>

        </div>

      </section>

      <Footer />

    </main>
  );
}

export default Smart_career;