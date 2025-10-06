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

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });

    // Extract file paths
    const files = response.data.tree.map((item: TreeItem) => item.path);

    // Detect Dockerfiles (case-insensitive)
    const dockerFiles = files.filter((file: string) =>
      /dockerfile/i.test(file) || file.endsWith(".dockerfile")
    );

    // Detect CI/CD-related files
    const ciCdFiles = files.filter((file: string) =>
      file.includes(".github/workflows") || file.includes("Jenkinsfile")
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
      Analyze this GitHub repository based on the structured data provided below.
      Provide a concise summary and key recommendations for building an optimal CI/CD pipeline.
      
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
      geminiAnalysis: geminiAnalysis,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch repo or analyze with AI" },
      { status: 500 }
    );
  }
}
