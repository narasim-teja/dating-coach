import { useState } from 'react'

const Upload = () => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedText, setUploadedText] = useState('')

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files && e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text === 'string') {
        setUploadedText(text)
      }
    }
    reader.readAsText(file)
  }

  const handleSubmit = () => {
    // Handle saving to database
    console.log('Saving to database:', uploadedText)
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
            Upload Your Conversations
          </h1>
          <p 
            className="text-xl text-gray-400"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Help our AI learn your texting style
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-8 border border-gray-700">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-purple-500 bg-gray-800/50' : 'border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg className="h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14m-16-4v16m-8-8h16" />
                </svg>
              </div>
              <div 
                className="text-gray-300"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <label htmlFor="file-upload" className="relative cursor-pointer">
                  <span className="text-purple-400 hover:text-purple-300">Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".txt"
                    onChange={handleFileInput}
                  />
                </label>
                {' '}or drag and drop
              </div>
              <p className="text-xs text-gray-400">TXT files only</p>
            </div>
          </div>

          {uploadedText && (
            <div className="mt-6">
              <h3 
                className="text-lg font-medium text-gray-200 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Preview:
              </h3>
              <div className="bg-gray-700/50 rounded-lg p-4 max-h-60 overflow-y-auto border border-gray-600">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  {uploadedText}
                </pre>
              </div>
              <button
                onClick={handleSubmit}
                className="mt-4 w-full flex justify-center py-3 px-4 rounded-md bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-medium transition-all duration-300 transform hover:scale-105 hover:from-blue-500 hover:via-purple-600 hover:to-pink-600"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Save to Database
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Upload 