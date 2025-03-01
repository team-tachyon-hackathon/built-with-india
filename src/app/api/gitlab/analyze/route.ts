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
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

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

    // DEEPSEEK usage for analysis
    const deepSeekResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "user",
            content: `Analyze this GitLab repo and provide insights:
            ${JSON.stringify(analysisData, null, 2)}`,
          },
        ],
        top_p: 0.99,
        temperature: 0.63,
        frequency_penalty: 0,
        presence_penalty: 0,
        repetition_penalty: 1,
        top_k: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      ...analysisData,
      deepSeekAnalysis: deepSeekResponse.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch repo or analyze with AI" },
      { status: 500 }
    );
  }
}
