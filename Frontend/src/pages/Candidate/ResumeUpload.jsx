import { CheckCircle, FileText, Upload, AlertCircle } from "lucide-react";
import Button from "./Button";
import { useRef, useState } from "react";
import { Card, CardContent } from "./Card";
import * as mammoth from 'mammoth';

export const ResumeUpload = ({ onComplete, userInfo }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    e.preventDefault();
    handleFiles(e.target.files);
  };

  // Extract text from PDF using PDF.js
  const extractTextFromPDF = async (file) => {
    try {
      // Load PDF.js from CDN
      const pdfjsLib = window.pdfjsLib || await loadPDFJS();
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF. Please try a different format or ensure the PDF is not password protected.');
    }
  };

  // Load PDF.js library dynamically
  const loadPDFJS = async () => {
    return new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        // Set worker source
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js library'));
      document.head.appendChild(script);
    });
  };

  // Extract text from different file types
  const extractTextFromFile = async (file) => {
    const fileType = file.type;
    
    if (fileType === 'text/plain') {
      // Handle plain text files
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    } 
    else if (fileType === 'application/pdf') {
      // Handle PDF files using PDF.js
      return await extractTextFromPDF(file);
    }
    else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
             fileType === 'application/msword') {
      // Handle Word documents using Mammoth
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        if (result.messages && result.messages.length > 0) {
          console.warn('Mammoth conversion warnings:', result.messages);
        }
        
        return result.value;
      } catch (error) {
        console.error('Mammoth extraction error:', error);
        throw new Error('Failed to extract text from Word document. Please try a different format.');
      }
    }
    else {
      throw new Error('Unsupported file type. Please use PDF, DOC, DOCX, or TXT files.');
    }
  };

  const uploadToBackend = async (file) => {
    try {
      setError(null);
      
      // Extract text from the file
      const extractedText = await extractTextFromFile(file);
      
      // Get user ID from URL
      const getUserIdFromURL = () => {
        const pathname = window.location.pathname;
        return pathname.split("/").pop() || 'demo123';
      };

      const userId = getUserIdFromURL();
      const baseURL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000/api';
      
      // Create payload with extracted text
      const payload = {
        resumeText: extractedText,
        fileName: file.name,
        fileType: file.type,
        userId: userId,
        positionId: userInfo?.position?._id || 'default-position',
        recruiterId: userInfo.recruiterId
      };

      console.log('Sending payload:', payload);

      // Get token if available
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseURL}/candidates/upload-resume-text/${userInfo.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return {
          name: result.data.candidate?.name || result.data.extractedData?.name || userInfo?.name || "Unknown",
          email: result.data.candidate?.email || result.data.extractedData?.email || userInfo?.email || "unknown@email.com",
          phone: result.data.candidate?.phone || result.data.extractedData?.phone || "+1 (555) 000-0000",
          experience: result.data.candidate?.experience || result.data.extractedData?.experience || "Not specified",
          skills: result.data.candidate?.skills?.map(s => s.name || s) || result.data.extractedData?.skills || ["JavaScript", "React"],
          extractedText: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : '') // Preview of extracted text
        };
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFiles = async (files) => {
    if (!files || !files[0]) return;

    const file = files[0];
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid resume file (PDF, DOC, DOCX, or TXT)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);
    
    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const candidateData = await uploadToBackend(file);
      
      // Complete progress
      setProgress(100);
      setCandidateInfo(candidateData);
      
      setTimeout(() => {
        setUploading(false);
        setUploaded(true);
        setTimeout(() => onComplete(candidateData), 800);
      }, 500);
      
    } catch (error) {
      clearInterval(progressInterval);
      setUploading(false);
      setError(error.message || 'Upload failed. Please try again.');
      setProgress(0);
    }
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRetry = () => {
    setError(null);
    setProgress(0);
    setUploaded(false);
    setCandidateInfo(null);
  };

  return (
    <Card className="transform transition-all duration-500 hover:scale-102">
      <CardContent className="p-10">
        {error ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-red-100/80 rounded-3xl flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-gray-900">Upload Failed</h3>
              <p className="text-red-600 text-lg">{error}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRetry} variant="outline">
                Try Again
              </Button>
              <Button onClick={handleButtonClick}>
                <FileText className="mr-2 h-5 w-5" />
                Choose Different File
              </Button>
            </div>
          </div>
        ) : !uploaded ? (
          <div>
            <div
              className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-500 transform ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50/50 scale-105 shadow-lg' 
                  : 'border-gray-300/50 hover:border-gray-400/70 hover:bg-gray-50/30'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto relative">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-blue-600 animate-bounce" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">Processing Resume</h3>
                    <p className="text-gray-600">Extracting text and analyzing your resume...</p>
                    <p className="text-xs text-gray-500">This may take a few seconds for PDF files</p>
                    
                    {/* Progress bar */}
                    <div className="w-full max-w-xs mx-auto">
                      <div className="bg-gray-200/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-300 ease-out rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{Math.round(progress)}% complete</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-gray-900">Upload Your Resume</h3>
                    <p className="text-gray-600 text-lg">Drag and drop your resume here, or click to browse</p>
                    <p className="text-sm text-gray-500 mt-3">Supports PDF, DOC, DOCX, TXT (max 5MB)</p>
                    <p className="text-xs text-amber-600 mt-2">Note: Text will be extracted and sent to the server</p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handleButtonClick}
                    className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`text-center space-y-6 transform transition-all duration-700 ${uploaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="w-20 h-20 mx-auto bg-green-100/80 rounded-3xl flex items-center justify-center transform transition-all duration-500 animate-bounce">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-gray-900">Resume Processed Successfully!</h3>
              <p className="text-gray-600 text-lg">Text extracted and interview questions generated</p>
            </div>
            {candidateInfo && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-left border border-gray-200/50 transform transition-all duration-500 hover:scale-102">
                <h4 className="font-semibold mb-4 text-lg text-gray-900">Extracted Information:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Name', value: candidateInfo.name },
                    { label: 'Email', value: candidateInfo.email },
                    { label: 'Experience', value: candidateInfo.experience },
                    { label: 'Key Skills', value: Array.isArray(candidateInfo.skills) ? candidateInfo.skills.join(', ') : candidateInfo.skills }
                  ].map((item, index) => (
                    <div key={index} className={`transform transition-all duration-500 delay-${index * 100}`} style={{ transitionDelay: `${index * 100}ms` }}>
                      <span className="font-medium text-gray-700 text-sm">{item.label}:</span>
                      <p className="text-gray-900 mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
                {candidateInfo.extractedText && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="font-medium text-gray-700 text-sm">Extracted Text Preview:</span>
                    <p className="text-gray-600 text-sm mt-1 bg-gray-50 p-3 rounded-lg">{candidateInfo.extractedText}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};