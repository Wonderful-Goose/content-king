import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swipe Files | ContentCanvas",
  description: "Collect and organize content inspiration",
};

export default function SwipeFilesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Swipe Files</h1>
        <p className="text-muted-foreground">
          Collect and organize content inspiration from around the web.
        </p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium mb-2">No swipe files yet</h3>
          <p className="text-muted-foreground mb-4">
            Start collecting content that inspires you.
          </p>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Add Swipe File
          </button>
        </div>
      </div>
    </div>
  );
} 