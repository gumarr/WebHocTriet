-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.chapters (
  title text NOT NULL,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT chapters_pkey PRIMARY KEY (id)
);
CREATE TABLE public.flashcards (
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  difficulty text CHECK (difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])),
  review_count integer DEFAULT 0,
  correct_count integer DEFAULT 0,
  is_marked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  last_reviewed timestamp with time zone,
  updated_at timestamp with time zone DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lesson_id uuid,
  CONSTRAINT flashcards_pkey PRIMARY KEY (id),
  CONSTRAINT flashcards_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.lessons (
  title text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  summary text,
  content text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  chapter_id uuid,
  CONSTRAINT lessons_pkey PRIMARY KEY (id),
  CONSTRAINT lessons_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text UNIQUE,
  role text DEFAULT 'admin'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.sections (
  title text NOT NULL,
  content text NOT NULL,
  display_order integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lesson_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sections_pkey PRIMARY KEY (id),
  CONSTRAINT sections_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.test_lessons (
  test_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT test_lessons_pkey PRIMARY KEY (test_id, lesson_id),
  CONSTRAINT test_lessons_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id),
  CONSTRAINT test_lessons_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.test_questions (
  question text NOT NULL,
  options ARRAY NOT NULL,
  correct_answer integer NOT NULL,
  explanation text,
  difficulty text CHECK (difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])),
  category text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  test_id uuid,
  CONSTRAINT test_questions_pkey PRIMARY KEY (id),
  CONSTRAINT test_questions_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id)
);
CREATE TABLE public.tests (
  title text NOT NULL,
  description text,
  duration integer,
  total_questions integer,
  passing_score integer,
  updated_at timestamp with time zone DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tests_pkey PRIMARY KEY (id)
);