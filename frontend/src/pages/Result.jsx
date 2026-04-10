import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import EnhancedResult from '../components/EnhancedResult';
import { ArrowLeft, SearchX, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/results/${id}`)
      .then(r => setResult(r.data.result))
      .catch(err => console.error("Result fetch error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-loading">
        <Loader2 className="animate-spin" size={40} color="#8b5cf6" />
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Calculating your scores...</p>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="page-loading" style={{ flexDirection: 'column', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <SearchX size={60} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 className="grad-text" style={{ fontSize: '2rem', marginBottom: '10px' }}>Result Not Found</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>We couldn't locate this specific quiz result record.</p>
          <Link 
            to="/dashboard" 
            className="action-btn btn-primary"
            style={{ textDecoration: 'none', display: 'inline-flex' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Use layout to keep sidebar visible
  return (
    <Layout>
      <EnhancedResult result={result} />
    </Layout>
  );
}
