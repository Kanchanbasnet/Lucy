'use client';

import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import modalStyles from '../../components/ui/Modal.module.css';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className={styles.screen}>
      <div className={modalStyles.sheet}>
        <button className={modalStyles.close} onClick={handleClose}>
          ×
        </button>
        <LoginForm />
      </div>
    </div>
  );
}
