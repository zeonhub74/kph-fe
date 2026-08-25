import { Link } from "react-router-dom";

function TermsSectionItem({ number, title, children }) {
  return (
    <section className="border-b border-(--color-light-gray) pb-8 last:border-b-0">
      <h2 className="text-xl font-semibold text-foreground">
        {number}. {title}
      </h2>
      <div className="mt-3 leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

export default function Terms() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8 text-justify">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-8">
          <p className="mb-3 text-sm font-medium text-primary">Kariton PH</p>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Terms and Conditions
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            These Terms and Conditions (&ldquo;Terms&rdquo;) govern your
            access to and use of the Kariton PH website and services (the
            &ldquo;Services&rdquo;). By accessing or using the Services, you
            agree to be bound by these Terms.
          </p>
        </header>

        <div className="mt-10 space-y-8">
          <TermsSectionItem number="1" title="Acceptance of Terms">
            <p>
              By accessing or using the Kariton PH website or services, you
              acknowledge that you have read, understood, and agree to be
              bound by these Terms, together with our Privacy Policy. If you
              do not agree to these Terms, you must discontinue use of the
              Services immediately.
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="2" title="Use of Services">
            <p>
              You agree to use the Services only for lawful purposes and in
              accordance with these Terms. You shall not use the Services in
              any manner that could damage, disable, overburden, or impair
              the Services, or that infringes upon the rights of any third
              party, including intellectual property, privacy, or
              proprietary rights.
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="3" title="Orders and Payments">
            <p>
              All orders placed through the Services are subject to
              acceptance and product availability. Kariton PH reserves the
              right, at its sole discretion, to refuse, limit, or cancel any
              order for any reason, including but not limited to errors in
              pricing or product information, suspected fraudulent activity,
              or unavailability of stock. Prices for products and services
              are subject to change without prior notice.
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="4" title="Delivery">
            <p>
              Estimated delivery times are provided for convenience only and
              are not guaranteed. Kariton PH shall not be held liable for any
              delay or failure in delivery arising from circumstances beyond
              its reasonable control, including but not limited to weather
              conditions, courier delays, traffic, or force majeure events.
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="5" title="Returns and Refunds">
            <p>
              For information regarding product returns, replacements, cancellations, and refunds, 
              including applicable timeframes, eligibility requirements, return conditions, and any 
              applicable exceptions, please refer to our{' '}
              <Link to="/ref" className="underline text-text-(--color-blue) hover:text-(--color-green)">
                Return and Refund Policy
              </Link>
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="6" title="Intellectual Property">
            <p>
              Unless otherwise indicated, all content on this website,
              including but not limited to text, graphics, logos, images,
              and software, is the property of Kariton PH and is protected
              by applicable intellectual property laws. No part of this
              content may be reproduced, distributed, or otherwise used
              without the prior written consent of Kariton PH.
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="7" title="Limitation of Liability">
            <p>
              To the fullest extent permitted by applicable law, Kariton PH
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including but not limited
              to loss of profits, data, or goodwill, arising out of or in
              connection with your access to or use of the Services, whether
              based on warranty, contract, tort, or any other legal theory.
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="8" title="Indemnification">
            <p>
              You agree to indemnify and hold harmless Kariton PH, its
              officers, employees, and agents from and against any claims,
              liabilities, damages, losses, and expenses, including
              reasonable legal fees, arising out of or in any way connected
              with your use of the Services or your violation of these
              Terms.
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="9" title="Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance
              with the laws of the Republic of the Philippines, without
              regard to its conflict of law provisions. Any disputes arising
              under these Terms shall be subject to the exclusive
              jurisdiction of the courts of the Philippines.
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="10" title="Severability">
            <p>
              If any provision of these Terms is found to be invalid or
              unenforceable by a court of competent jurisdiction, the
              remaining provisions shall continue in full force and effect.
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="11" title="Changes to These Terms">
            <p>
              Kariton PH reserves the right to modify or update these Terms
              at any time without prior notice. Any changes will be
              effective immediately upon posting to this page, and the
              &ldquo;Last updated&rdquo; date will be revised accordingly.
              Your continued use of the Services following any such changes
              constitutes your acceptance of the revised Terms.
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="12" title="Entire Agreement">
            <p>
              These Terms, together with our Privacy Policy, constitute the
              entire agreement between you and Kariton PH regarding your use
              of the Services and supersede any prior agreements or
              understandings, whether written or oral.
            </p>
          </TermsSectionItem>

          <TermsSectionItem number="13" title="Contact Us">
            <p>
              If you have any questions or concerns regarding these Terms,
              please contact us at{" "}
              <a
                href="mailto:admin@karitonPH.com"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                admin@karitonPH.com
              </a>
              
            </p>
          </TermsSectionItem>
        </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Last updated: August 24, 2026
          </p>
      </article>
    </main>
  );
}