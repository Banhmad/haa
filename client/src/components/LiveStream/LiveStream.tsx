import React, { useState, useEffect, useRef } from 'react';
import { StockQuote } from '../../types';
import { formatCurrency, formatPercent, getChangeColorClass } from '../../utils/helpers';
import { POPULAR_SYMBOLS } from '../../utils/constants';
import './LiveStream.css';

const LiveStream: React.FC = () => {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateMockQuote = (symbol: string): StockQuote => {
    const basePrice = 100 + Math.random() * 400;
    const change = (Math.random() - 0.5) * 10;
    return {
      symbol,
      name: symbol,
      price: parseFloat(basePrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(((change / basePrice) * 100).toFixed(2)),
      volume: Math.floor(Math.random() * 10000000),
      timestamp: new Date().toISOString(),
    };
  };

  const updatePrices = () => {
    const updatedQuotes = POPULAR_SYMBOLS.slice(0, 8).map(generateMockQuote);
    setQuotes(updatedQuotes);
    setLastUpdate(new Date());
  };

  const startStream = () => {
    setIsStreaming(true);
    updatePrices();
    intervalRef.current = setInterval(updatePrices, 3000);
  };

  const stopStream = () => {
    setIsStreaming(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="live-stream">
      <div className="ls-header">
        <div className="ls-title-group">
          <h2 className="ls-title">البث المباشر للأسعار</h2>
          {isStreaming && <span className="live-badge">● مباشر</span>}
        </div>
        <div className="ls-controls">
          {lastUpdate && (
            <span className="last-update">
              آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
            </span>
          )}
          <button
            className={`btn-primary stream-btn ${isStreaming ? 'stop' : ''}`}
            onClick={isStreaming ? stopStream : startStream}
          >
            {isStreaming ? '⏹ إيقاف' : '▶ بدء البث'}
          </button>
        </div>
      </div>

      {quotes.length > 0 ? (
        <div className="quotes-table-wrapper">
          <table className="quotes-table">
            <thead>
              <tr>
                <th>الرمز</th>
                <th>السعر</th>
                <th>التغير</th>
                <th>% التغير</th>
                <th>الحجم</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.symbol} className="quote-row">
                  <td className="symbol-cell">{q.symbol}</td>
                  <td className="price-cell">{formatCurrency(q.price)}</td>
                  <td className={`change-cell ${getChangeColorClass(q.change)}`}>
                    {q.change >= 0 ? '+' : ''}{formatCurrency(q.change)}
                  </td>
                  <td className={`change-pct-cell ${getChangeColorClass(q.changePercent)}`}>
                    {formatPercent(q.changePercent)}
                  </td>
                  <td className="volume-cell">{q.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ls-placeholder">
          <p>اضغط "بدء البث" لمشاهدة الأسعار المباشرة</p>
        </div>
      )}
    </div>
  );
};

export default LiveStream;
