import { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "Ideas | ContentPlanner",
  description: "Capture and develop your content ideas",
};

export default function IdeasLayout({
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