
"use client";

import styles from './page.module.css';
import { Modal } from '../components/ui/Modal';
import { useState, useRef, useEffect } from 'react';
import { LoginForm } from './login/LoginForm';
import { Send, Paperclip, Image as ImageIcon, PanelLeft } from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';
import { Sidebar } from '../components/Sidebar';

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isAuthenticated && authOpen) {
      setAuthOpen(false);
    }
  }, [isAuthenticated, authOpen]);

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
      console.log('Voice mode activated');
    });
  };

  const handleSendClick = () => {
    requireAuth(() => {
      const message = inputRef.current?.value;
      if (message?.trim()) {
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
      console.log('Add photos');
      setDropdownOpen(false);
    });
  };

  const handleAddFiles = () => {
    requireAuth(() => {
      console.log('Add files');
      setDropdownOpen(false);
    });
  };

  const firstName = user?.name?.split(' ')?.[0] || 'there';

  return (
    <>
      {isAuthenticated && sidebarOpen && (
        <Sidebar onClose={() => setSidebarOpen(false)} />
      )}

      <main
        className={
          isAuthenticated && sidebarOpen ? styles.heroWithSidebar : styles.hero
        }
      >
        <div className={styles.nav}>
          <div className={styles.logo}>
            {isAuthenticated && !sidebarOpen && (
              <button
                className={styles.sidebarToggle}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <PanelLeft size={18} />
              </button>
            )}
            <img src="/lucy-logo.png" alt="Lucy mark" />
            <span>Lucy</span>
          </div>
          <div className={styles.navLinks}>
            {!isAuthenticated ? (
              <button
                className={styles.signInButton}
                onClick={() => setAuthOpen(true)}
              >
                Sign in
              </button>
            ) : null}
          </div>
        </div>

        <div className={isAuthenticated ? styles.mainContent : styles.centerContent}>
          {isAuthenticated ? (
            <div className={styles.chatArea}>
              <div className={styles.welcomeMessage}>
                <h2>Hello, {firstName}.</h2>
                <p>How can I help you today?</p>
              </div>
            </div>
          ) : (
            <div className={styles.centerContent}>
              <div className={styles.heroLogo}>
                <img src="/lucy-logo.png" alt="Lucy mark" />
              </div>
              <h1>Meet Lucy,</h1>
              <h1>Your AI assistant</h1>
            </div>
          )}

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
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Modal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        closeOnOverlay={false}
      >
        <LoginForm onSuccess={() => setAuthOpen(false)} />
      </Modal>
    </>
  );
}
