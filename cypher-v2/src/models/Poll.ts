import mongoose, { Schema, Document } from "mongoose";

export interface PollOption {
  id: string; // e.g. 'A', 'B'
  text: string;
  freeVotes: number;
  boostedVotes: number;
}

export interface Poll extends Document {
  userId: mongoose.Types.ObjectId; // References the User creator
  question: string;
  options: PollOption[];
  isActive: boolean;
  totalRevenue: number;
  createdAt: Date;
}

const PollOptionSchema: Schema<PollOption> = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  freeVotes: { type: Number, default: 0 },
  boostedVotes: { type: Number, default: 0 }
}, { _id: false });

const PollSchema: Schema<Poll> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [PollOptionSchema],
    required: true,
    validate: [(v: string | any[]) => v.length >= 2 && v.length <= 4, 'Poll must have 2 to 4 options']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const PollModel = (mongoose.models.Poll as mongoose.Model<Poll>) || mongoose.model<Poll>("Poll", PollSchema);

export default PollModel;
