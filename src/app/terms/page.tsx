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
        <div className="min-h-screen bg-[#0c0a09] py-24 px-6">
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[#141210] p-8 md:p-12 shadow-2xl glass-dark">
                <h1 className="font-display text-4xl md:text-5xl text-white mb-3 tracking-tight">Terms of Service</h1>
                <p className="text-sm font-black uppercase tracking-widest text-[#5cd85c] mb-10 pb-6 border-b border-white/10">Last updated: {lastUpdated}</p>

                <div className="space-y-10 text-white/60 text-sm leading-relaxed font-medium">
                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using mascotmaker.io, you agree to be bound by these Terms of Service. If you do not agree, you may not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">2. Description of Service</h2>
                        <p>
                            mascotmaker.io provides AI-powered tools to generate and animate mascot characters. Our services are provided through a credit-based system.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">3. Credits and Payments</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Credits are purchased in packs and have no cash value.</li>
                            <li>All payments are processed securely by Lemon Squeezy.</li>
                            <li>Credits are non-refundable once any portion of the pack has been used.</li>
                            <li>We calculate credits based on actual AI token usage as defined in our system.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">4. Intellectual Property</h2>
                        <p className="mb-3">
                            You retain rights to the inputs you provide. Rights to the AI-generated outputs depend on the underlying terms of our AI providers (Google Gemini). You are responsible for ensuring your inputs do not infringe on other parties' intellectual property.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">5. Prohibited Use</h2>
                        <p className="mb-3">You agree not to use the service to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Generate harmful, illegal, or offensive content.</li>
                            <li>Attempt to reverse engineer the underlying AI models.</li>
                            <li>Use automation to scrape or interact with the service in an unauthorized manner.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">6. Limitation of Liability</h2>
                        <p>
                            mascotmaker.io is provided "as is" without warranties of any kind. We are not liable for any direct or indirect damages resulting from your use of the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">7. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Your continued use of the service after such changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">8. Termination</h2>
                        <p>
                            We reserve the right to terminate or suspend access to our service immediately, without prior notice, for breach of these Terms.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
