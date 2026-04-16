'use client';

import { useDocuments, useUploadDocument } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileText, Upload, LogOut, Loader2, Brain } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { data: documents, isLoading } = useDocuments();
  const { mutate: upload, isPending: isUploading } = useUploadDocument();
  const router = useRouter();
  const params = useParams();
  const activeId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      upload(file, {
        onSuccess: (newDoc) => router.push(`/documents/${newDoc.id}`),
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="w-[220px] h-screen flex flex-col bg-white border-r border-border shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
          <Brain className="text-white" size={18} />
        </div>
        <div className="leading-tight">
          <div className="font-bold text-[13px] tracking-widest uppercase text-foreground">
            Doc Intel
          </div>
          <div className="text-[10px] tracking-widest uppercase text-muted-foreground">
            AI Platform
          </div>
        </div>
      </div>

      <Separator />

      {/* Upload Button */}
      <div className="px-3 py-3">
        <Button
          className="w-full justify-start gap-2 text-xs font-semibold tracking-wider uppercase"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          isLoading={isUploading}
          disabled={isUploading}
        >
          {!isUploading && <Upload size={14} />}
          Upload PDF
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={handleUpload}
        />
      </div>

      <Separator />

      {/* Document List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-5 py-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
            Documents
          </span>
        </div>
        <ScrollArea className="flex-1 px-2">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-muted-foreground" size={18} />
            </div>
          ) : documents?.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6 px-3">
              No documents yet. Upload a PDF to start.
            </p>
          ) : (
            <nav className="space-y-0.5 pb-2">
              {documents?.map((doc: any) => {
                const isActive = activeId === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => router.push(`/documents/${doc.id}`)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 group',
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <FileText
                      size={15}
                      className={cn(isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground')}
                    />
                    <span className="text-xs font-medium truncate flex-1">{doc.title || 'Untitled'}</span>
                    {(doc.status === 'pending' || doc.status === 'processing') && (
                      <Badge variant="warning" className="text-[9px] px-1.5 py-0 shrink-0">
                        •••
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </ScrollArea>
      </div>

      <Separator />

      {/* Footer / Logout */}
      <div className="px-3 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut size={14} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
