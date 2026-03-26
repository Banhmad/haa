import React, { useState } from 'react';
import { useChartData } from '../../hooks/useChartData';
import { formatCurrency, formatPercent, getChangeColorClass } from '../../utils/helpers';
import { CHART_INTERVALS } from '../../utils/constants';
import './ChartAnalyzer.css';

interface ChartAnalyzerProps {
  defaultSymbol?: string;
}

const ChartAnalyzer: React.FC<ChartAnalyzerProps> = ({ defaultSymbol = 'AAPL' }) => {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [inputValue, setInputValue] = useState(defaultSymbol);
  const [interval, setInterval] = useState('1d');

  const { quote, history, loading, error, refresh } = useChartData({ symbol, interval });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSymbol(inputValue.toUpperCase().trim());
  };

  return (
    <div className="chart-analyzer">
      <div className="chart-analyzer-header">
        <h2 className="chart-analyzer-title">محلل الرسوم البيانية</h2>
        <form className="chart-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="أدخل رمز السهم (مثل: AAPL)"
            className="chart-search-input"
          />
          <button type="submit" className="btn-primary">بحث</button>
        </form>
      </div>

      <div className="interval-selector">
        {CHART_INTERVALS.map((item) => (
          <button
            key={item.value}
            className={`interval-btn ${interval === item.value ? 'active' : ''}`}
            onClick={() => setInterval(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading && <div className="loading-spinner">جاري تحميل البيانات...</div>}
      {error && <div className="error-message">⚠️ {error}</div>}

      {quote && !loading && (
        <div className="quote-card">
          <div className="quote-symbol">{quote.symbol}</div>
          <div className="quote-name">{quote.name}</div>
          <div className="quote-price">{formatCurrency(quote.price)}</div>
          <div className={`quote-change ${getChangeColorClass(quote.change)}`}>
            {formatCurrency(quote.change)} ({formatPercent(quote.changePercent)})
          </div>
          <div className="quote-meta">
            <span>الحجم: {quote.volume.toLocaleString()}</span>
            {quote.marketCap && <span>القيمة السوقية: {formatCurrency(quote.marketCap)}</span>}
          </div>
        </div>
      )}

      <div className="chart-placeholder">
        {history.length > 0 ? (
          <div className="chart-data-summary">
            <p>عدد نقاط البيانات: {history.length}</p>
            <p>أحدث إغلاق: {history.length > 0 ? formatCurrency(history[history.length - 1].close) : '-'}</p>
            <button className="btn-primary" onClick={refresh}>تحديث البيانات</button>
          </div>
        ) : (
          !loading && <p className="no-data">ابحث عن سهم لعرض الرسم البياني</p>
        )}
      </div>
    </div>
  );
};

export default ChartAnalyzer;
