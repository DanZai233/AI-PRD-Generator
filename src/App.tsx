import React, { useState, useRef } from 'react';
import { Upload, FileImage, X, Loader2, CheckCircle2, FileText, RefreshCw, Copy } from 'lucide-react';
import Markdown from 'react-markdown';
import { analyzeImage, generatePRD } from './lib/gemini';
import { cn } from './lib/utils';

interface UploadedImage {
  id: string;
  file: File;
  dataUrl: string;
  mimeType: string;
  analysis?: string;
}

type AppStatus = 'idle' | 'analyzing' | 'generating' | 'done' | 'error';

export default function App() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [currentAnalyzingIndex, setCurrentAnalyzingIndex] = useState(0);
  const [prd, setPrd] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processFiles = (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, {
            id: Math.random().toString(36).substring(7),
            file,
            dataUrl: e.target!.result as string,
            mimeType: file.type,
          }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const startGeneration = async () => {
    if (images.length === 0) return;
    
    setStatus('analyzing');
    setError('');
    setPrd('');
    
    const updatedImages = [...images];
    
    try {
      // Step 1: Analyze each image
      for (let i = 0; i < updatedImages.length; i++) {
        setCurrentAnalyzingIndex(i);
        const img = updatedImages[i];
        // Extract base64 part
        const base64Data = img.dataUrl.split(',')[1];
        const analysis = await analyzeImage(base64Data, img.mimeType);
        updatedImages[i].analysis = analysis;
        setImages([...updatedImages]); // Update state to show progress if needed
      }

      // Step 2: Generate PRD
      setStatus('generating');
      const analyses = updatedImages.map(img => img.analysis || '');
      const generatedPrd = await generatePRD(analyses);
      
      setPrd(generatedPrd);
      setStatus('done');
    } catch (err: any) {
      console.error('Error generating PRD:', err);
      setError(err.message || 'An error occurred during generation.');
      setStatus('error');
    }
  };

  const reset = () => {
    setImages([]);
    setStatus('idle');
    setPrd('');
    setError('');
    setCurrentAnalyzingIndex(0);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prd);
  };

  // Replace image placeholders with actual data URLs
  const renderPrd = () => {
    let processedPrd = prd;
    images.forEach((img, index) => {
      // Replace ![...](image_X) or ![...](image_X.png) with ![...](dataUrl)
      const regex = new RegExp(`\\]\\(\\s*image_${index}(?:\\.\\w+)?\\s*\\)`, 'gi');
      processedPrd = processedPrd.replace(regex, `](${img.dataUrl})`);
    });
    return processedPrd;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <FileText size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">AI PRD Generator</h1>
          </div>
          {status === 'done' && (
            <div className="flex items-center gap-3">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                <Copy size={16} />
                Copy Markdown
              </button>
              <button 
                onClick={reset}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <RefreshCw size={16} />
                Start Over
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {status === 'idle' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Turn Screenshots into PRDs
              </h2>
              <p className="text-slate-500 text-lg">
                Upload screenshots of your application. Our AI will analyze each screen in detail and synthesize a comprehensive Product Requirements Document.
              </p>
            </div>

            <div 
              className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer bg-white"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Upload size={28} />
              </div>
              <h3 className="text-lg font-medium mb-1">Click or drag images here</h3>
              <p className="text-slate-500 text-sm">Supports PNG, JPG, WEBP</p>
            </div>

            {images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-900">Uploaded Screenshots ({images.length})</h3>
                  <button 
                    onClick={startGeneration}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium shadow-sm transition-colors flex items-center gap-2"
                  >
                    Generate PRD
                    <FileText size={18} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={img.id} className="group relative aspect-[9/16] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                      <img src={img.dataUrl || undefined} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                          className="bg-white/20 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {(status === 'analyzing' || status === 'generating') && (
          <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-blue-600 text-white p-4 rounded-full shadow-lg">
                <Loader2 size={32} className="animate-spin" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">
                {status === 'analyzing' ? 'Analyzing Screenshots...' : 'Drafting PRD...'}
              </h3>
              <p className="text-slate-500">
                {status === 'analyzing' 
                  ? `Examining image ${currentAnalyzingIndex + 1} of ${images.length}`
                  : 'Synthesizing insights into a comprehensive document'}
              </p>
            </div>

            <div className="w-full max-w-md bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-500 ease-out"
                style={{ 
                  width: status === 'analyzing' 
                    ? `${((currentAnalyzingIndex) / images.length) * 50}%` 
                    : '85%' 
                }}
              ></div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-2xl mx-auto text-center space-y-4">
            <X size={48} className="mx-auto text-red-500 mb-2" />
            <h3 className="text-lg font-semibold">Generation Failed</h3>
            <p>{error}</p>
            <button 
              onClick={() => setStatus('idle')}
              className="bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}

        {status === 'done' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 md:p-12 prose prose-slate prose-blue max-w-none prose-img:rounded-xl prose-img:border prose-img:border-slate-200 prose-img:shadow-sm prose-headings:tracking-tight">
              <Markdown
                components={{
                  img: ({node, ...props}) => {
                    return <img {...props} src={props.src || undefined} alt={props.alt || ''} />;
                  }
                }}
              >
                {renderPrd()}
              </Markdown>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
