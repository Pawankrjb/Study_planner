import { useEffect, useState } from 'react';
import { Navigate ,useNavigate} from 'react-router-dom';
import api from '../api.js';
import Navbar from '../component/Navbar.jsx';
import Card from '../component/Card.jsx';
import Footer from '../component/Footer.jsx';

function Home() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await api.get('/profile');
        setUser(response.data);
        setStatus('logged-in');
      } catch (error) {
        if (error.response?.status === 401) {
          setStatus('logged-out');
        } else {
          setStatus('error');
        }
      }
    }

    checkSession();
  }, []);
  if (status === 'loading') {
    return <p className="p-8">Checking Your Session...</p>;
  }

  if (status === 'logged-out') {
    return <Navigate to="/signup" replace />;
  }

  // if (status === 'error') {
  //   return <p className="p-8">Could not check your session. Please refresh.</p>;
  // }
  if (status === 'error') {
  return <Navigate to="/signup" replace />;
}

  return (
    <>
      <main className="min-h-screen bg-[#1e1c1c]  p-8 text-white">
        <Navbar></Navbar>
        <div className="flex gap-10 mt-10 m-20">
          <div className="h-80 w-200 ml-10 rounded-2xl border border-gray-200 bg-white text-black shadow-lg">
            <h1 className="mt-3 pl-12 pr-20 p-4 text-gray-500">
              ACADEMIC PLANNING
            </h1>

            <h1 className="pl-12 pr-20 p-4 text-3xl font-bold text-black">
              Welcome {user.name}!
            </h1>

            <p className="mt-3 pl-12 pr-20 p-4 leading-relaxed text-gray-600">
              Hi {user.name}, get simple study tips based on your performance,
              interests, and skills. Stay focused, track your progress, and make
              learning easier every day.
            </p>

            <button
              type="button"
               onClick={() => navigate('/assessment')}
              className="ml-50 rounded-lg border border-gray-300 bg-black px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-lg"
            >
              Take Assessment <span className="ml-2">→</span>
            </button>
          </div>
          <div className="h-80 w-135  rounded-2xl border border-gray-200 bg-white p-6 text-black shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Live Recommendation Snapshot
            </p>

            <h2 className="mt-6 text-2xl font-bold text-black">
              Top Match:{' '}
              <span className="text-gray-500">No recommendation yet</span>
            </h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              Confidence score updates after each assessment phase.
            </p>
          </div>
        </div>
        <section id="features" className="scroll ">
          <h1 className="ml-30 text-3xl font-bold text-white">Core Features</h1>

          <h2 className="ml-30 font-bold text-white">
            Everything needed to move from confusion to confident career
            decisions.
          </h2>

          <Card />
        </section>

        
        <div className="m-10 ml-30 rounded-2xl  max-w-[1400px] border   border-gray-200 bg-white p-8 text-black shadow-lg">
          <h1 className="mb-6 text-3xl font-bold">How It Works</h1>

          <div className="grid grid-cols-1  gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-3 text-xl font-bold text-black-600">01</h2>
              <p>Enter your academic details</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-3 text-xl font-bold text-black-600">02</h2>
              <p>Take 20-question aptitude test</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-3 text-xl font-bold text-black-600">03</h2>
              <p>Get AI-based recommendation</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-3 text-xl font-bold text-black-600">04</h2>
              <p>Explore careers and colleges</p>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </main>
    </>
  );
}

export default Home;
