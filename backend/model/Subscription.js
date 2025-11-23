const mongoose = require("mongoose");


const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
    },
    stripeSubscriptionId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "trialing", "canceled", "past_due"],
        default: "active",
    },
    current_period_end: {
        type: Number,
    },
    current_period_start: {
        type: Number,
    },
    cancel_at_period_end: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
  });


  module.exports = mongoose.model("Subscription", subscriptionSchema);