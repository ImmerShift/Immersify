import React, { useState } from 'react';
import { api } from '@/api/client'; // Updated import
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Loader2, Image as ImageIcon } from 'lucide-react';

export default function LogoUploader({ value, onChange, label }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Calls your new Replit Backend
      const { file_url } = await api.files.upload({ file });
      onChange(file_url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{label}</Label>

      {value ? (
        <div className="relative inline-block group">
          <img 
            src={value} 
            alt="Uploaded logo" 
            className="h-32 w-auto object-contain border rounded-lg p-2 bg-white shadow-sm"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-primary hover:bg-orange-50 transition-colors bg-slate-50/50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">Click to upload logo</p>
                <p className="text-xs text-slate-400">PNG, JPG, SVG (max 5MB)</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}