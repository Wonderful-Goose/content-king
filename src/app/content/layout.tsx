import PageLayout from "@/components/layout/PageLayout";

export default function ContentLayout({
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