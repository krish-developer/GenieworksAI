import Subscription from "@/lib/models/subscription.model";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_KEY!
    );
  } catch (error: any) {
    return new NextResponse("Stripe Webhook Error", { status: 500 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type == "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId)
      return new NextResponse("No user id provided", { status: 400 });

    await Subscription.create({
      userId: session.metadata.userId,
      stripeId: subscription.customer as string,
      subscriptionId: subscription.id,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await Subscription.findOneAndUpdate(
      { subscriptionId: subscription.id },
      {
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      }
    );
  }

  return new NextResponse(null, { status: 200 });
}
