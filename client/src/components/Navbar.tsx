import { Link } from 'react-router-dom'
import Logo from '/Logo.webp'

const Navbar = () => {
  return (
    <nav className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Left side navigation */}
          <div className="hidden sm:flex sm:items-center">
            <div className="flex space-x-8">
              <Link
                to="/profile"
                className="inline-flex items-center px-3 py-2 text-lg font-medium text-gray-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:via-purple-500 hover:to-pink-500 transition-all duration-300"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Profile
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center px-3 py-2 text-lg font-medium text-gray-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:via-purple-500 hover:to-pink-500 transition-all duration-300"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Upload Texts
              </Link>
            </div>
          </div>

          {/* Centered logo and title */}
          <div className="flex-1 flex items-center justify-center">
            <Link to="/" className="flex items-center group">
              <img src={Logo} alt="Dating Coach AI Logo" className="h-10 w-auto mr-3 transform group-hover:scale-105 transition-transform duration-300" />
              <span 
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text transform group-hover:scale-105 transition-all duration-300"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Dating Coach AI
              </span>
            </Link>
          </div>

          {/* Right side navigation */}
          <div className="hidden sm:flex sm:items-center">
            <div className="flex space-x-8">
              <Link
                to="/conversation"
                className="inline-flex items-center px-4 py-2 text-lg font-medium rounded-md bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Get Starters
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 