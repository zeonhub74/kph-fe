function SiteFooter() {
  return (
    <footer className="border-t border-(--color-light-gray)/20 bg-(--color-w)">
      <div className="mx-auto grid w-full max-w-8xl grid-cols-1 gap-6 px-4 py-2 text-sm text-(--ink-700) md:grid-cols-2">
        {/* Email */}
        <div>
          <h2 className="text-base text-(--color-b)/80 select-none">Email Us</h2>
          <p className="mt-1">karitonph@gmail.com</p>
        </div>

        {/* Socials */}
        <div className="md:justify-self-end">
          <h2 className="text-base text-(--color-b)/80 select-none">Socials</h2>

          <div className="mt-1 flex flex-row gap-4">
            <a
              href="https://www.tiktok.com/@karitonphpurewater"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:underline select-none"
            >
              TikTok
            </a>

            <a
              href="https://www.instagram.com/karitonphpurewater"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:underline select-none"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <p className="mx-auto w-full max-w-8xl px-4 pb-4 text-center text-xs text-(--ink-700)">
        © 2025 Kariton PH. All rights reserved.
      </p>
    </footer>
  );
}

export default SiteFooter;

