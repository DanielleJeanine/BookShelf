export default function DashboardLayout({
  children,
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}