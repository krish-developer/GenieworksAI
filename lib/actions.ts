"use server";

import { auth } from "@clerk/nextjs";
import connectToDB from "@/lib/mongoose";
import User, { IUser } from "@/lib/models/user.model";
import { MAX_FREE_TRAILS } from "@/constants";
import Subscription from "@/lib/models/subscription.model";
import fetch from 'node-fetch';

const CLERK_API_URL = "https://api.clerk.dev/v1";
const CLERK_API_KEY = process.env.CLERK_SECRET_KEY;

interface ClerkUser {
  email_addresses: { email_address: string }[];
  first_name: string;
  last_name: string;
}

const fetchClerkUserDetails = async (clerkId: string): Promise<{ email: string; name: string } | null> => {
  try {
    const response = await fetch(`${CLERK_API_URL}/users/${clerkId}`, {
      headers: {
        Authorization: `Bearer ${CLERK_API_KEY}`
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch Clerk user details: ${response.status} ${response.statusText}`);
      return null;
    }

    const user: ClerkUser = await response.json();

    return {
      email: user.email_addresses[0]?.email_address || '',
      name: `${user.first_name} ${user.last_name}`.trim()
    };
  } catch (error) {
    return null;
  }
};

export const fetchUser = async (): Promise<IUser | null> => {
  try {
    await connectToDB();
    const { sessionClaims } = auth();
    console.log("fetchUser ~ sessionClaims:", sessionClaims);

    const clerkId = sessionClaims?.sub;

    if (!clerkId) {
      console.error("Clerk ID not found in session claims.");
      return null;
    }

    let userDetails = await User.findOne({ clerkId });

    if (!userDetails) {
      const clerkUserDetails = await fetchClerkUserDetails(clerkId);

      if (!clerkUserDetails) {
        console.error("Failed to fetch Clerk user details.");
        return null;
      }

      userDetails = await User.create({
        clerkId,
        email: clerkUserDetails.email,
        name: clerkUserDetails.name || clerkUserDetails.email,
        limit: 0  // Initialize limit field if creating new user
      });
    }

    return userDetails;
  } catch (error) {
    return null;
  }
};

export const incrementFreeTrialCount = async (): Promise<void> => {
  try {
    const { sessionClaims } = auth();
    const clerkId = sessionClaims?.sub;
    console.log("incrementFreeTrialCount ~ clerkId:", clerkId);

    if (!clerkId) {
      console.error("Clerk ID not found in session claims.");
      return;
    }

    await connectToDB();

    await User.findOneAndUpdate({ clerkId }, { $inc: { limit: 1 } });
  } catch (error) {
  }
};

export const checkFreeTrialAvailability = async (): Promise<boolean> => {
  try {
    await connectToDB();

    const userDetails = await fetchUser();

    if (!userDetails || userDetails.limit < MAX_FREE_TRAILS) return true;

    return false;
  } catch (error) {
    return false;
  }
};

export const checkSubscription = async (): Promise<boolean> => {
  try {
    const { sessionClaims } = auth();
    const clerkId = sessionClaims?.sub;
    console.log("checkSubscription ~ clerkId:", clerkId);

    if (!clerkId) return false;

    await connectToDB();

    const userSubscription = await Subscription.findOne({ userId: clerkId });
    if (!userSubscription) return false;

    const isPro = userSubscription.priceId && userSubscription.currentPeriodEnd.getTime() > Date.now();

    return !!isPro;
  } catch (error) {
    return false;
  }
};
