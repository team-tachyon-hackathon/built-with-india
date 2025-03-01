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

  const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(owner)}%2F${encodeURIComponent(repo)}/repository/tree?recursive=true`;
  const GITLAB_TOKEN = process.env.GITLAB_ACCESS_TOKEN;

  try {
    const response = await axios.get(url, {
      headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
    });

    const files = response.data
      .filter((item: TreeItem) => item.type === "blob")
      .map((item: TreeItem) => item.path);

    return NextResponse.json({ files });
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ error: "Failed to fetch repo files" }, { status: 500 });
  }
}
