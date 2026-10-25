"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";

interface LogoUploadProps {
  logo?: string | FormData ;
  organizationName: string;
  onUpload: (file: File) => Promise<void>;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  logo,
  organizationName,
  onUpload,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      await onUpload(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-32 h-32 group"
    >
      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/10">
        {logo ? (
          <Image
            height={128}
            width={128}
            src={typeof logo === 'string' ? logo : '/default-logo.png'}
            alt={organizationName}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </label>
        </div>
      </div>
    </motion.div>
  );
};