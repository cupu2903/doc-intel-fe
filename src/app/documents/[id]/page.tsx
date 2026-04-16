'use client';

import { useDocument } from '@/hooks/useDocuments';
import { useParams } from 'next/navigation';
import { DocumentViewer } from '@/components/viewer/DocumentViewer';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { Loader2 } from 'lucide-react';

export default function DocumentWorkspace() {
  const params = useParams();
  const id = params.id as string;
  const { data: document, isLoading } = useDocument(id);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary" size={28} />
          <p className="text-xs text-muted-foreground tracking-wider uppercase">Loading document…</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Document not found.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <DocumentViewer url={document.signedUrl} />
      <ChatPanel documentId={id} />
    </div>
  );
}
