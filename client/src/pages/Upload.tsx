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

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setUploadedText(text)
    }
    reader.readAsText(file)
  }

  const handleSubmit = async () => {
    if (!uploadedText) return

    try {
      // TODO: Implement API call to save to vector DB
      console.log('Uploading text:', uploadedText)
    } catch (error) {
      console.error('Error uploading text:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Conversation Texts</h2>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
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
              <div className="text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">Upload a file</span>
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
              <p className="text-xs text-gray-500">TXT files only</p>
            </div>
          </div>

          {uploadedText && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Preview:</h3>
              <div className="bg-gray-50 rounded p-4 max-h-60 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {uploadedText}
                </pre>
              </div>
              <button
                onClick={handleSubmit}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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