import Sidebar from "@/components/layout/Sidebar";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
} 