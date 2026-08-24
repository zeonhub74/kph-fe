import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

function InstagramIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }) {
  return (
    <svg
      viewBox="0 0 448 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M448,209.1a42.1,42.1,0,0,1-37.1-23.5,83.6,83.6,0,0,1-8.7-38.8V64H300.5V388.3c0,55.5-44.9,100.5-100.3,100.5a100.3,100.3,0,0,1,0-200.5c8.3,0,16.3,1,24,2.9V161.6c-8-.9-16.1-1.4-24.3-1.4A149.1,149.1,0,0,0,50.6,309.5,149.1,149.1,0,0,0,199.7,458.7c82.4,0,149.2-66.7,149.2-148.9V195.3A117.2,117.2,0,0,0,448,209.1Z" />
    </svg>
  );
}

function SiteFooter() {
  return (
    <footer className="w-full border border-(--color-light-gray) bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* First row: centered socials */}
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="flex items-center justify-center gap-6">
            <a
              href="mailto:karitonph@gmail.com?subject=Inquiry%20from%20website&body=Hi%20Kariton%20PH%2C"
              aria-label="Email karitonph@gmail.com"
              className="transition-colors hover:text-black/60 text-(--color-b)"
            >
              <Mail size={22} />
            </a>
            <a
              href="https://tiktok.com/@karitonphpurewater"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="transition-colors hover:text-black/60 text-(--color-b)"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/karitonphpurewater"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-black/60 text-(--color-b)"
            >
              <InstagramIcon className="h-5.5 w-5.5" />
            </a>
          </div>
        </div>
        {/* Second row: links on the left, copyright on the right */}
        <div className="mt-4 flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link
              to="/terms"
              className="transition-colors text-(--color-light-gray) hover:text-black/60"
            >
              Terms and Conditions
            </Link>
            <Link
              to="/about"
              className="transition-colors hover:text-black/60 text-(--color-light-gray)"
            >
              About Us
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground text-(--color-light-gray)">
            © 2025 Kariton PH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
