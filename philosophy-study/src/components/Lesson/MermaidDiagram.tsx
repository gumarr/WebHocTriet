import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  content: string;
  className?: string;
  theme?: "default" | "dark" | "forest" | "neutral";
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  content,
  className = "",
  theme = "default",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Configure mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: theme,
      themeVariables: {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
        fontSize: "14px",
        primaryColor: "#6366f1",
        primaryTextColor: "#ffffff",
        primaryBorderColor: "#4f46e5",
        lineColor: "#94a3b8",
        secondaryColor: "#f1f5f9",
        tertiaryColor: "#e2e8f0",
        background: "#ffffff",
        mainBkg: "#ffffff",
        secondBkg: "#f8fafc",
        tertiaryBkg: "#f1f5f9",
        fourthBkg: "#e2e8f0",
        nodeBorder: "#94a3b8",
        nodeSpacing: 50,
        padding: 20,
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
      },
      sequence: {
        wrap: true,
        wrapPadding: 50,
      },
      gantt: {
        barHeight: 20,
        fontSize: 14,
      },
    });

    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        setError(null);
        
        // Clean up previous diagram
        containerRef.current.innerHTML = "";

        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Render the diagram
        const { svg, bindFunctions } = await mermaid.render(id, content);
        
        // Set the SVG content
        containerRef.current.innerHTML = svg;
        
        // Bind any interactive functions if they exist
        if (bindFunctions) {
          bindFunctions(containerRef.current);
        }
      } catch (err) {
        console.error("Mermaid diagram error:", err);
        setError(err instanceof Error ? err.message : "Failed to render diagram");
      }
    };

    renderDiagram();
  }, [content, theme]);

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <span className="text-red-500">❌</span>
          <span className="font-medium text-red-800">Lỗi sơ đồ:</span>
        </div>
        <p className="text-red-600 mt-1 text-sm">{error}</p>
        <div className="mt-2">
          <p className="text-sm text-gray-600">Nội dung sơ đồ:</p>
          <pre className="bg-white p-2 rounded mt-1 text-xs overflow-auto max-h-32">
            {content}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`mermaid-diagram ${className}`}
      style={{
        width: "100%",
        minHeight: "200px",
        background: theme === "dark" ? "#1e293b" : "#ffffff",
        borderRadius: "8px",
        padding: "16px",
        border: theme === "dark" ? "1px solid #334155" : "1px solid #e2e8f0",
      }}
    />
  );
};

// Enhanced MermaidDiagram with animation
export const AnimatedMermaidDiagram: React.FC<MermaidDiagramProps & { delay?: number }> = ({
  content,
  className = "",
  theme = "default",
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <div
        className={`transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <MermaidDiagram content={content} theme={theme} />
      </div>
    </div>
  );
};

// Predefined diagram templates for common philosophy concepts
export const PhilosophyDiagrams = {
  // Vấn đề cơ bản của triết học
  basicPhilosophyProblem: `graph TD
    Root["<b>VẤN ĐỀ CƠ BẢN CỦA TRIẾT HỌC</b><br/>(Mối quan hệ giữa Tư duy và Tồn tại)"]
    
    Root --> M1["<b>Mặt thứ nhất</b><br/>(Bản thể luận)"]
    Root --> M2["<b>Mặt thứ hai</b><br/>(Nhận thức luận)"]
    
    M1 --> Q1["Vật chất hay ý thức<br/>cái nào quyết định?"]
    Q1 --> DV["Duy vật"]
    Q1 --> DT["Duy tâm"]
    
    M2 --> Q2["Có thể nhận thức<br/>thế giới hay không?"]
    Q2 --> KT["Khả tri"]
    Q2 --> BKT["Bất khả tri"]
    
    DV & DT --> TGQ["ẢNH HƯỞNG ĐẾN:<br/>Thế giới quan"]
    
    style Root fill:#1e293b,stroke:#4ade80,stroke-width:2px,color:#fff
    style TGQ fill:#1e293b,stroke:#facc15,stroke-width:2px,color:#fff
    style DV fill:#34d399,stroke:#059669,stroke-width:2px,color:#fff
    style DT fill:#f87171,stroke:#dc2626,stroke-width:2px,color:#fff
    style KT fill:#60a5fa,stroke:#2563eb,stroke-width:2px,color:#fff
    style BKT fill:#fbbf24,stroke:#d97706,stroke-width:2px,color:#fff`,

  // Các hình thức biện chứng
  dialecticalForms: `graph LR
    BD["<b>BIỆN CHỨNG</b>"]
    
    BD --> BD1["<b>Tự phát</b><br/>(Cổ đại)"]
    BD --> BD2["<b>Duy tâm</b><br/>(Hegel)"]
    BD --> BD3["<b>Duy vật</b><br/>(Mác - Ăngghen)"]
    
    BD1 --> C1["Nhìn thế giới<br/>trong vận động"]
    BD2 --> C2["Ý niệm tuyệt đối<br/>tự triển khai"]
    BD3 --> C3["Vật chất quyết định<br/>ý thức"]
    
    style BD fill:#1e293b,stroke:#4ade80,stroke-width:3px,color:#fff
    style BD3 fill:#34d399,stroke:#059669,stroke-width:2px,color:#fff`,

  // Chủ nghĩa duy vật
  materialismForms: `graph TD
    DV["<b>CHỦ NGHĨA DUY VẬT</b>"]
    
    DV --> DV1["<b>Chất phác</b><br/>(Cổ đại)"]
    DV --> DV2["<b>Siêu hình</b><br/>(TK XV-XVIII)"]
    DV --> DV3["<b>Biện chứng</b><br/>(TK XIX)"]
    
    DV1 --> C1["Đồng nhất vật chất<br/>với chất cụ thể"]
    DV2 --> C2["Nhìn thế giới<br/>như cỗ máy"]
    DV3 --> C3["Vật chất quyết định<br/>ý thức"]
    
    style DV fill:#1e293b,stroke:#4ade80,stroke-width:3px,color:#fff
    style DV3 fill:#34d399,stroke:#059669,stroke-width:2px,color:#fff`,

  // Chủ nghĩa duy tâm
  idealismForms: `graph TD
    DT["<b>CHỦ NGHĨA DUY TÂM</b>"]
    
    DT --> DT1["<b>Chủ quan</b><br/>(Cảm giác là thực tại)"]
    DT --> DT2["<b>Khách quan</b><br/>(Ý niệm tuyệt đối)"]
    
    DT1 --> C1["Mọi sự vật chỉ là<br/>phức hợp cảm giác"]
    DT2 --> C2["Tồn tại tinh thần<br/>khách quan"]
    
    style DT fill:#1e293b,stroke:#4ade80,stroke-width:3px,color:#fff
    style DT1 fill:#f87171,stroke:#dc2626,stroke-width:2px,color:#fff
    style DT2 fill:#f87171,stroke:#dc2626,stroke-width:2px,color:#fff`,

  // Phương pháp biện chứng vs siêu hình
  methodsComparison: `graph TB
    PP["<b>PHƯƠNG PHÁP NHẬN THỨC</b>"]
    
    PP --> PB["<b>Biện chứng</b>"]
    PP --> PS["<b>Siêu hình</b>"]
    
    PB --> PB1["Toàn diện"]
    PB --> PB2["Lịch sử"]
    PB --> PB3["Phát triển"]
    
    PS --> PS1["Cô lập"]
    PS --> PS2["Tĩnh tại"]
    PS --> PS3["Tuyệt đối"]
    
    style PP fill:#1e293b,stroke:#4ade80,stroke-width:3px,color:#fff
    style PB fill:#34d399,stroke:#059669,stroke-width:2px,color:#fff
    style PS fill:#f87171,stroke:#dc2626,stroke-width:2px,color:#fff`,

  // Thế giới quan
  worldviewForms: `graph TD
    TGQ["<b>THẾ GIỚI QUAN</b>"]
    
    TGQ --> TGQ1["<b>Tôn giáo</b><br/>(Dựa trên niềm tin)"]
    TGQ --> TGQ2["<b>Khoa học</b><br/>(Dựa trên lý trí)"]
    TGQ --> TGQ3["<b>Triết học</b><br/>(Dựa trên lý luận)"]
    
    TGQ3 --> DVBD["<b>Duy vật biện chứng</b><br/>(Toàn diện, lịch sử, phát triển)"]
    
    style TGQ fill:#1e293b,stroke:#4ade80,stroke-width:3px,color:#fff
    style DVBD fill:#34d399,stroke:#059669,stroke-width:2px,color:#fff`,
};

// Hook for managing mermaid diagrams
export const useMermaid = () => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      themeVariables: {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
        fontSize: "14px",
        primaryColor: "#6366f1",
        primaryTextColor: "#ffffff",
        primaryBorderColor: "#4f46e5",
        lineColor: "#94a3b8",
        secondaryColor: "#f1f5f9",
        tertiaryColor: "#e2e8f0",
        background: "#ffffff",
        mainBkg: "#ffffff",
        secondBkg: "#f8fafc",
        tertiaryBkg: "#f1f5f9",
        fourthBkg: "#e2e8f0",
        nodeBorder: "#94a3b8",
        nodeSpacing: 50,
        padding: 20,
      },
    });
  }, []);

  const renderDiagram = async (elementId: string, content: string) => {
    try {
      const { svg, bindFunctions } = await mermaid.render(elementId, content);
      return { svg, bindFunctions };
    } catch (error) {
      console.error("Mermaid render error:", error);
      throw error;
    }
  };

  return { renderDiagram };
};