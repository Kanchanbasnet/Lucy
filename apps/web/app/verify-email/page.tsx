'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '../../lib/api/auth';
import styles from '../login/login.module.css';
import modalStyles from '../../components/ui/Modal.module.css';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    const verify = async () => {
      try {
        const res = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(res.message || 'Email verified successfully! You can now log in.');

        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        const apiMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to verify email. The link may have expired or is invalid.';
        setMessage(apiMessage);
      }
    };

    verify();
  }, [searchParams, router]);

  const handleClose = () => {
    router.push('/');
  };

  const getStyles = () => {
    if (status === 'success') {
      return { color: '#059669', backgroundColor: '#d1fae5' };
    }
    if (status === 'error') {
      return { color: '#ef4444', backgroundColor: '#fee2e2' };
    }
    return { color: '#3b82f6', backgroundColor: '#dbeafe' };
  };

  return (
    <div className={styles.screen}>
      <div className={modalStyles.sheet}>
        <button className={modalStyles.close} onClick={handleClose}>
          ×
        </button>
        <div className={styles.card}>
          <h2>Email Verification</h2>

          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              fontSize: '14px',
              marginTop: '12px',
              ...getStyles(),
            }}
          >
            {status === 'loading' ? 'Verifying your email...' : message}
          </div>

          <button
            className={styles.primary}
            onClick={() => router.push('/login')}
            style={{ marginTop: '16px' }}
          >
            Go to login
          </button>
        </div>
      </div>
    </div>
  );
}