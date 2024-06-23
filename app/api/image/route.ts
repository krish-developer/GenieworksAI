import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import Prompt from "@/lib/models/prompt.model";
import connectToDB from "@/lib/mongoose";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const imagesPrompts = await Prompt.find({
      userId,
      type: "Image",
    })
      .sort({ createdAt: "asc" })
      .select(["prompt", "images"]);

    return NextResponse.json(imagesPrompts);
  } catch (error: any) {
    console.log("[FETCH_IMAGE_ERROR] :>>", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
