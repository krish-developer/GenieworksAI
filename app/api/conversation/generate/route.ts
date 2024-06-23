import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import OpenAI, { ClientOptions } from "openai";

import {
  checkFreeTrialAvailability,
  checkSubscription,
  incrementFreeTrialCount,
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
    const { prompt } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!openAIOptions.apiKey)
      return new NextResponse("OpenAI API not found", { status: 503 });
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

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const sanitizedResponse = {
      prompt: prompt,
      response: response.choices[0].message.content,
    };

    //************ Commented the below code for production. Uncomment to make unlimited generations functional for Pro user */
    // !isProUser && (await incrementFreeTrialCount());

    await incrementFreeTrialCount();

    await Prompt.create({
      userId: userId,
      type: "Conversation",
      ...sanitizedResponse,
    });

    return NextResponse.json(sanitizedResponse);
  } catch (error: any) {
    console.log("[GENERATE_CONVERSATION_ERROR] :>>", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
