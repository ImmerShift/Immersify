import React, { useState } from 'react';
import { api } from '@/api/client'; // Updated import
import { X, Loader2, Image } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function ImageUploader({ label, value, onChange, placeholder = "Click to upload image" }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await api.files.upload({ file });
      onChange(file_url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div>
      {label && <Label className="text-sm font-medium mb-2 block">{label}</Label>}

      {value ? (
        <div className="relative group">
          <img 
            src={value} 
            alt="Uploaded" 
            className="w-full h-32 object-cover rounded-lg border bg-slate-50"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-primary hover:bg-orange-50 transition-colors bg-white">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
              <span className="text-sm text-slate-500">Uploading...</span>
            </>
          ) : (
            <>
              <Image className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-sm text-slate-500">{placeholder}</span>
            </>
          )}
        </label>
      )}
    </div>
  );
}