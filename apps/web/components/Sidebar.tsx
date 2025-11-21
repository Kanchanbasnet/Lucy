'use client';

import { useState } from 'react';
import styles from './Sidebar.module.css';
import { Pencil, Search, User, Settings, ChevronLeft, PanelLeft } from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [chats] = useState<string[]>([]); 
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : 'U';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.header}>
          <div className={styles.logoRow}>
            <div className={styles.logoSection}>
              <img src="/lucy-logo.png" alt="Lucy" className={styles.logoIcon} />
            </div>
            {onClose && (
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            )}
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
        </div>

        <div className={styles.chatsSection}>
          <div className={styles.sectionTitle}>History</div>
          <div className={styles.chatsList}>
            {chats.length === 0 ? (
              <div className={styles.emptyState}>No history found</div>
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
            <div className={styles.userAvatar}>{initials}</div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.name || 'User'}</div>
              <div className={styles.userStatus}>{user?.email}</div>
            </div>
          </div>
          <button className={styles.navButton}>
            <User size={18} />
            <span>Profile</span>
          </button>
          <button className={styles.navButton}>
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button className={styles.logoutButton} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

