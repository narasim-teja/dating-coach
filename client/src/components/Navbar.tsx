import { Link } from 'react-router-dom'
import Logo from '/Logo.webp'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img src={Logo} alt="Dating Coach AI Logo" className="h-8 w-auto mr-2" />
                <span className="text-xl font-bold text-gray-800">Dating Coach AI</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/profile"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Profile
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Upload Texts
              </Link>
              <Link
                to="/conversation"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
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