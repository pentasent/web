
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/60 to-white flex items-center justify-center">
      {children}
    </div>
  );
}