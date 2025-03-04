import PageLayout from "@/components/layout/PageLayout";

export default function SwipeFilesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageLayout>
      {children}
    </PageLayout>
  );
} 