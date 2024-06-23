import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import Prompt from "@/lib/models/prompt.model";
import connectToDB from "@/lib/mongoose";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const videoPrompts = await Prompt.find({
      userId,
      type: "Video",
    })
      .sort({ createdAt: "asc" })
      .select(["prompt", "media"]);

    return NextResponse.json(videoPrompts);
  } catch (error: any) {
    console.log("[FETCH_VIDEO_ERROR] :>>", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
