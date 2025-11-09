import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-toastify';

interface ImageUploaderProps {
  label?: string;
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  onRemove?: () => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = 'Upload Image',
  onUploadComplete,
  currentImage,
  onRemove,
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    // Get Cloudinary config from environment variables or use defaults
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onUploadComplete(url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-dark-200 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-dark-700"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleClick}
                className="p-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-colors"
                disabled={isUploading}
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className={cn(
              'w-full h-48 border-2 border-dashed border-dark-700 rounded-lg',
              'flex flex-col items-center justify-center gap-2',
              'hover:border-primary-500 hover:bg-dark-900/50 transition-all',
              'text-dark-400 hover:text-dark-200',
              isUploading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8" />
                <span className="text-sm">Click to upload image</span>
                <span className="text-xs text-dark-500">PNG, JPG up to 5MB</span>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};
