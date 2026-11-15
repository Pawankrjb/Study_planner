import React, { useEffect, useState } from 'react'
import api from '../api'
import Navbar from '../component/Navbar'


const states = [
  'Andhra Pradesh',
  'Delhi',
  'Gujarat',
  'Karnataka',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Uttar Pradesh',
]

function CareerDetails() {
  const [state, setState] = useState('')
  const [career, setCareer] = useState('')

  const [careerOptions, setCareerOptions] = useState([])
  const [careerLoading, setCareerLoading] = useState(true)

  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  // Fetch Career Interests From Backend
  useEffect(() => {
    const fetchCareerInterests = async () => {
      try {
        const response = await api.get('/profile')

        const recommendations = response.data.Recommand || []

        const interests = recommendations
          .map((item) => item.career)
          .filter(Boolean)

        setCareerOptions([...new Set(interests)])

      } catch (error) {
        console.error('Unable to load career interests:', error)
        setCareerOptions([])
      } finally {
        setCareerLoading(false)
      }
    }

    fetchCareerInterests()
  }, [])

  // Find Colleges
  const findColleges = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setSearched(true)

    try {
      const response = await api.get('/colleges', {
        params: {
          state,
          career,
        },
      })

      setColleges(response.data.colleges || [])

    } catch (err) {
      console.log(err)

      setColleges([])

      setError(
        err.response?.data?.message ||
        'Unable to load colleges. Please try again.'
      )

    } finally {
      setLoading(false)
    }
  }

  // Reset Filters
  const resetFilters = () => {
    setState('')
    setCareer('')
    setColleges([])
    setSearched(false)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#1e1c1c] px-5 py-10 text-white">
    <Navbar/>

      <div className="mx-auto max-w-[1420px]">

        {/* Header */}
        <div className="mb-9">

          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Academic Planning
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            College Recommendation
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-gray-300">
            Discover the best colleges based on your preferred
            location and career interests.
          </p>

        </div>

        {/* Search Section */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1.55fr_0.85fr]">

          {/* Search Card */}
          <div className="rounded-2xl bg-white p-7 text-gray-900 shadow-sm md:p-10">

            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Find Your College
            </p>

            <h2 className="mt-3 text-2xl font-bold text-black">
              Choose Your Preferences
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Select your preferred state and career field to
              explore suitable colleges.
            </p>

            <form
              onSubmit={findColleges}
              className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
            >

              {/* State */}
              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Select State
                </label>

                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
                >

                  <option value="">
                    All States
                  </option>

                  {states.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}

                </select>

              </div>

              {/* Career */}
              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Select Career
                </label>

                <select
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  disabled={careerLoading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black disabled:bg-gray-100"
                >

                  <option value="">
                    All Career Fields
                  </option>

                  {careerLoading ? (
                    <option disabled>
                      Loading interests...
                    </option>
                  ) : careerOptions.length > 0 ? (
                    careerOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <option disabled>
                      No career interests found
                    </option>
                  )}

                </select>

              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 pt-3 sm:col-span-2">

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-black px-7 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
                >
                  {loading ? 'Searching...' : 'Find Colleges →'}
                </button>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
                >
                  Reset
                </button>

              </div>

            </form>

          </div>

          {/* Search Information */}
          <div className="rounded-2xl bg-white p-7 text-gray-900 shadow-sm md:p-8">

            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Your Search
            </p>

            <h2 className="mt-4 text-2xl font-bold text-black">
              Explore Opportunities
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Your preferences help us find colleges matching
              your academic and career interests.
            </p>

            <div className="mt-7 space-y-5 border-t border-gray-200 pt-5">

              <div>

                <p className="text-xs font-semibold uppercase text-gray-500">
                  Preferred State
                </p>

                <p className="mt-1 font-semibold">
                  {state || 'Any State'}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase text-gray-500">
                  Career Interest
                </p>

                <p className="mt-1 font-semibold">
                  {career || 'Any Career Field'}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Results */}
        <section className="mt-12">

          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">

            <div>

              <h2 className="text-2xl font-bold md:text-3xl">
                Recommended Colleges
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Colleges matching your selected preferences.
              </p>

            </div>

            {searched && !loading && !error && (
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900">
                {colleges.length} Colleges Found
              </span>
            )}

          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl bg-white p-10 text-center text-gray-600">
              Loading colleges...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl bg-white p-10 text-center text-red-600">
              {error}
            </div>
          )}

          {/* Initial Message */}
          {!loading && !error && !searched && (
            <div className="rounded-2xl bg-white p-10 text-center">

              <h3 className="text-xl font-bold text-gray-900">
                Ready to Explore?
              </h3>

              <p className="mt-2 text-gray-500">
                Select your state and career field to find colleges.
              </p>

            </div>
          )}

          {/* No Results */}
          {!loading && !error && searched && colleges.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center">

              <h3 className="text-xl font-bold text-gray-900">
                No Colleges Found
              </h3>

              <p className="mt-2 text-gray-500">
                Try selecting another state or career field.
              </p>

            </div>
          )}

          {/* College Cards */}
          {!loading && !error && colleges.length > 0 && (

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {colleges.map((college) => (

                <div
                  key={college._id}
                  className="rounded-2xl bg-white p-6 text-gray-900 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="mb-4 flex flex-wrap gap-2">

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {college.state || 'India'}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {Array.isArray(college.career)
                        ? college.career.join(', ')
                        : college.career}
                    </span>

                  </div>

                  <h3 className="text-xl font-bold">
                    {college.name || college.collegeName}
                  </h3>

                  {college.city && (
                    <p className="mt-2 text-sm text-gray-500">
                      📍 {college.city}
                    </p>
                  )}

                  {college.description && (
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {college.description}
                    </p>
                  )}

                  {college.website && (
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-block rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      Visit Website →
                    </a>
                  )}

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

    </div>
  )
}

export default CareerDetails