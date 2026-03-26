import React, { useState } from 'react';
import { useTechnicalAnalysis } from '../../hooks/useTechnicalAnalysis';
import { formatPercent, getSignalLabel } from '../../utils/helpers';
import { SIGNAL_COLORS } from '../../utils/constants';
import './TechnicalAnalysis.css';

interface TechnicalAnalysisProps {
  symbol?: string;
}

const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ symbol: initialSymbol = 'AAPL' }) => {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [inputValue, setInputValue] = useState(initialSymbol);
  const [interval, setInterval] = useState('1d');

  const { result, loading, error, refresh } = useTechnicalAnalysis({ symbol, interval });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSymbol(inputValue.toUpperCase().trim());
  };

  return (
    <div className="technical-analysis">
      <div className="ta-header">
        <h2 className="ta-title">التحليل الفني</h2>
        <form className="ta-search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="رمز السهم"
            className="ta-input"
          />
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="ta-select"
          >
            <option value="1h">ساعة</option>
            <option value="4h">4 ساعات</option>
            <option value="1d">يوم</option>
            <option value="1w">أسبوع</option>
          </select>
          <button type="submit" className="btn-primary">تحليل</button>
        </form>
      </div>

      {loading && <p className="ta-loading">جاري التحليل...</p>}
      {error && <p className="ta-error">⚠️ {error}</p>}

      {result && !loading && (
        <>
          <div
            className="ta-signal-badge"
            style={{ backgroundColor: SIGNAL_COLORS[result.signal] }}
          >
            <span className="signal-label">{getSignalLabel(result.signal)}</span>
            <span className="signal-confidence">ثقة: {formatPercent(result.confidence)}</span>
          </div>

          <p className="ta-summary">{result.summary}</p>

          <div className="ta-indicators">
            <h3 className="ta-indicators-title">المؤشرات الفنية</h3>
            <div className="indicators-grid">
              {result.indicators.map((ind, idx) => (
                <div key={idx} className="indicator-card">
                  <div className="indicator-name">{ind.name}</div>
                  <div className="indicator-value">{ind.value}</div>
                  <div className={`indicator-signal signal-${ind.signal.toLowerCase()}`}>
                    {ind.signal}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary refresh-btn" onClick={refresh}>
            تحديث التحليل
          </button>
        </>
      )}

      {!result && !loading && !error && (
        <p className="ta-placeholder">اختر سهماً لبدء التحليل الفني</p>
      )}
    </div>
  );
};

export default TechnicalAnalysis;
