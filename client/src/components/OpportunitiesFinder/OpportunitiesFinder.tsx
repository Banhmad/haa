import React, { useState, useEffect, useCallback } from 'react';
import { analysisApi } from '../../utils/api';
import { Opportunity } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/helpers';
import './OpportunitiesFinder.css';

const OpportunitiesFinder: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = filter !== 'ALL' ? { type: filter } : undefined;
      const res = await analysisApi.getOpportunities(filters);
      setOpportunities(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const filterOptions = [
    { value: 'ALL', label: 'الكل' },
    { value: 'BREAKOUT', label: 'اختراق' },
    { value: 'REVERSAL', label: 'انعكاس' },
    { value: 'TREND', label: 'اتجاه' },
    { value: 'PATTERN', label: 'نمط' },
  ];

  return (
    <div className="opportunities-finder">
      <div className="of-header">
        <h2 className="of-title">مكتشف الفرص الاستثمارية</h2>
        <button className="btn-primary" onClick={fetchOpportunities} disabled={loading}>
          {loading ? 'جاري البحث...' : 'تحديث'}
        </button>
      </div>

      <div className="of-filters">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            className={`filter-btn ${filter === opt.value ? 'active' : ''}`}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {error && <p className="of-error">⚠️ {error}</p>}

      {loading ? (
        <p className="of-loading">جاري البحث عن الفرص...</p>
      ) : opportunities.length > 0 ? (
        <div className="opportunities-list">
          {opportunities.map((opp) => (
            <div key={opp.id} className={`opportunity-card direction-${opp.direction.toLowerCase()}`}>
              <div className="opp-top">
                <span className="opp-symbol">{opp.symbol}</span>
                <span className={`opp-direction ${opp.direction === 'LONG' ? 'long' : 'short'}`}>
                  {opp.direction === 'LONG' ? '▲ شراء' : '▼ بيع'}
                </span>
                <span className="opp-type">{opp.type}</span>
              </div>
              <div className="opp-prices">
                <div className="opp-price-item">
                  <span className="price-label">دخول</span>
                  <span className="price-value">{formatCurrency(opp.entryPrice)}</span>
                </div>
                <div className="opp-price-item">
                  <span className="price-label">هدف</span>
                  <span className="price-value target">{formatCurrency(opp.targetPrice)}</span>
                </div>
                <div className="opp-price-item">
                  <span className="price-label">وقف</span>
                  <span className="price-value stop">{formatCurrency(opp.stopLoss)}</span>
                </div>
              </div>
              <div className="opp-meta">
                <span>نسبة المخاطرة/العائد: {formatNumber(opp.riskRewardRatio, 1)}:1</span>
                <span>الثقة: {formatNumber(opp.confidence)}%</span>
              </div>
              <p className="opp-description">{opp.description}</p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="of-placeholder">لا توجد فرص متاحة حالياً. جرب التحديث.</p>
      )}
    </div>
  );
};

export default OpportunitiesFinder;
