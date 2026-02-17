export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full overflow-auto bg-white">
      {children}
    </div>
  );
}
