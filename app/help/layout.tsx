import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function HelpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/50 to-white relative flex flex-col font-sans overflow-x-hidden">
            <Navbar />
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </main>
    );
}
