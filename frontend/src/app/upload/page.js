"use client";

import { useState } from "react";
import axios from "axios";

export default function UploadPage() {

  const [file, setFile] = useState(null);

  const [analysis, setAnalysis] = useState("");

  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {

    if (!file) {

      alert("Please select a file");

      return;
    }

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("file", file);

      const uploadResponse = await axios.post(
        "http://127.0.0.1:8000/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

        console.log(uploadResponse.data);

        const resumeId = uploadResponse.data.id || uploadResponse.data.resume_id;

        console.log("Resume ID:", resumeId);

        
        

      const analysisResponse = await axios.post(
        `http://127.0.0.1:8000/resume/analyze/${resumeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(
        analysisResponse.data.llm_analysis
      );

    } catch (error) {

      console.log(error);

      alert("Upload failed");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold mb-2">
        Resume Analysis
      </h1>

      <p className="text-zinc-400 mb-8">
        Upload your resume and get AI-powered feedback
      </p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl">

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-6"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
        >
          {
            loading
            ? "Analyzing..."
            : "Upload Resume"
          }
        </button>

        {
          analysis && (

            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-4">
                AI Analysis
              </h2>

              <div className="bg-zinc-800 p-6 rounded-xl whitespace-pre-wrap text-zinc-300">
                {analysis}
              </div>

            </div>
          )
        }

      </div>

    </div>
  );
}