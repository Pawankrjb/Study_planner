
import Footer from './Footer';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';



function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#1e1c1c] p-8 text-white">
      <Navbar />

      <section className="max-w-[1300px]  ml-30 px-6 py-12 text-black md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          {/* About Heading */}
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
                About StudyPlanner
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Plan Smarter.
                <br />
                Learn Better.
                <br />
                Build Your Future.
              </h1>

              <p className="mt-6 max-w-xl leading-8 text-white">
                StudyPlanner helps students organize their studies, discover
                their strengths, and make better academic and career decisions.
                Get personalized guidance and plan your future with confidence.
              </p>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-7 rounded-lg bg-black px-6 py-3 font-medium text-white transition duration-300 hover:bg-gray-800"
              >
                Start Your Journey
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition duration-300 hover:-translate-y-1 hover:bg-gray-100">
                <h2 className="text-xl font-bold text-black">Study Planning</h2>
                <p className="mt-3 leading-6 text-gray-600">
                  Organize your study goals and improve your learning habits.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition duration-300 hover:-translate-y-1 hover:bg-gray-100">
                <h2 className="text-xl font-bold text-black">
                  Career Guidance
                </h2>
                <p className="mt-3 leading-6 text-gray-600">
                  Explore careers that match your interests and strengths.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition duration-300 hover:-translate-y-1 hover:bg-gray-100">
                <h2 className="text-xl font-bold text-black">Track Progress</h2>
                <p className="mt-3 leading-6 text-gray-600">
                  Track your progress and stay focused on your goals.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition duration-300 hover:-translate-y-1 hover:bg-gray-100">
                <h2 className="text-xl font-bold text-black">Student First</h2>
                <p className="mt-3 leading-6 text-gray-600">
                  A simple learning experience designed for student success.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-gray-200 pt-8 text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Your Goals. Your Journey. Your Future.
            </h2>

            <p className="mt-3 text-gray-600">
              Make every study session count.
            </p>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </div>
  );
}

export default About;
