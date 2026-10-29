'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  return (
    <header>
      <div className="wrap">
        <div className="logo">Adrian Lamour</div>
        <nav>
          <Link href="/#work">Work</Link>
          <Link href="/gallery" aria-current={pathname === '/gallery' ? 'page' : undefined}>
            Gallery
          </Link>
          <Link href="/contact" aria-current={pathname === '/contact' ? 'page' : undefined}>
            Contact
          </Link>
          <button id="theme-toggle" onClick={toggle} aria-label="Toggle light and dark mode">
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </nav>
      </div>
    </header>
  );
}
