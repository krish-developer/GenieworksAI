import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Replicate from "replicate";

import {
  checkFreeTrailAvailability,
  checkSubscription,
  incrementFreeTrailCount,
} from "@/lib/actions";
import Prompt from "@/lib/models/prompt.model";

const replicate = new Replicate({
  auth: process.env.REPLICATEAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!prompt)
      return new NextResponse("Please provide prompt", { status: 400 });

    //************ Commented the below code for production. Uncomment to make unlimited generations functional for Pro user */
    // const isFreeTrailAvailable = await checkFreeTrailAvailability();
    // const isProUser = await checkSubscription();

    // if (!isFreeTrailAvailable && !isProUser) {
    //   return new NextResponse("Free trails exhausted", { status: 403 });
    // }

    const isFreeTrailAvailable = await checkFreeTrailAvailability();
    if (!isFreeTrailAvailable)
      return new NextResponse("Out of free trials", { status: 403 });

    const response: any = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      { input: { prompt } }
    );

    const sanitizedResponse = {
      prompt: prompt,
      media: response[0],
    };

    //************ Commented the below code for production. Uncomment to make unlimited generations functional for Pro user */
    // !isProUser && (await incrementFreeTrailCount());

    await incrementFreeTrailCount();

    await Prompt.create({
      userId: userId,
      type: "Video",
      ...sanitizedResponse,
    });

    return NextResponse.json(sanitizedResponse);
  } catch (error: any) {
    console.log("[GENERATE_VIDEO_ERROR] :>>", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
