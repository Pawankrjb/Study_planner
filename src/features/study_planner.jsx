import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function CareerRoadmap() {
    const navigate = useNavigate();

    const [roadmaps, setRoadmaps] = useState([]);
    const [selectedCareer, setSelectedCareer] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                const response = await api.get('/career-roadmaps');

                const data = response.data.roadmaps || [];

                setRoadmaps(data);

            } catch (error) {
                console.log(error);
                setError('Unable to load career roadmaps.');
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmaps();
    }, []);

    const categories = [
        'All',
        ...new Set(roadmaps.map(item => item.category))
    ];

    const filteredRoadmaps = roadmaps.filter(item => {
        const matchesSearch = item.career
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCategory =
            category === 'All' || item.category === category;

        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1e1c1c] text-white flex justify-center items-center">
                Loading Career Roadmaps...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1e1c1c] text-white p-6 md:p-10">

            <button
                onClick={() => navigate('/')}
                className="bg-black px-5 py-2 rounded-lg mb-8"
            >
                ← Back
            </button>

            <div className="max-w-7xl mx-auto">

                <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
                    Career Roadmaps
                </h1>

                <p className="text-gray-400 text-center mb-10">
                    Explore career paths and follow a step-by-step learning roadmap.
                </p>

                {/* Search */}

                <div className="flex flex-col md:flex-row gap-4 mb-10">

                    <input
                        type="text"
                        placeholder="Search your career..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 p-4 rounded-xl bg-white text-black outline-none"
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="p-4 rounded-xl bg-white text-black outline-none"
                    >
                        {categories.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                </div>

                {error && (
                    <p className="text-red-400 text-center mb-6">
                        {error}
                    </p>
                )}

                {/* Career Cards */}

                {!selectedCareer ? (

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {filteredRoadmaps.map((item) => (

                            <div
                                key={item._id}
                                className="bg-white text-black rounded-2xl p-6 shadow-lg hover:-translate-y-1 transition duration-300"
                            >

                                <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
                                    {item.category}
                                </span>

                                <h2 className="text-2xl font-bold mt-5 mb-3">
                                    {item.career}
                                </h2>

                                <p className="text-gray-600 mb-2">
                                    Duration: {item.duration}
                                </p>

                                <p className="text-gray-600 mb-5">
                                    Level: {item.level}
                                </p>

                                <p className="text-gray-500 mb-5">
                                    {item.phases?.length || 0} Learning Phases
                                </p>

                                <button
                                    onClick={() => setSelectedCareer(item)}
                                    className="bg-black text-white px-5 py-3 rounded-lg w-full hover:bg-gray-800"
                                >
                                    View Roadmap →
                                </button>

                            </div>

                        ))}

                    </div>

                ) : (

                    /* Selected Career Details */

                    <div className="bg-white text-black rounded-2xl p-6 md:p-10">

                        <button
                            onClick={() => setSelectedCareer(null)}
                            className="bg-black text-white px-5 py-2 rounded-lg mb-8"
                        >
                            ← All Careers
                        </button>

                        <h1 className="text-3xl font-bold mb-3">
                            {selectedCareer.career}
                        </h1>

                        <div className="flex flex-wrap gap-3 mb-8">

                            <span className="bg-gray-200 px-4 py-2 rounded-lg">
                                {selectedCareer.category}
                            </span>

                            <span className="bg-gray-200 px-4 py-2 rounded-lg">
                                {selectedCareer.duration}
                            </span>

                            <span className="bg-gray-200 px-4 py-2 rounded-lg">
                                {selectedCareer.level}
                            </span>

                        </div>

                        {/* Learning Phases */}

                        <h2 className="text-2xl font-bold mb-6">
                            Learning Roadmap
                        </h2>

                        <div className="space-y-6">

                            {selectedCareer.phases?.map((phase, index) => (

                                <div
                                    key={index}
                                    className="border border-gray-300 rounded-xl p-6"
                                >

                                    <h3 className="text-xl font-bold mb-2">
                                        Phase {phase.phase}: {phase.title}
                                    </h3>

                                    <p className="text-gray-500 mb-5">
                                        Duration: {phase.duration}
                                    </p>

                                    <h4 className="font-bold mb-2">
                                        Subjects
                                    </h4>

                                    <div className="flex flex-wrap gap-2 mb-5">

                                        {phase.subjects?.map((subject, i) => (
                                            <span
                                                key={i}
                                                className="bg-gray-200 px-3 py-2 rounded-lg text-sm"
                                            >
                                                {subject}
                                            </span>
                                        ))}

                                    </div>

                                    <h4 className="font-bold mb-2">
                                        Skills to Learn
                                    </h4>

                                    <ul className="list-disc pl-6 mb-5 text-gray-700">
                                        {phase.skills?.map((skill, i) => (
                                            <li key={i}>{skill}</li>
                                        ))}
                                    </ul>

                                    <h4 className="font-bold mb-2">
                                        Practical Projects
                                    </h4>

                                    <ul className="list-disc pl-6 text-gray-700">
                                        {phase.projects?.map((project, i) => (
                                            <li key={i}>{project}</li>
                                        ))}
                                    </ul>

                                </div>

                            ))}

                        </div>

                        {/* Career Outcomes */}

                        <div className="mt-10">

                            <h2 className="text-2xl font-bold mb-5">
                                Career Opportunities
                            </h2>

                            <div className="flex flex-wrap gap-3">

                                {selectedCareer.careerOutcomes?.map((outcome, i) => (

                                    <span
                                        key={i}
                                        className="bg-black text-white px-4 py-3 rounded-lg"
                                    >
                                        {outcome}
                                    </span>

                                ))}

                            </div>

                        </div>

                    </div>

                )}

                {!selectedCareer && filteredRoadmaps.length === 0 && (
                    <p className="text-center text-gray-400 mt-10">
                        No career roadmaps found.
                    </p>
                )}

            </div>

        </div>
    );
}

export default CareerRoadmap;