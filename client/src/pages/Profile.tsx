import { useState } from 'react'

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    preferences: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
        `}
      </style>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Your Dating Profile
          </h1>
          <p 
            className="text-xl text-gray-400"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Customize your profile to get better matches
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-lg font-medium text-gray-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label 
                htmlFor="bio" 
                className="block text-lg font-medium text-gray-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label 
                htmlFor="preferences" 
                className="block text-lg font-medium text-gray-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Dating Preferences
              </label>
              <textarea
                id="preferences"
                rows={4}
                value={formData.preferences}
                onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-md bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-medium transition-all duration-300 transform hover:scale-105 hover:from-blue-500 hover:via-purple-600 hover:to-pink-600"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile 