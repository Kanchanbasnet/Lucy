'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { useAuth } from '../../lib/hooks/useAuth';
import { authApi } from '../../lib/api/auth';
import axios from 'axios';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      login(response.access_token, response.user);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiError = err.response?.data;
        setError(
          apiError?.message || 
          err.message || 
          'Failed to login. Please check your credentials and try again.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    // TODO: Implement OAuth login
    console.log(`Login with ${provider}`);
  };

  return (
    <div className={styles.card}>
      <h2>Log in</h2>

      {error && (
        <div style={{
          color: '#ef4444',
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: '#fee2e2',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <input 
        className={styles.textInput} 
        type="email" 
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isLoading) {
            handleLogin();
          }
        }}
      />
      <input 
        className={styles.textInput} 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isLoading) {
            handleLogin();
          }
        }}
      />
      <button 
        className={styles.primary} 
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Continue'}
      </button>

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <button
          onClick={() => router.push('/signup')}
          disabled={isLoading}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline',
          }}
        >
          Don't have an account? Sign up
        </button>
      </div>

      <div className={styles.divider}>
        <span></span>
        <p>OR</p>
        <span></span>
      </div>

      <div className={styles.buttons}>
        <button 
          className={styles.oauth} 
          onClick={() => handleOAuthLogin('google')}
          disabled={isLoading}
        >
          <img src="/google.png" alt="Google" className={styles.icon} />
          Continue with Google
        </button>

        <button 
          className={styles.oauth} 
          onClick={() => handleOAuthLogin('phone')}
          disabled={isLoading}
        >
          <span>📞</span> Continue with phone
        </button>
      </div>
    </div>
  );
}

