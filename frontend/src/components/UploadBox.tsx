import { useState, useCallback } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadBoxProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
}

export function UploadBox({ onFileSelect, accept = ".pdf,.png,.jpg,.jpeg" }: UploadBoxProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div 
      className={cn(
        "w-full border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer",
        isDragging ? "border-white bg-white/5" : "border-white/10 hover:border-white/20",
        file ? "border-green-500/50 bg-green-500/5 text-green-100" : ""
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input 
        id="file-upload"
        type="file" 
        className="hidden" 
        accept={accept}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />

      {file ? (
        <>
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-green-400 mt-1">Ready for upload</p>
          </div>
          <button 
            className="text-xs text-gray-500 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setFile(null); onFileSelect(null); }}
          >
            Remove file
          </button>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG (max. 10MB)</p>
          </div>
        </>
      )}
    </div>
  );
}
