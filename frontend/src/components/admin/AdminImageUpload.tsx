import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const AdminImageUpload: React.FC<AdminImageUploadProps> = ({
  images,
  onChange,
  maxImages = 6,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return;
      }

      // Read as base64 data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange([...images, event.target.result as string]);
          toast.success(`Image uploaded!`);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleAddUrl = () => {
    const url = prompt('Enter Image URL (e.g., /images/photos/... or https://...):');
    if (url && url.trim()) {
      onChange([...images, url.trim()]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Product Images ({images.length}/{maxImages})
        </label>
        <button
          type="button"
          onClick={handleAddUrl}
          className="text-xs font-semibold text-brand-teal hover:underline"
        >
          + Add Image URL
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="group relative aspect-square rounded-xl border border-neutral-200 overflow-hidden bg-neutral-100 flex items-center justify-center"
          >
            <img
              src={img}
              alt={`preview-${idx}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/keychains/spotify_nfc_keychain.png';
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 bg-brand-navy text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                Cover
              </span>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-brand-teal hover:bg-teal-50/20 transition-all flex flex-col items-center justify-center cursor-pointer p-2 text-center group"
          >
            <Upload className="w-5 h-5 text-neutral-400 group-hover:text-brand-teal transition-colors mb-1" />
            <span className="text-[11px] font-medium text-neutral-500 group-hover:text-brand-teal">
              Upload
            </span>
            <span className="text-[9px] text-neutral-400">JPG, PNG, WebP</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImageUpload;
