"use client";

import { useState } from "react";

type Props = {
  jobId: string;
  onUploadComplete: () => void;
};

export default function ResumeUpload({ jobId, onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    // convert PDF to base64
    const base64 = await toBase64(file);

    // send to our API
    const response = await fetch("/api/parse-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, base64, filename: file.name }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(`✅ Resume parsed — ${data.name} added as applicant`);
      onUploadComplete();
    } else {
      setMessage(`❌ ${data.error}`);
    }

    setUploading(false);
  }

  function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // remove the data:application/pdf;base64, prefix
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        Upload Resume
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Upload a PDF resume — AI will extract the candidate info automatically
      </p>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-8 px-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
        <span className="text-3xl mb-2">📄</span>
        <span className="text-sm font-medium text-gray-600">
          {uploading ? "AI is reading the resume..." : "Click to upload PDF resume"}
        </span>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFile}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {message && (
        <p className="mt-3 text-sm font-medium text-gray-700">{message}</p>
      )}
    </div>
  );
}