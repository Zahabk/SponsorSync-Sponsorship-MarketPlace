import mongoose, { model, Schema } from "mongoose";

const tierSchema = new Schema(
  {
    name: {
      type: String,
      enum: ["Gold", "Silver", "Bronze"],
    },
    price: Number,
    benefits: [String],
  },
  { _id: false },
);

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        "conference",
        "concert",
        "sports",
        "festival",
        "corporate",
        "other",
      ],
      default: "other",
    },
    eventDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    audienceSize: {
      type: Number,
      required: true,
    },
    banner: {
      type: String,
      default: "",
    },
    tiers: {
      type: [tierSchema],

      required: true,
    },
    proposalDeadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

eventSchema.pre("validate", function () {
  if (!this.tiers || this.tiers.length === 0) {
    this.tiers = [
      {
        name: "Gold",
        price: 100,
        benefits: [
          "Premium logo placement on all event materials",
          "Dedicated booth/stall space",
          "Stage mention/announcement",
          "VIP passes for team",
        ],
      },
      {
        name: "Silver",
        price: 50,
        benefits: [
          "Logo placement on banners and digital screens",
          "Standard booth/stall space",
          "Event passes for team",
        ],
      },
      {
        name: "Bronze",
        price: 25,
        benefits: [
          "Logo on event website and social media",
          "Limited passes for team",
        ],
      },
    ];
  }
});

export const Event = model("Event", eventSchema);
