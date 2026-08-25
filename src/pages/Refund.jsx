function RefundSectionItem({ number, title, children }) {
  return (
    <section className="border-b border-(--color-light-gray) pb-8 last:border-b-0">
      <h2 className="text-xl font-semibold text-foreground">
        {number}. {title}
      </h2> 
      <div className="mt-3 leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

export default function Refund() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8 text-justify">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-8">
          <p className="mb-3 text-sm font-medium text-primary">Kariton PH</p>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            We're Here to Help
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            If your order arrived damaged, you received the wrong item, or your product
            has a verified manufacturing defect, we’re here to help. Your request may be
            eligible for a replacement, repair, or refund, depending on the product and
            the issue. Simply let us know what happened, and we’ll review your request
            and help find the right solution.
          </p>
        </header>

        <div className="mt-10 space-y-8">
          <RefundSectionItem number="1" title="Return Policy Overview">
            <p>
              Kariton PH accepts returns or replacement requests for eligible
              products to ensure customer satisfaction. Customers are
              encouraged to inspect their orders immediately upon delivery
              and report any concerns within the applicable return period.
              Returns and refunds are subject to product condition,
              verification, and approval by Kariton PH.
            </p>
          </RefundSectionItem>

          <RefundSectionItem
            number="2"
            title="Eligible Reasons for Return or Replacement"
          >
            <p>
              A product may qualify for return or replacement under the
              following conditions:
            </p>

            <h3 className="mt-5 font-medium text-foreground">
              A. Damaged Upon Delivery
            </h3>
            <p className="mt-2">
              If the product arrives with visible damage caused during
              shipping, the customer must:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                Take photos and/or videos of the package before opening (if
                possible)
              </li>
              <li>Provide clear photos/videos showing the damage</li>
              <li>
                Report the issue within 24&ndash;48 hours after receiving
                the item
              </li>
            </ul>
            <p className="mt-3">
              Kariton PH will evaluate the concern and provide the
              appropriate resolution.
            </p>

            <h3 className="mt-5 font-medium text-foreground">
              B. Wrong Item Received
            </h3>
            <p className="mt-2">
              If the customer receives a different product, model, or
              variation from the order, Kariton PH may arrange:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Replacement of the correct item</li>
              <li>Return instructions for the incorrect item</li>
            </ul>
            <p className="mt-3">
              The product must remain unused and complete with original
              packaging.
            </p>

            <h3 className="mt-5 font-medium text-foreground">
              C. Manufacturing Defect
            </h3>
            <p className="mt-2">
              Products with verified manufacturing defects may qualify for
              replacement or repair assistance. Customers may be required to
              provide:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Photos/videos showing the issue</li>
              <li>Product details</li>
              <li>Proof of purchase</li>
            </ul>
            <p className="mt-3">
              Kariton PH will assess whether the concern is covered under
              warranty.
            </p>
          </RefundSectionItem>

          <RefundSectionItem number="3" title="Non-Returnable Items">
            <p>The following items are generally not eligible for return:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Products damaged due to improper installation</li>
              <li>
                Products damaged due to misuse, modification, or
                unauthorized repair
              </li>
              <li>Used replacement filters and consumables</li>
              <li>Products without original accessories or packaging</li>
              <li>Items with missing parts caused by customer handling</li>
              <li>Normal wear and tear</li>
            </ul>
          </RefundSectionItem>

          <RefundSectionItem
            number="4"
            title="Product Installation Considerations"
          >
            <p>
              For water filtration systems, proper installation is important
              to ensure product performance. Kariton PH is not responsible
              for issues caused by:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Incorrect installation by unauthorized persons</li>
              <li>Incorrect water connection</li>
              <li>Improper plumbing modifications</li>
              <li>Poor water source conditions</li>
              <li>Failure to follow installation instructions</li>
            </ul>
            <p className="mt-3">
              Customers are encouraged to use qualified installers or
              request installation assistance when available.
            </p>
          </RefundSectionItem>

          <RefundSectionItem number="5" title="Refund Policy">
            <p>
              Approved refunds will only be processed after product
              evaluation and confirmation of eligibility. Refunds may be
              issued through:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Original payment method</li>
              <li>Bank transfer</li>
              <li>Other agreed payment methods</li>
            </ul>
            <p className="mt-3">
              Processing time may vary depending on the payment provider.
              Shipping fees, installation fees, or service charges may not
              be refundable unless the issue is caused by Kariton PH.
            </p>
          </RefundSectionItem>

          <RefundSectionItem number="6" title="Return Process">
            <p>To request a return or replacement, please provide:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Customer name</li>
              <li>Order number</li>
              <li>Date of purchase</li>
              <li>Product name/model</li>
              <li>Description of concern</li>
              <li>Photos/videos of the issue</li>
            </ul>
            <p className="mt-3">Send your request through:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                Facebook Messenger:{" "}
                <a
                  href="https://www.facebook.com/karitonphpurewater"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  https://www.facebook.com/karitonphpurewater
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:admin@karitonph.com"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  admin@karitonph.com
                </a>
              </li>
            </ul>
            <p className="mt-3">
              Kariton PH customer support will review the request and
              provide the next steps.
            </p>
          </RefundSectionItem>

          <RefundSectionItem number="7" title="Inspection and Approval">
            <p>
              All returns are subject to inspection and approval by Kariton
              PH. After assessment, Kariton PH may provide one of the
              following solutions:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Product replacement</li>
              <li>Repair assistance</li>
              <li>Replacement parts</li>
              <li>Store credit</li>
              <li>Refund (if applicable)</li>
            </ul>
          </RefundSectionItem>

          <RefundSectionItem
            number="8"
            title="Warranty and After-Sales Support"
          >
            <p>
              Kariton PH supports customers beyond the purchase by providing
              assistance for:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Product inquiries</li>
              <li>Filter replacement guidance</li>
              <li>Maintenance questions</li>
              <li>Installation concerns</li>
            </ul>
            <p className="mt-3">
              Warranty coverage depends on the specific product purchased.
              Customers should keep their proof of purchase for warranty
              claims.
            </p>
          </RefundSectionItem>

          <RefundSectionItem number="9" title="Customer Responsibility">
            <p>Customers are responsible for:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Checking product compatibility before purchase</li>
              <li>Providing accurate delivery information</li>
              <li>Following installation and maintenance instructions</li>
              <li>Proper care and usage of the product</li>
            </ul>
          </RefundSectionItem>

          <RefundSectionItem number="10" title="Policy Updates">
            <p>
              Kariton PH reserves the right to update this Returns and
              Refund Policy when necessary. Any changes will be posted
              through our official channels.
            </p>
          </RefundSectionItem>

          <RefundSectionItem number="11" title="Contact Us">
            <p>
              If you have any questions or concerns regarding this policy,
              please contact us at{" "}
              <a
                href="mailto:admin@karitonph.com"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                admin@karitonph.com 
              </a>
              .
            </p>
          </RefundSectionItem>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Thank you for trusting Kariton PH. We are committed to providing
          better solutions for Filipino homes and businesses.
        </p>
          <p className="mt-6 text-xs text-muted-foreground">
            Last updated: August 24, 2026
          </p>
      </article>
    </main>
  );
}