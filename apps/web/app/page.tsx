
"use client";

import styles from './page.module.css';
import { Modal } from '../components/ui/Modal';
import { useState, useRef, useEffect } from 'react';
import LoginPage from './login/page';
import { Send, Paperclip, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && authOpen) {
      setAuthOpen(false);
    }
  }, [isAuthenticated, authOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        plusButtonRef.current &&
        !plusButtonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    action();
  };

  const handleVoiceClick = () => {
    requireAuth(() => {
      // TODO: Implement voice functionality
      console.log('Voice mode activated');
    });
  };

  const handleSendClick = () => {
    requireAuth(() => {
      const message = inputRef.current?.value;
      if (message?.trim()) {
        // TODO: Implement send message functionality
        console.log('Sending message:', message);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };

  const handlePlusClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleAddPhotos = () => {
    requireAuth(() => {
      // TODO: Implement add photos functionality
      console.log('Add photos');
      setDropdownOpen(false);
    });
  };

  const handleAddFiles = () => {
    requireAuth(() => {
      // TODO: Implement add files functionality
      console.log('Add files');
      setDropdownOpen(false);
    });
  };

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
        <div className={styles.plusContainer}>
          <button 
            ref={plusButtonRef}
            className={styles.plus} 
            onClick={handlePlusClick}
            aria-label="Add attachments"
          >
            +
          </button>
          {dropdownOpen && (
            <div ref={dropdownRef} className={styles.dropdown}>
              <button 
                className={styles.dropdownItem}
                onClick={handleAddPhotos}
              >
                <ImageIcon size={18} />
                <span>Add photos</span>
              </button>
              <button 
                className={styles.dropdownItem}
                onClick={handleAddFiles}
              >
                <Paperclip size={18} />
                <span>Add files</span>
              </button>
            </div>
          )}
        </div>
        <input 
          ref={inputRef}
          placeholder="Ask Lucy anything..." 
          onKeyDown={handleInputKeyDown}
        />
        <div className={styles.actions}>
  <button className={styles.voiceButton} onClick={handleVoiceClick}>
    <span className={styles.voiceIcon}>
      
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </span>

  </button>
  <button 
    className={styles.sendButton} 
    onClick={handleSendClick}
    aria-label="Send message"
  >
    <Send size={16}/>
  </button>
</div>

      </div>
    </main>
    <Modal open={authOpen} onClose={() => setAuthOpen(false)} closeOnOverlay={false}>
     <LoginPage />
   </Modal>
    </>
  
    
  );
}
