import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Replicate from "replicate";

import {
  checkFreeTrialAvailability,
  checkSubscription,
  incrementFreeTrialCount,
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
    // const isFreeTrailAvailable = await checkFreeTrialAvailability();
    // const isProUser = await checkSubscription();

    // if (!isFreeTrailAvailable && !isProUser) {
    //   return new NextResponse("Free trails exhausted", { status: 403 });
    // }

    const isFreeTrailAvailable = await checkFreeTrialAvailability();
    if (!isFreeTrailAvailable)
      return new NextResponse("Out of free trials", { status: 403 });

    const response: any = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      { input: { prompt_a: prompt } }
    );

    const sanitizedResponse = {
      prompt: prompt,
      media: response.audio,
    };

    //************ Commented the below code for production. Uncomment to make unlimited generations functional for Pro user */
    // !isProUser && (await incrementFreeTrialCount());

    await incrementFreeTrialCount();

    await Prompt.create({
      userId: userId,
      type: "Music",
      ...sanitizedResponse,
    });

    return NextResponse.json(sanitizedResponse);
  } catch (error: any) {
    console.log("[GENERATE_MUSIC_ERROR] :>>", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
