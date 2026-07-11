import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createApiHandler } from "@/lib/api-utils";

async function handlePost(request: NextRequest) {
  const body = await request.json();
  const { id, kind } = body;

  if (!id || !kind) {
    return NextResponse.json({ ok: false, error: "Missing id or kind" }, { status: 400 });
  }

  let updatedCount = 0;

  if (kind === "project") {
    const project = await prisma.labProject.update({
      where: { id },
      data: { likes: { increment: 1 } },
      select: { likes: true }
    });
    updatedCount = project.likes;
  } else if (kind === "article") {
    const article = await prisma.labArticle.update({
      where: { id },
      data: { likes: { increment: 1 } },
      select: { likes: true }
    });
    updatedCount = article.likes;
  } else {
    return NextResponse.json({ ok: false, error: "Invalid kind" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    likes: updatedCount
  });
}

export const POST = createApiHandler<any>(handlePost);
