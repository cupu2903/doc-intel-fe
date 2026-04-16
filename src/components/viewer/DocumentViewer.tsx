'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentViewerProps {
  url: string;
}

export function DocumentViewer({ url }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-[#f0f2f6]">
      {/* PDF Content */}
      <div className="flex-1 overflow-auto flex justify-center p-8">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-sm">Loading document…</span>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
              <FileText size={48} className="opacity-40" />
              <p className="text-sm">Failed to load PDF</p>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={true}
            scale={1.2}
            className="shadow-xl rounded-sm"
          />
        </Document>
      </div>

      {/* Page Controls */}
      {numPages > 0 && (
        <div className="h-12 bg-white border-t border-border flex items-center justify-between px-5 z-10 shrink-0">
          <span className="text-xs text-muted-foreground font-medium tracking-wide">
            Page{' '}
            <span className="text-foreground font-semibold">{pageNumber}</span>
            {' '}of{' '}
            <span className="text-foreground font-semibold">{numPages}</span>
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
