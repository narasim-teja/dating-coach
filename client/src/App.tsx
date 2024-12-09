import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import Upload from './pages/Upload'
import Conversation from './pages/Conversation'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/" element={<Conversation />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
