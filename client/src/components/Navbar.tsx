import { Link } from 'react-router-dom'
import Logo from '/Logo.webp'

const Navbar = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img src={Logo} alt="Dating Coach AI Logo" className="h-8 w-auto mr-2" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  Dating Coach AI
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/profile"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
              >
                Upload Texts
              </Link>
              <Link
                to="/conversation"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
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