'use client';

import { useState } from 'react';
import styles from './Sidebar.module.css';
import { Pencil, Search, Book, Folder, ChevronDown } from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';

export function Sidebar() {
  const [chats] = useState<string[]>([]); // TODO: Load from API
  const { logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.header}>
          <div className={styles.logoSection}>
            <img src="/lucy-logo.png" alt="Lucy" className={styles.logoIcon} />
            <span className={styles.logoText}>Lucy</span>
            <ChevronDown size={16} className={styles.chevron} />
          </div>
        </div>

        <div className={styles.navSection}>
          <button className={styles.navButton}>
            <Pencil size={18} />
            <span>New chat</span>
          </button>
          <button className={styles.navButton}>
            <Search size={18} />
            <span>Search chats</span>
          </button>
          <button className={styles.navButton}>
            <Book size={18} />
            <span>Library</span>
          </button>
          <button className={styles.navButton}>
            <Folder size={18} />
            <span>Projects</span>
          </button>
        </div>

        <div className={styles.chatsSection}>
          <div className={styles.sectionTitle}>Chats</div>
          <div className={styles.chatsList}>
            {chats.length === 0 ? (
              <div className={styles.emptyState}>No chats yet</div>
            ) : (
              chats.map((chat, index) => (
                <div key={index} className={styles.chatItem}>
                  {chat}
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>KB</div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>kanchan Bas...</div>
              <div className={styles.userStatus}>Free</div>
            </div>
          </div>
          <button className={styles.upgradeButton}>Upgrade</button>
          <button className={styles.logoutButton} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

