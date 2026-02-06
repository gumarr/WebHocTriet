"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { MermaidDiagram } from "./MermaidDiagram";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface RichTextEditorProps {
  value?: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung bài học...",
  className = "",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className={`border border-gray-300 rounded-lg ${className}`}>
        <div className="p-4 min-h-[200px] text-gray-500">
          Đang tải trình soạn thảo...
        </div>
      </div>
    );
  }

  return (
    <div className={`border-2 border-gray-800 rounded-lg ${className}`}>
      <MDEditor
        value={value || ""}
        onChange={onChange}
        preview="live"
        height={500}
        data-color-mode="light"
        className="w-full"
        previewOptions={{
          components: {
            code: ({ children, className, ...props }) => {
              const codeContent = children?.toString() || "";
              const language = className?.replace("language-", "") || "";
              
              // Kiểm tra nếu là Mermaid
              if (language === "mermaid" || 
                  codeContent.trim().startsWith("graph") ||
                  codeContent.trim().startsWith("sequenceDiagram") ||
                  codeContent.trim().startsWith("flowchart") ||
                  codeContent.trim().startsWith("classDiagram") ||
                  codeContent.trim().startsWith("stateDiagram") ||
                  codeContent.trim().startsWith("pie") ||
                  codeContent.trim().startsWith("gantt") ||
                  codeContent.trim().startsWith("gitGraph") ||
                  codeContent.trim().startsWith("erDiagram") ||
                  codeContent.trim().startsWith("journey") ||
                  codeContent.trim().startsWith("quadrantChart") ||
                  codeContent.trim().startsWith("requirementDiagram") ||
                  codeContent.trim().startsWith("timeline") ||
                  codeContent.trim().startsWith("c4Diagram") ||
                  codeContent.trim().startsWith("mindmap") ||
                  codeContent.trim().startsWith("gitgraph") ||
                  codeContent.trim().startsWith("zenuml") ||
                  codeContent.trim().startsWith("blockdiag") ||
                  codeContent.trim().startsWith("packetdiag") ||
                  codeContent.trim().startsWith("rackdiag") ||
                  codeContent.trim().startsWith("actdiag") ||
                  codeContent.trim().startsWith("nwdiag") ||
                  codeContent.trim().startsWith("seqdiag") ||
                  codeContent.trim().startsWith("c4plantuml") ||
                  codeContent.trim().startsWith("plantuml") ||
                  codeContent.trim().startsWith("@startuml") ||
                  codeContent.trim().startsWith("@start")) {
                return (
                  <MermaidDiagram
                    content={codeContent}
                    className="w-full"
                    {...props}
                  />
                );
              }
              
              // Render code block thông thường
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          },
        }}
      />
    </div>
  );
}