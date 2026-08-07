import mongoose from "mongoose";

const vulnerabilityFindSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    required: true,
  },
  owaspCategory: {
    type: String, // Fixed typo: typr -> type
  },
  filePath: {
    type: String,
    required: true,
  },
  lineNumber: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  recommendation: { // Added recommendation alias alongside suggestedFix
    type: String,
  },
  suggestedFix: {
    type: String,
  },
});

const agentLogSchema = new mongoose.Schema({
  agentName: {
    type: String,
    enum: ["Supervisor", "Security", "Quality", "ASTValidation"],
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "RUNNING", "COMPLETED", "FAILED"],
    required: true,
  },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const pullRequestSchema = new mongoose.Schema(
  {
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    prNumber: {
      type: Number,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    branch: { // Added branch field matching worker payload
      type: String,
    },
    baseBranch: { // Added baseBranch field matching worker payload
      type: String,
    },
    commitSha: {
      type: String,
      required: true,
    },
    author: { // Flexible definition supporting both String username and Object
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["QUEUED", "PROCESSING", "SCANNING", "PASSED", "FAILED", "COMPLETED"], // Expanded enum values to cover worker and dashboard statuses
      default: "QUEUED",
    },
    securityGrade: { // Added field matching AI Service
      type: String,
      enum: ["A", "B", "C", "D", "F"],
    },
    diffUrl: {
      type: String,
    },
    securityScore: {
      type: Number,
      default: 100,
    },
    vulnerabilities: [vulnerabilityFindSchema],
    agentLogs: [agentLogSchema],
    selfCorrectionAttempts: {
      type: Number,
      default: 0,
    },
    githubCommentPosted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

pullRequestSchema.index({ repository: 1, prNumber: 1 }, { unique: true });

const PullRequest = mongoose.model("PullRequest", pullRequestSchema);
export default PullRequest;