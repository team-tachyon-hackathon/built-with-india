"use client";

import { useState } from "react";
import axios from "axios";

interface Analysis {
  repo: string;
  filesCount: number;
  dockerFiles: string[];
  ciCdFiles: string[];
  packageManager: string;
  hasDockerfile: boolean;
  hasCiCdConfig: boolean;
  message: string;
  deepSeekAnalysis?: string;
}

export default function Home() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeRepo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/github/analyze`, {
        params: { owner, repo },
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing repo", error);
      setAnalysis({ 
        repo: "",
        filesCount: 0,
        dockerFiles: [],
        ciCdFiles: [],
        packageManager: "Unknown",
        hasDockerfile: false,
        hasCiCdConfig: false,
        message: "Error fetching data"
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">GitHub Repo Analyzer</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="GitHub Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="border p-2 m-2 rounded"
        />
        <input
          type="text"
          placeholder="Repository Name"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          className="border p-2 m-2 rounded"
        />
        <button
          onClick={analyzeRepo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze Repo"}
        </button>
      </div>

      {analysis && (
        <div className="mt-4 p-4 border bg-gray-100 rounded w-2/3">
          <h2 className="text-xl font-bold">Analysis Result</h2>
          <p><strong>Repository:</strong> {analysis.repo}</p>
          <p><strong>Total Files:</strong> {analysis.filesCount}</p>
          <p><strong>Package Manager:</strong> {analysis.packageManager}</p>
          <p><strong>Has Dockerfile?</strong> {analysis.hasDockerfile ? "Yes" : "No"}</p>
          <p><strong>Has CI/CD Config?</strong> {analysis.hasCiCdConfig ? "Yes" : "No"}</p>

          {analysis.dockerFiles.length > 0 && (
            <>
              <h3 className="font-semibold mt-2">Dockerfiles</h3>
              <ul>
                {analysis.dockerFiles.map((file: string, index: number) => (
                  <li key={index} className="text-blue-600">{file}</li>
                ))}
              </ul>
            </>
          )}

          {analysis.ciCdFiles.length > 0 && (
            <>
              <h3 className="font-semibold mt-2">CI/CD Config Files</h3>
              <ul>
                {analysis.ciCdFiles.map((file: string, index: number) => (
                  <li key={index} className="text-green-600">{file}</li>
                ))}
              </ul>
            </>
          )}

          {/* Display DeepSeek AI Analysis */}
          {analysis.deepSeekAnalysis && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">DeepSeek AI Analysis</h3>
              <p className="italic">{analysis.deepSeekAnalysis}</p>
            </div>
          )}

          <p className="mt-4 font-bold">{analysis.message}</p>
        </div>
      )}
    </div>
  );
}
