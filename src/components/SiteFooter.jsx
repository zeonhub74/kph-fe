import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa6";

function SiteFooter() {
  return (
    <footer className="w-full border border-(--color-light-gray) bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* First row: centered socials */}
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="flex items-center justify-center gap-6 select-none">
            <a
              href="mailto:admin@karitonph.com?subject=Inquiry%20from%20website&body=Hi%20Kariton%20PH%2C"
              aria-label="Email admin@karitonph.com"
              className="transition-colors hover:text-(--color-green) text-(--color-b)"
            >
              <Mail size={22} />
            </a>
            <a
              href="https://tiktok.com/@karitonphpurewater"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="transition-colors hover:text-(--color-green) text-(--color-b)"
            >
              <FaTiktok size={20} />
            </a>
            <a
              href="https://instagram.com/karitonphpurewater"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-(--color-green) text-(--color-b)"
            >
              <FaInstagram size={22} />
            </a>
          </div>
        </div>
        {/* Second row: links on the left, copyright on the right */}
        <div className="mt-4 flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs  text-muted-foreground">
            <Link 
              to="/about"
              className="transition-colors hover:text-(--color-blue) text-(--color-light-gray)"
            >
              About Us
            </Link>
            <Link
              to="/terms"
              className="transition-colors text-(--color-light-gray) hover:text-(--color-blue)"
            >
              Terms and Conditions
            </Link>
              <Link 
              to="/refund"
              className="transition-colors hover:text-(--color-blue) text-(--color-light-gray)"
            > 
              Delivery and After-Sales Policy
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