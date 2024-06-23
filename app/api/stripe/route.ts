import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import Subscription from "@/lib/models/subscription.model";
import { fetchUser } from "@/lib/actions";
import { stripe } from "@/lib/stripe";
import { absoluteURL } from "@/lib/utils";

const settingsURL = absoluteURL("/settings");

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const user = await fetchUser();

    if (!userId || !user)
      return new NextResponse("Unauthorized", { status: 401 });

    const userSubscription = await Subscription.findOne({ userId });

    if (userSubscription && userSubscription.stripeId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeId,
        return_url: settingsURL,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsURL,
      cancel_url: settingsURL,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "required",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: "GenieworksAI PRO",
              description: "Unlimited AI Generations",
            },
            unit_amount: 99900,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error: any) {
    console.log("[STRIPE_ERROR] :>>", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
