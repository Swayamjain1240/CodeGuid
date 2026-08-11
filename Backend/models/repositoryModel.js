import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    githubRepoId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    private: {
      type: Boolean,
      default: false,
    },
    htmlUrl: {
      type: String,
    },
    defaultBranch: {
      type: String,
      default: "main",
    },
    qdrantCollectionId: {
      type: String,
      default: null,
    },
    isScanningEnabled: {
      type: Boolean,
      default: true,
    },
    settings: {
      autoReviewEnabled: {
        type: Boolean,
        default: true,
      },
      securityThreshold: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium",
      },
    },
    isWebHookActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Repository = mongoose.model("Repository", repositorySchema);
export default Repository;