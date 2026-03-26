import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  type: 'technical' | 'fundamental';
  interval?: string;
  signal: 'BUY' | 'SELL' | 'HOLD' | 'NEUTRAL';
  confidence: number;
  indicators: {
    name: string;
    value: number | string;
    signal: string;
  }[];
  summary: string;
  createdAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['technical', 'fundamental'],
      required: true,
    },
    interval: {
      type: String,
      enum: ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'],
    },
    signal: {
      type: String,
      enum: ['BUY', 'SELL', 'HOLD', 'NEUTRAL'],
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    indicators: [
      {
        name: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: true },
        signal: { type: String, required: true },
      },
    ],
    summary: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

AnalysisSchema.index({ userId: 1, symbol: 1, createdAt: -1 });

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
