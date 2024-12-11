/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from 'react-router-dom';
import Logo from '/Logo.webp';
import { FaHeart, FaComments, FaCog, FaArrowRight, FaSmile, FaRobot, FaLightbulb, FaUserFriends } from 'react-icons/fa';

const features = [
  {
    title: 'AI-Powered Message Generator',
    description: 'Get intelligent, contextual message suggestions that spark engaging conversations',
    icon: <FaRobot className="w-6 h-6 text-pink-400" />
  },
  {
    title: 'Personalized Style Adaptation',
    description: 'Our AI learns and adapts to your unique texting style and personality',
    icon: <FaHeart className="w-6 h-6 text-pink-400" />
  },
  {
    title: 'Smart Conversation Analysis',
    description: 'Get insights and tips to improve your messaging approach',
    icon: <FaLightbulb className="w-6 h-6 text-pink-400" />
  },
  {
    title: 'Dating Profile Enhancement',
    description: 'Receive suggestions to make your profile stand out and attract better matches',
    icon: <FaUserFriends className="w-6 h-6 text-pink-400" />
  }
];

const steps = [
  {
    title: 'Input Your Style',
    description: 'Share your texting preferences and personality traits'
  },
  {
    title: 'Get Tailored Messages',
    description: 'Receive personalized message suggestions that match your style'
  }
];

const testimonials = [
  {
    quote: "This AI coach transformed my dating game completely!",
    name: "Alex M.",
    role: "User",
    image: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    quote: "Finally, messages that actually sound like me!",
    name: "Sarah K.",
    role: "User",
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  }
];

const Home = () => {
  return (
    <div className="bg-gray-900 text-gray-100">
      {/* Font imports */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
        `}
      </style>
      
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text leading-normal md:leading-tight pb-2"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Unlock the Power of AI in Dating
            </h1>
            <p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AI-powered tools tailored to your unique texting style for all your dating apps
            </p>
            <div className="max-w-4xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
                <h3 
                  className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Personalized Messaging
                </h3>
                <p className="text-gray-400" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Our AI learns your texting style and personality to create messages that sound authentically you.
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
                <h3 
                  className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Context-Aware Responses
                </h3>
                <p className="text-gray-400" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Generate relevant replies based on profile bios and ongoing conversations.
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
                <h3 
                  className="text-xl font-semibold mb-2 bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Multiple Options
                </h3>
                <p className="text-gray-400" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Choose from a variety of AI-generated conversation starters and responses.
                </p>
              </div>
            </div>
            <Link
              to="/conversation"
              className="inline-flex items-center px-8 py-3 rounded-md bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-medium transition-all duration-300 transform hover:scale-105 hover:from-blue-500 hover:via-purple-600 hover:to-pink-600"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Get Started
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Why Choose Our AI Dating Coach?
            </h2>
            <p 
              className="text-xl text-gray-400 mb-12"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your personal assistant for meaningful connections
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 p-8 rounded-lg border border-gray-700 transform hover:scale-105 transition-transform duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 
                  className="text-2xl font-semibold mb-2 text-gray-100"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-400" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Transform Your Dating Experience
            </h2>
            <p 
              className="text-xl text-gray-400"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Let our AI coach help you make meaningful connections
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
              <div 
                className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                90%
              </div>
              <p className="text-gray-400" style={{ fontFamily: "'Playfair Display', serif" }}>
                Higher response rate with AI-crafted messages
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
              <div 
                className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                24/7
              </div>
              <p className="text-gray-400" style={{ fontFamily: "'Playfair Display', serif" }}>
                Available to help you craft the perfect message
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
              <div 
                className="text-5xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                100%
              </div>
              <p className="text-gray-400" style={{ fontFamily: "'Playfair Display', serif" }}>
                Personalized to match your style
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              How It Works
            </h2>
            <p 
              className="text-xl text-gray-400 mb-12"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Get started in just a few simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-8 border border-gray-700 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {index + 1}
                </div>
                <h3 
                  className="text-xl font-semibold mb-2 text-gray-100"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {step.title}
                </h3>
                <p 
                  className="text-gray-400"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              What Our Users Say
            </h2>
            <p 
              className="text-xl text-gray-400"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Real success stories from our community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-8 border border-gray-700 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <p 
                    className="text-gray-200 text-lg italic mb-4" 
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    "This AI coach transformed my dating game completely!"
                  </p>
                  <p 
                    className="text-gray-400" 
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Alex M.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-8 border border-gray-700 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <p 
                    className="text-gray-200 text-lg italic mb-4" 
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    "Finally, messages that actually sound like me!"
                  </p>
                  <p 
                    className="text-gray-400" 
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    John K.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Ready to Transform Your Dating Game?
            </h2>
            <p 
              className="text-xl mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Start crafting engaging messages that get responses.
            </p>
            <Link
              to="/conversation"
              className="inline-flex items-center px-8 py-3 rounded-md bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-medium hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Start Crafting Messages Today
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 
                className="text-lg font-semibold mb-4 text-gray-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                About
              </h3>
              <ul className="space-y-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <li><Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 
                className="text-lg font-semibold mb-4 text-gray-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Legal
              </h3>
              <ul className="space-y-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 
                className="text-lg font-semibold mb-4 text-gray-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-purple-400 transition-colors"><FaHeart /></a>
                <a href="#" className="hover:text-purple-400 transition-colors"><FaComments /></a>
                <a href="#" className="hover:text-purple-400 transition-colors"><FaCog /></a>
              </div>
            </div>
            <div>
              <img src={Logo} alt="Dating Coach AI" className="h-8 w-auto mb-4" />
              <p 
                className="text-sm"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Your AI companion for better dating conversations.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
            © {new Date().getFullYear()} Dating Coach AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 