import { Document, Model, Schema, model, models } from "mongoose";

export interface ISubscription extends Document {
  userId: string;
  stripeId: string;
  subscriptionId: string;
  priceId: string;
  currentPeriodEnd: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: String, required: true },
  stripeId: { type: String, alias: "stripe_customer_id" },
  subscriptionId: { type: String, alias: "stripe_subscription_id" },
  priceId: { type: String, alias: "stripe_price_id" },
  currentPeriodEnd: { type: Date, alias: "stripe_current_period_end" },
});

const Subscription: Model<ISubscription> =
  models?.Subscription || model("Subscription", subscriptionSchema);

export default Subscription;
