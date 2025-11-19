'use client';

import { useState } from 'react';
import styles from './login.module.css';
import { useAuth } from '../../lib/hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Replace with actual API call to authenticate
    // For now, mock login - set a token if email and password are provided
    if (email && password) {
      // Mock token - in production, this would come from the API response
      const mockToken = 'mock_auth_token_' + Date.now();
      login(mockToken);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    // TODO: Implement OAuth login
    console.log(`Login with ${provider}`);
    // For now, mock login
    const mockToken = 'mock_oauth_token_' + Date.now();
    login(mockToken);
  };

  return (
    <div className={styles.card}>
      <h2>Log in or sign up</h2>

      <input 
        className={styles.textInput} 
        type="email" 
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        className={styles.textInput} 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleLogin();
          }
        }}
      />
      <button className={styles.primary} onClick={handleLogin}>Continue</button>

      <div className={styles.divider}>
        <span></span>
        <p>OR</p>
        <span></span>
      </div>

      <div className={styles.buttons}>
        <button className={styles.oauth} onClick={() => handleOAuthLogin('google')}>
          <img src="/google.png" alt="Google" className={styles.icon} />
          Continue with Google
        </button>

        <button className={styles.oauth} onClick={() => handleOAuthLogin('phone')}>
          <span>📞</span> Continue with phone
        </button>
      </div>
    </div>
  );
}
