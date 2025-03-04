import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content | ContentCanvas",
  description: "Schedule and manage your content",
};

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content</h1>
        <p className="text-muted-foreground">
          Schedule and manage your content publishing.
        </p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium mb-2">No content items yet</h3>
          <p className="text-muted-foreground mb-4">
            Convert your ideas into scheduled content.
          </p>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Create Content
          </button>
        </div>
      </div>
    </div>
  );
} 