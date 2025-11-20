'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login/login.module.css';
import modalStyles from '../../components/ui/Modal.module.css';
import { authApi } from '../../lib/api/auth';
import axios from 'axios';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!name.trim() || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.signUp({
        email,
        password,
        name: name.trim(),
      });

      setSuccessMessage(
        `Account created! Please check your email (${email}) to verify your account before logging in.`
      );

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiError = err.response?.data;
        setError(
          apiError?.message || 
          err.message || 
          'Failed to create account. Please try again.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = (provider: string) => {
    // TODO: Implement OAuth signup
    console.log(`Sign up with ${provider}`);
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className={styles.screen}>
      <div className={modalStyles.sheet}>
        <button className={modalStyles.close} onClick={handleClose}>
          ×
        </button>
        <div className={styles.card}>
          <h2>Sign up</h2>

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

      {successMessage && (
        <div style={{
          color: '#059669',
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: '#d1fae5',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {successMessage}
        </div>
      )}

      <input 
        className={styles.textInput} 
        type="text" 
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />
      <input 
        className={styles.textInput} 
        type="email" 
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
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
            handleSignUp();
          }
        }}
      />
      <button 
        className={styles.primary} 
        onClick={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <button
          onClick={() => router.push('/login')}
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
          Already have an account? Log in
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
          onClick={() => handleOAuthSignUp('google')}
          disabled={isLoading}
        >
          <img src="/google.png" alt="Google" className={styles.icon} />
          Continue with Google
        </button>

        <button 
          className={styles.oauth} 
          onClick={() => handleOAuthSignUp('phone')}
          disabled={isLoading}
        >
          <span>📞</span> Continue with phone
        </button>
      </div>
        </div>
      </div>
    </div>
  );
}

