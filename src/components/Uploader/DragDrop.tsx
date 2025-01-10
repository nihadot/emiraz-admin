import React from 'react'
import Compressor from 'compressorjs'
import { errorToast } from '../Toast';

type Props = {
  onImageProcessed: (image: Blob) => void; // Prop to handle the processed image
}

function DragDrop({ onImageProcessed }: Props) {

  // Function to handle the file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if(!file){
      return true;
    }

    if (!file.type.startsWith('image/')) {
        errorToast('Only image files are allowed');
        return;
      }

      
    if (file) {
      // Check if file size is greater than 500KB
      if (file.size > 500 * 1024) {
        errorToast('File size is too large. Compressing...')
        // Compress the file
        new Compressor(file, {
          quality: 0.8, // You can adjust the quality here
          maxWidth: 800, // Resize the image if needed
          maxHeight: 800,
          success(result) {
            convertToWebP(result)
          },
          error(err) {
            errorToast('Compression failed: ' + err.message)
          },
        })
      } else {
        // If file size is within limit, convert directly to WebP
        convertToWebP(file)
      }
    }
  }

  // Function to convert image to WebP format using Canvas
  const convertToWebP = (image: File | Blob) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (ctx) {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          // Convert the image to WebP format
          canvas.toBlob((blob) => {
            if (blob) {
              onImageProcessed(blob) // Pass the WebP image as a prop
            }
          }, 'image/webp')
        }
      }
    }

    reader.readAsDataURL(image)
  }

  return (
    <div className="flex items-center justify-center w-full max-w-[360px] h-[192px]">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, JPEG or WebP (MAX. SIZE 500KB)</p>
        </div>
        <input accept="image/*" id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  )
}

export default DragDrop
