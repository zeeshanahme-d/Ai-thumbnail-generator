export default function InvoicesSection() {
    return (
        <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                TRANSACTION INVOICES
            </h2>
            <div className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-border bg-background-card px-6 py-10 text-center">
                <p className="text-sm text-text-secondary">
                    No invoice history found on this account.
                </p>
            </div>
        </section>
    );
}
