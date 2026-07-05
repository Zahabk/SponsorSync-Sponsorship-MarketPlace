import { model, Schema } from "mongoose";

const proposalSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    sponsor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tier: {
      type: String,
      enum: ["Gold", "Silver", "Bronze"],
      required: true,
    },
    proposedBudget: {
      type: Number,
      required: true,
      min: [0, "Budget cannot be negative"],
    },
    message: {
      type: String,
      default:""
    },
    status: {
      type: String,
      enum: ["pending", "negotiating", "approved", "rejected"],
      default: "pending",
    },
    counterOffer: {
      type: Number,
       min: [0, "Counter offer cannot be negative"]
    },
    counterNote: {
      type: String,
    },
    counterStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    
  },
  { timestamps: true },
);

export const Proposal = model("Proposal", proposalSchema);
