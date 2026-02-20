// components/ui/ImageUpload.jsx
"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { FiUploadCloud, FiTrash2, FiX } from "react-icons/fi";
import clsx from "clsx";
import { uploadRequest } from "@/app/config/axios.config";

/**
 * Props:
 * - value: current image URL (string | null)
 * - onChange: (url | null) => void  // call with uploaded URL or null when removed
 * - uploadUrl: string (default '/upload') // server endpoint accepting multipart/form-data file
 * - maxSizeMB: number (default 5)
 * - accept: string (default 'image/*')
 */
export default function ImageUpload({
  value = null,
  onChange,
  uploadUrl = "/attachments/upload",
  maxSizeMB = 5,
  accept = "image/*",
}: {
  value?: string | null;
  onChange: (url: string | null) => any;
  uploadUrl?: string;
  maxSizeMB?: number;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const resetState = () => {
    setPreview(null);
    setProgress(0);
    setUploading(false);
    setError("");
  };

  const handleFiles = useCallback(
    async (file: File) => {
      setError("");
      if (!file) return;

      const sizeMB = file.size / 1024 / 1024;
      if (sizeMB > maxSizeMB) {
        setError(`File is too large. Max ${maxSizeMB} MB allowed.`);
        return;
      }

      // Show local preview
      const reader = new FileReader();
      reader.onload = (e: any) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // Upload to server
      try {
        setUploading(true);
        setProgress(0);
        const formData = new FormData();
        formData.append("file", file);

        const upload = await uploadRequest.post(uploadUrl, formData);
        //    console.log(upload?.data?.url)
        if (!upload) {
          // If server returns full object, try to find url property
          setError("Upload succeeded but server response missing file URL.");
          onChange?.(null);
          setUploading(false);
          return;
        }

        setProgress(100);
        onChange?.(upload.data.url);
        setUploading(false);
      } catch (err) {
        console.error(err);
        setError("Upload failed. Try again.");
        onChange?.(null);
        setUploading(false);
      }
    },
    [maxSizeMB, onChange, uploadUrl]
  );

  const onDrop = (e: any) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFiles(file);
  };

  const onSelect = (e: any) => {
    const file = e.target.files?.[0];
    handleFiles(file);
  };

  const openFileDialog = () => inputRef.current?.click();

  const removeImage = () => {
    resetState();
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Image
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={clsx(
          "relative rounded-lg border-dashed border-2 p-4 flex items-center justify-center",
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 bg-white hover:border-gray-300",
          "transition"
        )}
        style={{ minHeight: 160 }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
            <div className="relative z-10 w-full flex items-end justify-between p-3">
              <div className="bg-black/40 text-white rounded px-2 py-1 text-xs">
                Preview
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="bg-white/70 backdrop-blur-sm hover:bg-white/90 px-3 py-1 rounded shadow text-sm flex items-center gap-2"
                >
                  <FiUploadCloud />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={removeImage}
                  className="bg-red-600 text-white px-3 py-1 rounded shadow text-sm flex items-center gap-2"
                >
                  <FiTrash2 />
                  Remove
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <FiUploadCloud className="mx-auto text-3xl text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag & drop an image here, or{" "}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-blue-600 underline"
              >
                browse
              </button>
            </p>
            <p className="mt-1 text-xs text-gray-400">
              JPG, PNG — max {maxSizeMB}MB
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onSelect}
          className="sr-only"
        />
      </div>

      {/* upload state */}
      <div className="mt-2 flex items-center justify-between gap-4">
        <div className="flex-1">
          {uploading && (
            <div className="w-full bg-gray-100 rounded h-2 overflow-hidden">
              <div
                className="h-2 bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        {value && !uploading && (
          <button
            type="button"
            onClick={() => {
              // show remove only (doesn't remove local preview)
              removeImage();
            }}
            className="ml-2 text-sm text-red-600 flex items-center gap-1"
          >
            <FiX />
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
