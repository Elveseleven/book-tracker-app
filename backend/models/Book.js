const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true },
    author: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Want to Read", "Reading", "Finished"],
      default: "Want to Read"
    },

    pagesTotal: { type: Number, default: 0 },
    pagesRead: { type: Number, default: 0 },

    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);