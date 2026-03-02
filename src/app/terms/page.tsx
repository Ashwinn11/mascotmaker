import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service — mascotmaker.io",
    description: "The rules and terms governing the use of our services.",
};

export default function TermsPage() {
    const lastUpdated = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-cream py-16 px-6">
            <div className="mx-auto max-w-3xl rounded-3xl border-2 border-border bg-white p-8 md:p-12 shadow-sm">
                <h1 className="font-display text-4xl text-foreground mb-2">Terms of Service</h1>
                <p className="text-sm text-muted-foreground mb-8 text-warm-gray">Last updated: {lastUpdated}</p>

                <div className="space-y-8 text-warm-gray text-sm leading-relaxed">
                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using mascotmaker.io, you agree to be bound by these Terms of Service. If you do not agree, you may not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">2. Description of Service</h2>
                        <p>
                            mascotmaker.io provides AI-powered tools to generate and animate mascot characters. Our services are provided through a credit-based system.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">3. Credits and Payments</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Credits are purchased in packs and have no cash value.</li>
                            <li>All payments are processed securely by Lemon Squeezy.</li>
                            <li>Credits are non-refundable once any portion of the pack has been used.</li>
                            <li>We calculate credits based on actual AI token usage as defined in our system.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">4. Intellectual Property</h2>
                        <p className="mb-3">
                            You retain rights to the inputs you provide. Rights to the AI-generated outputs depend on the underlying terms of our AI providers (Google Gemini). You are responsible for ensuring your inputs do not infringe on other parties' intellectual property.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">5. Prohibited Use</h2>
                        <p className="mb-3">You agree not to use the service to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Generate harmful, illegal, or offensive content.</li>
                            <li>Attempt to reverse engineer the underlying AI models.</li>
                            <li>Use automation to scrape or interact with the service in an unauthorized manner.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">6. Limitation of Liability</h2>
                        <p>
                            mascotmaker.io is provided "as is" without warranties of any kind. We are not liable for any direct or indirect damages resulting from your use of the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">7. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Your continued use of the service after such changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">8. Termination</h2>
                        <p>
                            We reserve the right to terminate or suspend access to our service immediately, without prior notice, for breach of these Terms.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
