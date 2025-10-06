import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface TreeItem {
  path: string;
  type: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const GITLAB_TOKEN = process.env.GITLAB_ACCESS_TOKENS;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(owner)}%2F${encodeURIComponent(repo)}/repository/tree?recursive=true`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${GITLAB_TOKEN}` },
    });

    // Extract file paths
    const files = response.data.map((item: TreeItem) => item.path);

    // Detect Dockerfiles (case-insensitive)
    const dockerFiles = files.filter((file: string) =>
      /dockerfile/i.test(file) || file.endsWith(".dockerfile")
    );

    // Detect CI/CD-related files
    const ciCdFiles = files.filter((file: string) =>
      file.includes(".gitlab-ci.yml") || file.includes("Jenkinsfile")
    );

    const packageManager = files.includes("package.json")
      ? "npm/yarn (Node.js)"
      : files.includes("requirements.txt")
      ? "pip (Python)"
      : files.includes("pom.xml")
      ? "Maven (Java)"
      : files.includes("build.gradle")
      ? "Gradle (Java)"
      : "Unknown";

    const hasDockerfile = dockerFiles.length > 0;
    const hasCiCdConfig = ciCdFiles.length > 0;

    const analysisData = {
      repo: `${owner}/${repo}`,
      filesCount: files.length,
      dockerFiles,
      ciCdFiles,
      packageManager,
      hasDockerfile,
      hasCiCdConfig,
    };


    const prompt = `
      Analyze this GitLab repository based on the structured data provided below.
      Provide a concise summary and key recommendations for building an optimal CI/CD pipeline.
      Focus on suggesting best practices and suitable stages given the detected environment.
      
      ANALYSIS DATA:
      ${JSON.stringify(analysisData, null, 2)}
    `;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.63,
          maxOutputTokens: 2048
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      throw new Error(`Gemini API error during analysis: ${geminiResponse.status} ${JSON.stringify(errorData)}`);
    }

    const geminiData = await geminiResponse.json();
    const geminiAnalysis = geminiData.candidates[0].content.parts[0].text;

    return NextResponse.json({
      ...analysisData,
      geminiAnalysis: geminiAnalysis, // Renamed key to geminiAnalysis for consistency
    });
  } catch (error: any) {
    console.error("Error:", error);
    // Handle specific GitLab access issues if possible
    let errorMessage = "Failed to fetch repo or analyze with AI";
    if (error.response?.status === 404) {
        errorMessage = "GitLab Repository not found. Please check the owner/project name.";
    } else if (error.response?.status === 403) {
        errorMessage = "Access forbidden. Ensure the GITLAB_ACCESS_TOKENS is valid and has read_repository scope.";
    } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. The repository might be too large.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
