'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import styles from './contacts.module.css';

interface Contact {
  [key: string]: string;
}

const DAILY_LIMIT = 50;
const STORAGE_KEY = 'contacts_view_count';
const CONTACTS_CACHE_KEY = 'contacts_cache';

// Columns to display in table
const DISPLAY_COLUMNS = ['first_name', 'last_name', 'email', 'phone', 'title'];

// Columns to exclude from modal
const EXCLUDE_COLUMNS = [
  'created_at',
  'updated_at',
  'email_type',
  'contact_form_url',
];

// Get today's date in UTC format
const getTodayUTC = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Get storage key for current user and day
const getStorageKey = (userId: string, date: string): string => {
  return `${STORAGE_KEY}_${userId}_${date}`;
};

// Get cache key for contacts
const getCacheKey = (userId: string, date: string): string => {
  return `${CONTACTS_CACHE_KEY}_${userId}_${date}`;
};

// Get current view count for today
const getCurrentViewCount = (userId: string): number => {
  const today = getTodayUTC();
  const storageKey = getStorageKey(userId, today);
  const stored = localStorage.getItem(storageKey);
  return stored ? parseInt(stored, 10) : 0;
};

// Increment view count for today
const incrementViewCount = (userId: string, amount: number): number => {
  const today = getTodayUTC();
  const storageKey = getStorageKey(userId, today);
  const current = getCurrentViewCount(userId);
  const newCount = current + amount;
  localStorage.setItem(storageKey, newCount.toString());
  return newCount;
};

// Save contacts to cache
const saveContactsToCache = (userId: string, date: string, contacts: Contact[]): void => {
  const cacheKey = getCacheKey(userId, date);
  localStorage.setItem(cacheKey, JSON.stringify(contacts));
};

// Load cached contacts
const loadCachedContacts = (userId: string, date: string): Contact[] => {
  const cacheKey = getCacheKey(userId, date);
  const cached = localStorage.getItem(cacheKey);
  return cached ? JSON.parse(cached) : [];
};

// Mark that the user has reached the daily limit
const markLimitReached = (userId: string): void => {
  const today = getTodayUTC();
  const limitKey = `limit_reached_${userId}_${today}`;
  localStorage.setItem(limitKey, 'true');
  // Also set view count to 50
  incrementViewCount(userId, 50);
};

// Check if limit was already reached today
const isLimitReached = (userId: string): boolean => {
  const today = getTodayUTC();
  const limitKey = `limit_reached_${userId}_${today}`;
  return localStorage.getItem(limitKey) === 'true';
};

// Get time until next UTC day reset
const getTimeUntilReset = (): string => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

const ITEMS_PER_PAGE = 10;

export default function ContactsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user) return;

    const today = getTodayUTC();
    
    // Check if cache exists for today
    let cachedContacts = loadCachedContacts(user.id, today);
    
    // SAFETY: If cache has more than 50, trim it to exactly 50
    if (cachedContacts.length > DAILY_LIMIT) {
      cachedContacts = cachedContacts.slice(0, DAILY_LIMIT);
      saveContactsToCache(user.id, today, cachedContacts);
    }
    
    // Also clean up any view count that's over 50
    const currentCount = getCurrentViewCount(user.id);
    if (currentCount > DAILY_LIMIT) {
      const storageKey = getStorageKey(user.id, today);
      localStorage.setItem(storageKey, DAILY_LIMIT.toString());
    }
    
    if (cachedContacts.length > 0) {
      // ✅ Cache exists → reuse it
      setContacts(cachedContacts);
      setFilteredContacts(cachedContacts);
      setLoading(false);
      return;
    }

    // ✅ First time today → fetch exactly 50 contacts and cache them
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (!response.ok) throw new Error('Failed to fetch contacts');
        let data = await response.json();

        // Take exactly 50 contacts
        const contactsToCache = data.slice(0, DAILY_LIMIT);

        // Save to cache once
        saveContactsToCache(user.id, today, contactsToCache);

        // Set state with exactly 50 contacts
        setContacts(contactsToCache);
        setFilteredContacts(contactsToCache);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user]);

  // Handle search
  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter((contact) =>
        Object.values(contact).some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
    setCurrentPage(1);
  }, [searchTerm, contacts]);

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedContacts = filteredContacts.slice(startIdx, endIdx);

  // Handle page change - show popup if trying to go beyond page 5
  const handlePageChange = (newPage: number) => {
    const maxPages = Math.ceil(DAILY_LIMIT / ITEMS_PER_PAGE); // = 5
    if (newPage > maxPages && user) {
      // Try to go beyond 50 limit
      markLimitReached(user.id); // Mark limit as reached in localStorage
      setShowLimitPopup(true); // Show popup
      return;
    }
    if (newPage < 1) {
      return; // Don't allow going below page 1
    }
    setCurrentPage(newPage);
  };

  const getDisplayData = (contact: Contact): { [key: string]: string } => {
    const result: { [key: string]: string } = {};
    Object.entries(contact).forEach(([key, value]) => {
      if (!EXCLUDE_COLUMNS.includes(key)) {
        result[key] = value;
      }
    });
    return result;
  };

  if (error)
    return (
      <div>
        <Navbar />
        <div className={styles.errorContainer}>
          <p className={styles.error}>{error}</p>
          <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Contacts</h1>
            <p>
              {searchTerm ? (
                <>
                  {filteredContacts.length} results found
                  {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                </>
              ) : (
                <>
                  {filteredContacts.length} / {DAILY_LIMIT} daily limit
                </>
              )}
            </p>
          </div>
          <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
            ← Back
          </button>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No contacts found</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {DISPLAY_COLUMNS.map((col) => (
                    <th key={col}>{col.replace(/_/g, ' ').toUpperCase()}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.map((contact, idx) => (
                  <tr key={idx}>
                    {DISPLAY_COLUMNS.map((col) => (
                      <td key={col}>
                        {col === 'email' && contact[col] && contact[col] !== 'N/A' ? (
                          <a 
                            href={`mailto:${contact[col]}`}
                            className={styles.tableLink}
                          >
                            {contact[col]}
                          </a>
                        ) : (
                          contact[col] || 'N/A'
                        )}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className={styles.viewButton}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={styles.backButton}
                >
                  ← Previous
                </button>
                {/* <div className={styles.pageInfo}>
                  Page <span className={styles.currentPage}>{currentPage}</span> of{' '}
                  <span className={styles.totalPages}>{totalPages}</span>
                  {currentPage === totalPages && totalPages === Math.ceil(DAILY_LIMIT / ITEMS_PER_PAGE) && (
                    <span className={styles.limitReachedBadge}>← Daily Limit</span>
                  )}
                </div> */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={styles.backButton}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal/Details Overlay */}
        {selectedContact && (
          <div className={styles.modalOverlay} onClick={() => setSelectedContact(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedContact(null)}
              >
                ✕
              </button>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {selectedContact.first_name} {selectedContact.last_name}
                </h2>
                {selectedContact.title && (
                  <span className={styles.modalBadge}>{selectedContact.title}</span>
                )}
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalGrid}>
                  {Object.entries(getDisplayData(selectedContact)).map(([key, value]) => (
                    <div key={key} className={styles.modalItem}>
                      <label className={styles.modalLabel}>
                        {key.charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}
                      </label>
                      <p className={styles.modalValue}>
                        {key === 'email' && value && value !== 'N/A' ? (
                          <a href={`mailto:${value}`} className={styles.modalLink}>
                            {value}
                          </a>
                        ) : (
                          value || 'N/A'
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Limit Reached Popup */}
        {showLimitPopup && (
          <div className={styles.modalOverlay} onClick={() => setShowLimitPopup(false)}>
            <div className={styles.limitPopup} onClick={(e) => e.stopPropagation()}>
              <div className={styles.limitPopupIcon}>◆</div>
              <h2 className={styles.limitPopupTitle}>Daily Limit Reached</h2>
              <p className={styles.limitPopupText}>
                You have reached your daily limit of {DAILY_LIMIT} contacts. Your limit resets in{' '}
                <strong>{getTimeUntilReset()}</strong>.
              </p>
              <button
                onClick={() => router.push('/upgrade')}
                className={styles.limitPopupButton}
              >
                Upgrade to Unlock Unlimited
              </button>
              <button
                onClick={() => setShowLimitPopup(false)}
                className={styles.limitPopupButtonSecondary}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
