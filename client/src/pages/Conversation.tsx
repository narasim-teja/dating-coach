import { useState } from 'react'
import { createWorker, type Worker } from 'tesseract.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not defined')
}

const Conversation = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [starters, setStarters] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [extractedText, setExtractedText] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      await extractTextFromImage(file)
    }
  }

  const extractTextFromImage = async (file: File) => {
    setLoading(true)
    setError('')
    try {
      const worker = await createWorker() as Worker & { loadLanguage: (lang: string) => Promise<void> }
      
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      await worker.loadLanguage('eng')
      await worker.load()
      
      const result = await worker.recognize(base64Image)
      console.log('Extracted text:', result.data.text)
      setExtractedText(result.data.text)
      
      await worker.terminate()
    } catch (error) {
      console.error('Error extracting text:', error)
      setError('Failed to extract text from image')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedImage || !extractedText) return

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/conversation/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: extractedText
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate conversation starters')
      }

      const { data } = await response.json()
      setStarters(data.lines)
      
    } catch (error) {
      console.error('Error generating starters:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate conversation starters')
    } finally {
      setLoading(false)
    }
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
            Get Conversation Starters
          </h1>
          <p 
            className="text-xl text-gray-400"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Upload a screenshot and let AI craft the perfect opener
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-8 border border-gray-700">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded"
                    />
                    <button
                      onClick={() => {
                        setSelectedImage(null)
                        setImagePreview(null)
                        setExtractedText('')
                        setError('')
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <svg className="h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                      </svg>
                    </div>
                    <div 
                      className="text-gray-300"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      <label htmlFor="image-upload" className="relative cursor-pointer">
                        <span className="text-purple-400 hover:text-purple-300 transition-colors">Upload a screenshot</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-center p-2 bg-red-900/50 rounded-lg border border-red-700">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-white bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              </div>
            )}

            {selectedImage && !loading && (
              <button
                onClick={handleSubmit}
                className="w-full flex justify-center py-3 px-4 rounded-md bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-medium transition-all duration-300 transform hover:scale-105 hover:from-blue-500 hover:via-purple-600 hover:to-pink-600"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Generate Starters
              </button>
            )}

            {starters.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 
                  className="text-xl font-medium text-gray-200 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Conversation Starters:
                </h3>
                <div className="grid gap-4">
                  {starters.map((starter, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/50 backdrop-blur-lg rounded-lg p-6 border border-gray-600 hover:border-purple-500 transition-colors duration-200"
                    >
                      <p 
                        className="text-gray-200 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {starter}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(starter)
                        }}
                        className="inline-flex items-center px-3 py-1 rounded-md bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors duration-200"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Conversation