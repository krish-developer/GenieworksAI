import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import OpenAI, { ClientOptions } from "openai";

import {
  checkFreeTrailAvailability,
  checkSubscription,
  incrementFreeTrailCount,
} from "@/lib/actions";
import Prompt from "@/lib/models/prompt.model";

const openAIOptions: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY || "",
};

const openai = new OpenAI(openAIOptions);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "256x256" } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!openAIOptions.apiKey)
      return new NextResponse("OpenAI API not found", { status: 503 });
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

    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: amount,
      size: resolution,
    });

    const sanitizedResponse = {
      prompt: prompt,
      images: response.data.map((img) => img.url),
    };

    //************ Commented the below code for production. Uncomment to make unlimited generations functional for Pro user */
    // !isProUser && (await incrementFreeTrailCount());

    await incrementFreeTrailCount();

    await Prompt.create({
      userId: userId,
      type: "Image",
      ...sanitizedResponse,
    });

    return NextResponse.json(sanitizedResponse);
  } catch (error: any) {
    console.log("[GENERATE_IMAGE_ERROR] :>>", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
