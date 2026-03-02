import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — mascotmaker.io",
    description: "Our commitment to protecting your privacy and personal data.",
};

export default function PrivacyPage() {
    const lastUpdated = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-cream py-16 px-6">
            <div className="mx-auto max-w-3xl rounded-3xl border-2 border-border bg-white p-8 md:p-12 shadow-sm">
                <h1 className="font-display text-4xl text-foreground mb-2">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground mb-8 text-warm-gray">Last updated: {lastUpdated}</p>

                <div className="space-y-8 text-warm-gray text-sm leading-relaxed">
                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">1. Information We Collect</h2>
                        <p className="mb-3">
                            We collect information you provide directly to us when you create an account, purchase credits, or use our AI generation services. This include:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Name and email address (via Google OAuth)</li>
                            <li>Transaction data (via Lemon Squeezy)</li>
                            <li>User-generated content (prompts, uploaded images, generated mascots)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">2. How We Use Your Information</h2>
                        <p className="mb-3">We use the collected information to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Provide, maintain, and improve our AI services</li>
                            <li>Process transactions and manage your credit balance</li>
                            <li>Send technical notices, updates, and support messages</li>
                            <li>Detect, investigate, and prevent fraudulent transactions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">3. Data Storage and Security</h2>
                        <p className="mb-3">
                            We use Cloudflare R2 for secure image storage and SQLite for user data. While we take reasonable measures to protect your personal information, no security system is impenetrable. Payment information is handled securely by our third-party processor, Lemon Squeezy.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">4. Third-Party Services</h2>
                        <p className="mb-3">
                            We use Google for authentication (OAuth), Google Gemini for AI generation, Cloudflare for storage and performance, and Lemon Squeezy for payment processing. These third parties have their own privacy policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">5. Your Choices</h2>
                        <p>
                            You can access and update your account information through your Profile page. You may also request to delete your account and associated data by contacting our support.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">6. Cookies</h2>
                        <p>
                            We use essential cookies to manage your session and authentication. These are necessary for the website to function correctly.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-foreground mb-3">7. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at support@mascotmaker.io.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
