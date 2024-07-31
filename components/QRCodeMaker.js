import { useState, useEffect } from 'react'
import { FaQrcode, FaLink, FaFont, FaAddressCard, FaEnvelope, FaPhone, FaPalette, FaChevronDown, FaChevronUp, FaUndo } from 'react-icons/fa'
import CustomizeDesign from './CustomizeDesign'
import QRCodeModal from './QRCodeModal'
import { useDarkMode } from '../contexts/DarkModeContext'

export default function QRCodeMaker() {
  const [contentType, setContentType] = useState('URL')
  const [input, setInput] = useState('https://github.com/nesaranaeem')
  const [contactInfo, setContactInfo] = useState({
    name: 'John Doe',
    phone: '+1234567890',
    email: 'johndoe@example.com',
    address: '123 Main St, City, Country'
  })
  const [qrSize, setQrSize] = useState(256)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [showCustomize, setShowCustomize] = useState(false)
  const [qrOptions, setQrOptions] = useState({
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    logoImage: null,
    value: '',
    size: 256
  })

  useEffect(() => {
    if (contentType === 'Contact') {
      setInput(JSON.stringify(contactInfo))
    } else if (contentType === 'Email') {
      setInput('example@email.com')
    } else if (contentType === 'Phone') {
      setInput('+1234567890')
    } else if (contentType === 'URL') {
      setInput('https://github.com/nesaranaeem')
    } else if (contentType === 'Text') {
      setInput('')
    }
  }, [contentType])

  useEffect(() => {
    if (contentType === 'Contact') {
      setInput(JSON.stringify(contactInfo))
    }
  }, [contentType, contactInfo])

  const resetQrOptions = () => {
    setQrOptions({
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      logoImage: null
    })
  }

  const validateInput = () => {
    setError('')
    switch (contentType) {
      case 'URL':
        try {
          new URL(input)
        } catch {
          setError('Invalid URL format')
          return false
        }
        break
      case 'Email':
        if (!input.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
          setError('Invalid email format')
          return false
        }
        break
      case 'Phone':
        if (!/^\+?[\d\s-]{10,}$/.test(input)) {
          setError('Invalid phone number format')
          return false
        }
        break
      case 'Contact':
        const { name, phone, email, address } = contactInfo
        if (!name || !phone || !email || !address) {
          setError('All contact fields are required')
          return false
        }
        if (!email.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError('Invalid email format in contact information')
          return false
        }
        break
    }
    return true
  }

  const generateQR = () => {
    if (validateInput()) {
      setQrOptions(prevOptions => ({
        ...prevOptions,
        value: contentType === 'Contact' ? JSON.stringify(contactInfo) : input,
        size: qrSize
      }))
      setIsModalOpen(true)
    }
  }

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code')
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream')
      let downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = 'qrcode.png'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const copyToClipboard = () => {
    const canvas = document.getElementById('qr-code')
    if (canvas) {
      canvas.toBlob(function(blob) {
        navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]).then(() => {
          alert('QR Code copied to clipboard!')
        }).catch(err => {
          console.error('Error copying QR code: ', err)
        })
      })
    }
  }

  const renderInputField = () => {
    switch (contentType) {
      case 'URL':
      case 'Email':
      case 'Phone':
        return (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter ${contentType.toLowerCase()}`}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        )
      case 'Text':
        return (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="4"
          />
        )
      case 'Contact':
        return (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              value={contactInfo.name}
              onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
              <select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="URL"><FaLink className="inline mr-2" /> URL</option>
                <option value="Text"><FaFont className="inline mr-2" /> Text</option>
                <option value="Contact"><FaAddressCard className="inline mr-2" /> Contact Information</option>
                <option value="Email"><FaEnvelope className="inline mr-2" /> Email</option>
                <option value="Phone"><FaPhone className="inline mr-2" /> Phone Number</option>
              </select>
            </div>
            <div className="mb-4">
              {renderInputField()}
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button
              onClick={generateQR}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            >
              <FaQrcode className="mr-2" /> Generate QR Code
            </button>
            <div className="mt-4">
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">QR Code Size: {qrSize}x{qrSize}</label>
              <input
                id="size"
                type="range"
                min="128"
                max="512"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Customize Design</h3>
              <CustomizeDesign qrOptions={qrOptions} setQrOptions={setQrOptions} />
            </div>
          </div>
        </div>
      </div>
      <QRCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        qrCodeOptions={qrOptions}
        downloadQR={downloadQR}
        copyToClipboard={copyToClipboard}
      />
    </div>
  )
}
