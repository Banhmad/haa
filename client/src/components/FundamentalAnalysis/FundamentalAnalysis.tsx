import React, { useState, useEffect } from 'react';
import { analysisApi } from '../../utils/api';
import { FundamentalData } from '../../types';
import { formatNumber } from '../../utils/helpers';
import './FundamentalAnalysis.css';

interface FundamentalAnalysisProps {
  symbol?: string;
}

const getPeRatioNote = (peRatio: number): string => {
  if (peRatio < 20) return 'منخفض';
  if (peRatio > 40) return 'مرتفع';
  return 'معتدل';
};

const FundamentalAnalysis: React.FC<FundamentalAnalysisProps> = ({ symbol: initialSymbol = 'AAPL' }) => {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [inputValue, setInputValue] = useState(initialSymbol);
  const [data, setData] = useState<FundamentalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFundamentals = async (sym: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await analysisApi.getFundamentalAnalysis(sym);
      setData(res.data as unknown as FundamentalData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundamentals(symbol);
  }, [symbol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSymbol(inputValue.toUpperCase().trim());
  };

  const metrics = data
    ? [
        { label: 'نسبة السعر/الربحية (P/E)', value: formatNumber(data.peRatio), note: getPeRatioNote(data.peRatio) },
        { label: 'نسبة السعر/القيمة الدفترية (P/B)', value: formatNumber(data.pbRatio) },
        { label: 'نمو ربحية السهم (EPS)', value: `${formatNumber(data.epsGrowth)}%` },
        { label: 'نسبة الدين/حقوق المساهمين', value: formatNumber(data.debtToEquity) },
        { label: 'نسبة التداول الحالية', value: formatNumber(data.currentRatio) },
        { label: 'العائد على حقوق المساهمين (ROE)', value: `${formatNumber(data.returnOnEquity)}%` },
        { label: 'نمو الإيرادات', value: `${formatNumber(data.revenueGrowth)}%` },
        ...(data.dividendYield !== undefined
          ? [{ label: 'عائد الأرباح', value: `${formatNumber(data.dividendYield)}%` }]
          : []),
      ]
    : [];

  return (
    <div className="fundamental-analysis">
      <div className="fa-header">
        <h2 className="fa-title">التحليل الأساسي</h2>
        <form className="fa-search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="رمز السهم"
            className="fa-input"
          />
          <button type="submit" className="btn-primary">بحث</button>
        </form>
      </div>

      {loading && <p className="fa-loading">جاري تحميل البيانات...</p>}
      {error && <p className="fa-error">⚠️ {error}</p>}

      {data && !loading && (
        <>
          <div className="company-info">
            <h3 className="company-name">{data.companyName}</h3>
            <div className="company-meta">
              <span className="badge">{data.sector}</span>
              <span className="badge">{data.industry}</span>
            </div>
          </div>

          <div className="metrics-grid">
            {metrics.map((metric, idx) => (
              <div key={idx} className="metric-card">
                <div className="metric-label">{metric.label}</div>
                <div className="metric-value">{metric.value}</div>
                {metric.note && <div className="metric-note">{metric.note}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {!data && !loading && !error && (
        <p className="fa-placeholder">اختر سهماً لعرض البيانات الأساسية</p>
      )}
    </div>
  );
};

export default FundamentalAnalysis;
