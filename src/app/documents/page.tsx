import { FileText } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-background">
      <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
        <FileText className="text-primary/50" size={28} />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-base font-bold tracking-wider uppercase text-foreground">
          No Document Selected
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          Select a document from the sidebar or upload a new one to start analyzing with AI.
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="tracking-wider uppercase text-[10px]">System Active</span>
      </div>
    </div>
  );
}
