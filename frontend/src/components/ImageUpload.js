import {
  AlertCircle,
  Camera,
  CheckCircle,
  Loader,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import axios from "../config/axios";

const ImageUpload = ({ onUploadSuccess, onError }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      onError(
        "Jenis file tidak valid. Pilih gambar JPEG, PNG, GIF, atau WebP."
      );
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      onError("File terlalu besar. Pilih gambar yang lebih kecil dari 5MB.");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      onError("Silakan pilih gambar terlebih dahulu");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post("/upload/classify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        onUploadSuccess(response.data.data);
        clearSelection();
      } else {
        onError(response.data.message || "Upload gagal");
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response) {
        // Server responded with error status
        const message =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
        onError(message);
      } else if (error.request) {
        // Network error
        onError("Kesalahan jaringan. Periksa koneksi internet Anda.");
      } else {
        // Other error
        onError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Camera className="w-6 h-6" />
            Upload & Klasifikasi Sampah
          </h2>
          <p className="text-green-100 mt-2">
            Upload foto sampah dan AI kami akan mengklasifikasikannya untuk Anda
          </p>
        </div>

        <div className="p-6">
          {/* File Selection Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all
              ${
                dragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }
              ${selectedFile ? "border-green-500 bg-green-50" : ""}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {preview ? (
              // Preview Selected Image
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full max-h-64 rounded-lg shadow-md"
                  />
                  <button
                    onClick={clearSelection}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedFile?.name}</p>
                  <p>{(selectedFile?.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ) : (
              // Upload Area
              <div className="space-y-4">
                <div className="text-gray-400">
                  <Upload className="w-12 h-12 mx-auto mb-4" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Seret dan letakkan gambar di sini
                  </p>
                  <p className="text-gray-500 mb-4">atau</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Pilih File
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  Format yang didukung: JPEG, PNG, GIF, WebP (maks 5MB)
                </div>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Upload Button */}
          {selectedFile && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`
                  px-8 py-3 rounded-lg font-medium transition-all
                  ${
                    uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 transform hover:scale-105"
                  }
                  text-white flex items-center gap-2
                `}
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Mengklasifikasi...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Klasifikasi Sampah
                  </>
                )}
              </button>
            </div>
          )}

          {/* Upload Tips */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Tips untuk hasil terbaik:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ambil foto yang jelas dan terang</li>
              <li>• Fokus pada satu item sampah</li>
              <li>• Hindari latar belakang yang berantakan</li>
              <li>• Pastikan sampah terlihat dengan jelas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
