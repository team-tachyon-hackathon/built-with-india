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

  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });

    const files = response.data.tree
      .filter((item: TreeItem) => item.type === "blob")
      .map((item: TreeItem) => item.path);

    return NextResponse.json({ files });
  } catch (error) {
console.error(error);
    return NextResponse.json({ error: "Failed to fetch repo files" }, { status: 500 });
  }
}
