const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  emai: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "enterprise_admin"],
    default: "user",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  stripeCustomerId: {
    type: String,
  },
  currentSubscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Hash Password Before Saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
