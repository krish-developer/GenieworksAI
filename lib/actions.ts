"use server";

import { auth } from "@clerk/nextjs";
import connectToDB from "@/lib/mongoose";
import User, { IUser } from "@/lib/models/user.model";
import { MAX_FREE_TRIALS } from "@/constants";
import Subscription from "./models/subscription.model";
import fetch from 'node-fetch';

const CLERK_API_URL = "https://api.clerk.dev/v1";
const CLERK_API_KEY = process.env.CLERK_SECRET_KEY;

const fetchClerkUserDetails = async (clerkId: string) => {
  const response = await fetch(`${CLERK_API_URL}/users/${clerkId}`, {
    headers: {
      Authorization: `Bearer ${CLERK_API_KEY}`
    }
  });



  const user = await response.json();
  console.log("fetchClerkUserDetails ~ user:", user)
  return {
    email: user.email_addresses[0].email_address,
    name: `${user.first_name} ${user.last_name}`.trim()
  };
};

export const fetchUser = async (): Promise<IUser> => {
  try {
    await connectToDB();
    const { sessionClaims } = auth();
    console.log("fetchUser ~ sessionClaims:", sessionClaims);

    const clerkId = sessionClaims?.sub;

  

    let userDetails = await User.findOne({ clerkId });

    if (!userDetails) {
      const { email, name } = await fetchClerkUserDetails(clerkId);
      
      userDetails = await User.create({
        clerkId,
        email,
        name: name || email,  // Use email if name is not available
      });
    }

    return userDetails;
  } catch (error: any) {
    console.log("[USER_ERROR] :>>", error);
    throw error;
  }
};

export const incrementFreeTrialCount = async (): Promise<void> => {
  const { sessionClaims } = auth();
  const clerkId = sessionClaims?.sub;
  console.log("incrementFreeTrialCount ~ clerkId:", clerkId);

  try {
    await connectToDB();

    await User.findOneAndUpdate({ clerkId }, { $inc: { limit: 1 } });
  } catch (error: any) {
    console.log("[API_INCREMENT_ERROR] :>>", error);
    throw error;
  }
};

export const checkFreeTrialAvailability = async (): Promise<boolean> => {
  try {
    await connectToDB();

    const userDetails = await fetchUser();
    console.log("checkFreeTrialAvailability ~ userDetails:", userDetails);

    if (!userDetails || userDetails.limit < MAX_FREE_TRIALS) return true;

    return false;
  } catch (error: any) {
    console.log("[CHECK_FREE_TRIAL_ERROR] :>>", error);
    throw error;
  }
};

export const checkSubscription = async (): Promise<boolean> => {
  const { sessionClaims } = auth();
  const clerkId = sessionClaims?.sub;
  console.log("checkSubscription ~ clerkId:", clerkId);

  if (!clerkId) return false;

  try {
    await connectToDB();

    const userSubscription = await Subscription.findOne({ userId: clerkId });
    if (!userSubscription) return false;

    const isPro =
      userSubscription.priceId &&
      userSubscription.currentPeriodEnd.getTime() > Date.now();

    return !!isPro;
  } catch (error: any) {
    console.log("[CHECK_SUBSCRIPTION_ERROR] :>>", error);
    throw error;
  }
};
