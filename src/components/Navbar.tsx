'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>Agilix</span>
        </Link>
        <div className={styles.centerContent}>
          <div className={styles.links}>
            <Link
              href="/dashboard"
              className={`${styles.link} ${isActive('/dashboard') && pathname === '/dashboard' ? styles.active : ''}`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/agencies"
              className={`${styles.link} ${isActive('/dashboard/agencies') ? styles.active : ''}`}
            >
              Agencies
            </Link>
            <Link
              href="/dashboard/contacts"
              className={`${styles.link} ${isActive('/dashboard/contacts') ? styles.active : ''}`}
            >
              Contacts
            </Link>
          </div>
          <Link href="/upgrade" className={styles.upgradeButton}>
            Upgrade
          </Link>
        </div>
        <div className={styles.userButton}>
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
