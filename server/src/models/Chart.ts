import mongoose, { Document, Schema } from 'mongoose';

export interface IChart extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  interval: string;
  chartType: 'candlestick' | 'line' | 'bar';
  indicators: {
    name: string;
    type: string;
    params: Record<string, number>;
    enabled: boolean;
  }[];
  title?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChartSchema = new Schema<IChart>(
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
    interval: {
      type: String,
      required: true,
      enum: ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'],
      default: '1d',
    },
    chartType: {
      type: String,
      enum: ['candlestick', 'line', 'bar'],
      default: 'candlestick',
    },
    indicators: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        params: { type: Map, of: Number, default: {} },
        enabled: { type: Boolean, default: true },
      },
    ],
    title: { type: String, trim: true },
    notes: { type: String },
  },
  { timestamps: true }
);

ChartSchema.index({ userId: 1, createdAt: -1 });
ChartSchema.index({ symbol: 1 });

export default mongoose.model<IChart>('Chart', ChartSchema);
