import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { XIcon, UploadIcon, ImageIcon, VideoIcon, MusicIcon, FileIcon, CheckIcon, Trash2Icon, TagIcon, FolderIcon } from 'lucide-react';
type MediaUploaderProps = {
  onClose: () => void;
  onUpload: (files: File[]) => void;
  albums: any[];
};
export const MediaUploader = ({
  onClose,
  onUpload,
  albums
}: MediaUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': []
    }
  });
  // Remove a file from the selected files
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (currentTag.trim() && !tags.includes(currentTag.trim())) {
        setTags(prev => [...prev, currentTag.trim()]);
        setCurrentTag('');
      }
    }
  };
  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        onUpload(selectedFiles);
      }
    }, 300);
  };
  // Get file type icon
  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <VideoIcon className="h-6 w-6 text-red-500" />;
    } else if (file.type.startsWith('audio/')) {
      return <MusicIcon className="h-6 w-6 text-purple-500" />;
    } else {
      return <FileIcon className="h-6 w-6 text-gray-500" />;
    }
  };
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  return <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Upload Media</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit}>
            {/* Drop zone */}
            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <UploadIcon className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-700 font-medium">
                  {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select files'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: Images, Videos, Audio
                </p>
              </div>
            </div>
            {/* Selected files */}
            {selectedFiles.length > 0 && <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Selected Files ({selectedFiles.length})
                </h3>
                <div className="space-y-3">
                  {selectedFiles.map((file, index) => <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        {getFileTypeIcon(file)}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button type="button" className="text-gray-400 hover:text-red-500" onClick={() => removeFile(index)}>
                        <Trash2Icon className="h-5 w-5" />
                      </button>
                    </div>)}
                </div>
              </div>}
            {/* Album selection */}
            <div className="mt-6">
              <label htmlFor="album" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <FolderIcon className="h-4 w-4 mr-1 text-gray-500" />
                  Add to Album (Optional)
                </div>
              </label>
              <select id="album" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={selectedAlbum} onChange={e => setSelectedAlbum(e.target.value)}>
                <option value="">Select an album</option>
                {albums.map(album => <option key={album.id} value={album.id}>
                    {album.name}
                  </option>)}
              </select>
            </div>
            {/* Tags */}
            <div className="mt-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <TagIcon className="h-4 w-4 mr-1 text-gray-500" />
                  Tags (Optional)
                </div>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => <div key={index} className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                    <span>{tag}</span>
                    <button type="button" className="ml-1 text-indigo-600 hover:text-indigo-800" onClick={() => removeTag(tag)}>
                      <XIcon className="h-3 w-3" />
                    </button>
                  </div>)}
              </div>
              <div className="flex">
                <input type="text" id="tags" placeholder="Add tags (press Enter or comma to add)" className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={currentTag} onChange={e => setCurrentTag(e.target.value)} onKeyDown={handleTagInputKeyDown} />
                <button type="button" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-200" onClick={() => {
                if (currentTag.trim() && !tags.includes(currentTag.trim())) {
                  setTags(prev => [...prev, currentTag.trim()]);
                  setCurrentTag('');
                }
              }}>
                  Add
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Tags help others discover your media
              </p>
            </div>
            {/* Upload progress */}
            {isUploading && <div className="mt-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Uploading...
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{
                width: `${uploadProgress}%`
              }}></div>
                </div>
              </div>}
          </form>
        </div>
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 mr-2" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={`px-4 py-2 rounded-md text-sm font-medium ${selectedFiles.length === 0 || isUploading ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`} disabled={selectedFiles.length === 0 || isUploading} onClick={handleSubmit}>
            <div className="flex items-center">
              {isUploading ? <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>Uploading...</span>
                </> : <>
                  <UploadIcon className="h-4 w-4 mr-1" />
                  <span>
                    Upload {selectedFiles.length}{' '}
                    {selectedFiles.length === 1 ? 'File' : 'Files'}
                  </span>
                </>}
            </div>
          </button>
        </div>
      </div>
    </div>;
};