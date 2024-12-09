import { Link } from 'react-router-dom';
import Logo from '/Logo.webp';
import { FaHeart, FaComments, FaCog, FaArrowRight } from 'react-icons/fa';

const features = [
  {
    title: 'AI-Powered Messages',
    description: 'Get intelligent, contextual message suggestions tailored to your conversation',
    icon: <FaComments className="w-6 h-6 text-indigo-600" />
  },
  {
    title: 'Personalized Style',
    description: 'Messages that match your unique texting style and personality',
    icon: <FaHeart className="w-6 h-6 text-indigo-600" />
  },
  {
    title: 'Multi-Platform Support',
    description: 'Works seamlessly with Tinder, Bumble, Hinge, and more',
    icon: <FaCog className="w-6 h-6 text-indigo-600" />
  }
];

const steps = [
  {
    title: 'Input Your Style',
    description: 'Share your texting preferences and personality'
  },
  {
    title: 'Choose Platform',
    description: 'Select your preferred dating app'
  },
  {
    title: 'Get Suggestions',
    description: 'Receive tailored message recommendations'
  }
];

const testimonials = [
  {
    quote: "This AI coach helped me craft messages that actually got responses!",
    name: "Alex M.",
    role: "User"
  },
  {
    quote: "My matches increased significantly with better conversation starters.",
    name: "Sarah K.",
    role: "User"
  }
];

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Craft Your Perfect Message Every Time!
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              AI-powered personalized messages tailored to your texting style for dating apps like Tinder, Bumble, and Hinge.
            </p>
            <Link
              to="/conversation"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:text-lg"
            >
              Get Started
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Key Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-gray-500 text-sm">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Dating Game?</h2>
          <p className="text-xl mb-8">Start crafting engaging messages that get responses.</p>
          <Link
            to="/conversation"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:text-lg"
          >
            Start Crafting Messages Today
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-indigo-400">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-indigo-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-indigo-400">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-indigo-400">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-indigo-400"><i className="fab fa-twitter"></i></a>
                <a href="#" className="hover:text-indigo-400"><i className="fab fa-instagram"></i></a>
                <a href="#" className="hover:text-indigo-400"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
            <div>
              <img src={Logo} alt="Dating Coach AI" className="h-8 w-auto mb-4" />
              <p className="text-sm text-gray-400">
                Your AI companion for better dating conversations.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Dating Coach AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 