import mongoose from "mongoose";

const vulnerabilityFindSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    severity:{
        type:String,
        enum:['LOW','MEDIUM','HIGH','CRITICAL'],
        required:true,
    },
    owaspCategory:{
        typr:String,
    },
    filePath:{
        type:String,
        required:true,
    },
    lineNumber:{
        type:Number,
    },
    description:{
        type:String,
        required:true
    },
    suggestedFix:{
        type:String
    }
});

const agentLogSchema = new mongoose.Schema({
  agentName: {
    type: String,
    enum: ['Supervisor', 'Security', 'Quality', 'ASTValidation'],
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'],
    required: true,
  },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const pullRequestSchema = new mongoose.Schema(
  {
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repository',
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
    commitSha: {
      type: String,
      required: true,
    },
    author: {
      githubUsername: { type: String, required: true },
      avatarUrl: { type: String },
    },
    status: {
      type: String,
      enum: ['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'QUEUED',
    },
    diffUrl: {
      type: String,
    },
    securityScore: {
      type: Number, // Scale 0 - 100
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

pullRequestSchema.index({repository: 1, prNumber: 1}, {unique: true});

const PullRequest = mongoose.model("PullRequest", pullRequestSchema);

export default PullRequest ;