import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'

const NotFound = () => {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex items-center">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
        `}
      </style>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 
          className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          404
        </h1>
        <h2 
          className="text-3xl font-bold mb-6 text-gray-200"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Page Not Found
        </h2>
        <p 
          className="text-xl text-gray-400 mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-md bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-medium hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <FaHome className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound 