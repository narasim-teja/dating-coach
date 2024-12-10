import { Link } from 'react-router-dom'
import Logo from '/Logo.webp'

const Navbar = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side navigation */}
          <div className="hidden sm:flex sm:items-center">
            <div className="flex space-x-8">
              <Link
                to="/profile"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Profile
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Upload Texts
              </Link>
            </div>
          </div>

          {/* Centered logo and title */}
          <div className="flex-1 flex items-center justify-center">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Dating Coach AI Logo" className="h-8 w-auto mr-2" />
              <span 
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
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
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
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