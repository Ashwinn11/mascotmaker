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
        <div className="min-h-screen bg-[#0c0a09] py-24 px-6">
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[#141210] p-8 md:p-12 shadow-2xl glass-dark">
                <h1 className="font-display text-4xl md:text-5xl text-white mb-3 tracking-tight">Privacy Policy</h1>
                <p className="text-sm font-black uppercase tracking-widest text-candy-blue mb-10 pb-6 border-b border-white/10">Last updated: {lastUpdated}</p>

                <div className="space-y-10 text-white/60 text-sm leading-relaxed font-medium">
                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">1. Information We Collect</h2>
                        <p className="mb-3">
                            We collect information you provide directly to us when you create an account, purchase credits, or use our AI generation services. This include:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Name and email address (via Google OAuth)</li>
                            <li>Transaction data (via Lemon Squeezy)</li>
                            <li>User-generated content (prompts, uploaded images, generated mascots)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">2. How We Use Your Information</h2>
                        <p className="mb-3">We use the collected information to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Provide, maintain, and improve our AI services</li>
                            <li>Process transactions and manage your credit balance</li>
                            <li>Send technical notices, updates, and support messages</li>
                            <li>Detect, investigate, and prevent fraudulent transactions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">3. Data Storage and Security</h2>
                        <p className="mb-3">
                            We use Cloudflare R2 for secure image storage and SQLite for user data. While we take reasonable measures to protect your personal information, no security system is impenetrable. Payment information is handled securely by our third-party processor, Lemon Squeezy.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">4. Third-Party Services</h2>
                        <p className="mb-3">
                            We use Google for authentication (OAuth), Google Gemini for AI generation, Cloudflare for storage and performance, and Lemon Squeezy for payment processing. These third parties have their own privacy policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">5. Your Choices</h2>
                        <p>
                            You can access and update your account information through your Profile page. You may also request to delete your account and associated data by contacting our support.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">6. Cookies</h2>
                        <p>
                            We use essential cookies to manage your session and authentication. These are necessary for the website to function correctly.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-white mb-4">7. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at support@mascotmaker.io.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
