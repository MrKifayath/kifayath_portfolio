"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useRef, type MouseEvent } from "react";

export function InvoiceDemoDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  }

  return (
    <>
      <button
        className="project-demo-trigger"
        onClick={() => dialogRef.current?.showModal()}
        type="button"
      >
        <span>See a demo</span>
        <ArrowUpRight aria-hidden="true" />
      </button>

      <dialog
        aria-labelledby="invoice-demo-title"
        className="invoice-demo-dialog"
        onClick={closeOnBackdrop}
        ref={dialogRef}
      >
        <div className="invoice-demo">
          <div className="invoice-demo__header">
            <div>
              <p className="invoice-demo__badge">Demo data</p>
              <h2 id="invoice-demo-title">Invoice template preview</h2>
            </div>
            <form method="dialog">
              <button aria-label="Close invoice demo" className="invoice-demo__close" type="submit">
                <X aria-hidden="true" />
              </button>
            </form>
          </div>

          <div className="invoice-demo__grid">
            <article className="invoice-preview" aria-label="Sample invoice">
              <div className="invoice-preview__top">
                <span>INVOICE</span>
                <span>DEMO · INV-1042</span>
              </div>

              <div className="invoice-preview__parties">
                <div>
                  <span>From</span>
                  <strong>Northstar Studio</strong>
                  <small>Fictional sample business</small>
                </div>
                <div>
                  <span>Bill to</span>
                  <strong>Acme Demo Co.</strong>
                  <small>Fictional sample client</small>
                </div>
              </div>

              <div className="invoice-preview__meta">
                <span>Issued Nov 5, 2026</span>
                <span>Due Nov 20, 2026</span>
              </div>

              <table className="invoice-preview__table">
                <thead>
                  <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Product design retainer · 1 month</td>
                    <td>₹1,200.00</td>
                  </tr>
                </tbody>
              </table>

              <div className="invoice-preview__total">
                <span>Sample total</span>
                <strong>₹1,200.00</strong>
              </div>
            </article>

            <aside className="invoice-recurring">
              <p className="section-eyebrow">Recurring-payment setup</p>
              <dl>
                <div>
                  <dt>Plan</dt>
                  <dd>Product design retainer</dd>
                </div>
                <div>
                  <dt>Frequency</dt>
                  <dd>Monthly</dd>
                </div>
                <div>
                  <dt>Next billing date</dt>
                  <dd>Dec 5, 2026</dd>
                </div>
                <div>
                  <dt>Payment method</dt>
                  <dd>Sample card ·•••• 4242</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>Active · sample setup</dd>
                </div>
              </dl>
              <p className="invoice-recurring__note">
                Fictional details for a visual demo. No payment is created or collected.
              </p>
            </aside>
          </div>
        </div>
      </dialog>
    </>
  );
}
