import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import OpenAI, { ClientOptions } from "openai";

import {
  checkFreeTrailAvailability,
  checkSubscription,
  incrementFreeTrailCount,
} from "@/lib/actions";
import Prompt from "@/lib/models/prompt.model";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openAIOptions: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY || "",
};

const openai = new OpenAI(openAIOptions);

const instructionPrompt: ChatCompletionMessageParam = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
};

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
    // const isFreeTrailAvailable = await checkFreeTrailAvailability();
    // const isProUser = await checkSubscription();

    // if (!isFreeTrailAvailable && !isProUser) {
    //   return new NextResponse("Free trails exhausted", { status: 403 });
    // }

    const isFreeTrailAvailable = await checkFreeTrailAvailability();
    if (!isFreeTrailAvailable)
      return new NextResponse("Out of free trials", { status: 403 });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        instructionPrompt,
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
    // !isProUser && (await incrementFreeTrailCount());

    await incrementFreeTrailCount();

    await Prompt.create({
      userId: userId,
      type: "Code",
      ...sanitizedResponse,
    });

    return NextResponse.json(sanitizedResponse);
  } catch (error: any) {
    console.log("[GENERATE_CODE_ERROR] :>>", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
