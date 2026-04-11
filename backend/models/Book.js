const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // 👤 USER REFERENCE (keep flexible name)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 📚 BASIC INFO
    title: { type: String, required: true },
    author: { type: String, default: "" },

    // 📊 STATUS (prof requirement)
    status: {
      type: String,
      enum: ["Want to Read", "Reading", "Finished"],
      default: "Want to Read"
    },

    // 📖 PROGRESS SYSTEM (IMPROVED BUT COMPATIBLE)
    pagesTotal: { type: Number, default: 0 },
    pagesRead: { type: Number, default: 0 },

    // 📝 NOTES
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);