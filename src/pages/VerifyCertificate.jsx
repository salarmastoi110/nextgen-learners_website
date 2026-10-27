import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import { certificateService } from '../services/certificateService';
import { formatDate } from '../utils/formatters';

export default function VerifyCertificate() {
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get('code') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Auto-verify when arriving with ?code=... (e.g. from a certificate link)
  useEffect(() => {
    const initial = params.get('code');
    if (initial) verify(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verify = async (value) => {
    const clean = (value ?? code).trim();
    if (!clean) return setError('Enter a certificate code to verify.');
    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await certificateService.verify(clean));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Verify a Certificate</h1>
          <p className="page-hero__subtitle">
            Every NextGen Learners certificate carries a unique code. Enter it below to
            confirm authenticity — free, instantly, no account needed.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="verify-box">
            <div className="panel">
              <div className="panel__body">
                <div className="form-group">
                  <label className="form-label" htmlFor="cert-code">
                    Certificate Code
                  </label>
                  <input
                    id="cert-code"
                    className="form-input"
                    style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && verify()}
                    placeholder="NGL-XX-0000-0000"
                  />
                  <span className="form-hint">
                    Try a sample code:{' '}
                    <button
                      className="auth-card__link"
                      type="button"
                      style={{ fontSize: 'var(--font-size-xs)' }}
                      onClick={() => {
                        setCode('NGL-PY-2026-0417');
                        verify('NGL-PY-2026-0417');
                      }}
                    >
                      NGL-PY-2026-0417
                    </button>
                  </span>
                </div>

                {error && <div className="alert alert--error">⚠️ {error}</div>}

                <Button variant="primary" size="lg" block onClick={() => verify()} disabled={loading}>
                  {loading ? 'Verifying…' : 'Verify Certificate'}
                </Button>
              </div>
            </div>

            {result && !result.found && (
              <div className="verify-result verify-result--invalid">
                <div className="verify-result__icon" aria-hidden>❌</div>
                <h3>Certificate Not Found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{result.message}</p>
              </div>
            )}

            {result?.found && (
              <div
                className={`verify-result ${result.certificate.status === 'Valid' ? 'verify-result--valid' : 'verify-result--invalid'}`}
              >
                <div className="verify-result__icon" aria-hidden>
                  {result.certificate.status === 'Valid' ? '✅' : '⚠️'}
                </div>
                <h3>
                  {result.certificate.status === 'Valid'
                    ? 'This certificate is authentic'
                    : `This certificate is ${result.certificate.status.toLowerCase()}`}
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Issued by NextGen Learners and confirmed in the public registry.
                </p>

                <div className="verify-result__details">
                  {[
                    ['Holder', result.certificate.holder],
                    ['Program', result.certificate.courseTitle],
                    ['Issue Date', formatDate(result.certificate.issuedAt)],
                    ['Verification Code', result.certificate.code],
                  ].map(([label, value]) => (
                    <div key={label} className="verify-result__detail">
                      <div className="verify-result__detail-label">{label}</div>
                      <div className="verify-result__detail-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
