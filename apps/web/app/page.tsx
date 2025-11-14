
"use client";

import styles from './page.module.css';
import { Modal } from '../components/ui/Modal';
import { useState } from 'react';
import LoginPage from './login/page';

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <main className={styles.hero}>
      <div className={styles.nav}>
        <div className={styles.logo}>
        <img src="/lucy-logo.png" alt="Lucy mark" />
          <span>Lucy</span>
        </div>
        <div className={styles.navLinks}>

          <button className={styles.signInButton} onClick={() => setAuthOpen(true)}>Sign in</button>
        </div>
      </div>

      <div className={styles.centerContent}>
      <div className={styles.heroLogo}>
    <img src="/lucy-logo.png" alt="Lucy mark" />
  </div>
        <h1>Meet Lucy,</h1>
        <h1>Your AI assistant</h1>
      </div>

      <div className={styles.promptBar}>
        <button className={styles.plus}>+</button>
        <input placeholder="Ask Lucy anything..." />
        <div className={styles.actions}>
  <button className={styles.voiceButton}>
    <span className={styles.voiceIcon}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </span>
  </button>
</div>

      </div>
    </main>
    <Modal open={authOpen} onClose={() => setAuthOpen(false)}>
     <LoginPage />
   </Modal>
    </>
  
    
  );
}
