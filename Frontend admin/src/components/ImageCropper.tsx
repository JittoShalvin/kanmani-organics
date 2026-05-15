import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Scissors, RotateCcw, RotateCw, Maximize2, Square, RectangleHorizontal, Type } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

const ImageCropper = ({ image, onCropComplete, onCancel, aspectRatio = 1 }: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(aspectRatio);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: any) => {
    setCrop(crop);
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const updatePreview = useCallback(async (pixelCrop: any) => {
    if (!pixelCrop || !image) return;
    try {
      const img = await createImage(image);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const safeArea = Math.max(img.width, img.height) * 2;
      canvas.width = safeArea;
      canvas.height = safeArea;

      ctx.translate(safeArea / 2, safeArea / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-safeArea / 2, -safeArea / 2);

      ctx.drawImage(
        img,
        safeArea / 2 - img.width / 2,
        safeArea / 2 - img.height / 2
      );

      const data = ctx.getImageData(0, 0, safeArea, safeArea);

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.putImageData(data, -pixelCrop.x, -pixelCrop.y);
      
      setPreviewUrl(canvas.toDataURL('image/jpeg', 0.8));
    } catch (e) {
      console.error('Preview update failed', e);
    }
  }, [image, rotation]);

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
    updatePreview(croppedAreaPixels);
  }, [updatePreview]);

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0
  ): Promise<Blob | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    const rotRad = (rotation * Math.PI) / 180;
    const { x, y, width, height } = pixelCrop;

    canvas.width = width;
    canvas.height = height;

    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotRad);
    ctx.translate(-width / 2, -height / 2);

    ctx.drawImage(
      image,
      -x,
      -y
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleCropSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels, rotation);
      if (croppedBlob) {
        onCropComplete(croppedBlob);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
      >
        <div className="p-6 border-b border-border flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Scissors size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">Crop Product Photo</h2>
              <p className="text-[11px] text-muted-foreground font-medium">Adjust the image to fit perfectly</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-neutral-800 p-4 border-b border-white/5 flex justify-end px-8">
          <div className="flex items-center gap-2">
            <button onClick={() => setRotation(r => r - 90)} className="p-3 text-white/60 hover:bg-white/5 hover:text-white rounded-xl transition-all" title="Rotate Left">
              <RotateCcw size={20} />
            </button>
            <button onClick={() => setRotation(r => r + 90)} className="p-3 text-white/60 hover:bg-white/5 hover:text-white rounded-xl transition-all" title="Rotate Right">
              <RotateCw size={20} />
            </button>
          </div>
        </div>

        <div className="relative flex-1 bg-neutral-950 min-h-[300px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={onCropChange}
            onRotationChange={setRotation}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={setZoom}
            showGrid={true}
            objectFit="cover"
          />
        </div>

        <div className="p-6 bg-white border-t border-border flex items-center gap-6">
          <div className="flex-1 space-y-2">
             <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Zoom Level</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{Math.round(zoom * 100)}%</span>
             </div>
             <div className="flex items-center gap-3">
               <input
                 type="range"
                 value={zoom}
                 min={1}
                 max={5}
                 step={0.01}
                 aria-labelledby="Zoom"
                 onChange={(e: any) => setZoom(parseFloat(e.target.value))}
                 className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
               />
               <button onClick={() => setZoom(1)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                 <RotateCcw size={16} />
               </button>
             </div>
          </div>

          <div className="w-px h-10 bg-border" />

          {previewUrl && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Result</span>
              <div 
                className="h-12 rounded-lg overflow-hidden border border-border shadow-sm"
                style={{ aspectRatio: aspect ? aspect : '1/1' }}
              >
                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
              </div>
            </div>
          )}

          <div className="flex gap-3 min-w-[250px]">
            <button
              onClick={onCancel}
              className="flex-1 py-4 rounded-xl border-2 border-border font-black text-muted-foreground hover:bg-secondary transition-all active:scale-95 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleCropSave}
              className="flex-[1.5] py-4 rounded-xl bg-primary text-white font-black shadow-xl hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95 text-xs"
            >
              <Check size={20} />
              <span>Apply Crop & Save</span>
            </button>
          </div>
        </div>

        {/* Removed redundant bottom controls since they are now in the sidebar */}
      </motion.div>
    </div>
  );
};

export default ImageCropper;
