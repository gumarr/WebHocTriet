export interface Document {
  id: string;
  title: string;
  category: "slide" | "doc" | "sheet";
  description?: string;
  source_type: "upload" | "link";
  file_path?: string;
  file_extension?: string;
  external_url?: string;
  display_order: number;
  created_at: Date;
  updated_at: Date;
  linked_lessons?: DocumentLesson[];
}

export interface DocumentLesson {
  document_id: string;
  lesson_id: string;
  lesson?: {
    id: string;
    title: string;
    chapter_id: string;
    chapter?: {
      id: string;
      title: string;
    };
  };
}

export interface DocumentFormData {
  title: string;
  category: "slide" | "doc" | "sheet";
  description?: string;
  source_type: "upload" | "link";
  file?: File;
  external_url?: string;
  linked_lesson_ids: string[];
  display_order: number;
}