'use client';

import { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import styles from './login.module.css';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [open] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  return (
    <main className={styles.screen}>
      <Modal open={open} onClose={handleClose} closeOnOverlay={false}>
        <div>
          <div className={styles.card}>
            <h2>Log in or sign up</h2>

            <input className={styles.textInput} type="email" placeholder="Email address" />
            <input className={styles.textInput} type="password" placeholder="Password" />
            <button className={styles.primary}>Continue</button>

            <div className={styles.divider}>
              <span></span>
              <p>OR</p>
              <span></span>
            </div>

            <div className={styles.buttons}>
              <button className={styles.oauth}><span>🟢</span> Continue with Google</button>

              <button className={styles.oauth}><span>📞</span> Continue with phone</button>
            </div>
          </div>
        </div>
      </Modal>
    </main>
  );
}
