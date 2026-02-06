// import { createClient } from "@supabase/supabase-js";
// import * as dotenv from "dotenv";
// import { chapters } from "../../data/chapters"; // File chứa data đồ sộ của bạn

// // Load environment variables from .env.local file
// dotenv.config({ path: ".env.local" });

// // Generate UUID v4
// function generateUUID(): string {
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//     const r = (Math.random() * 16) | 0;
//     const v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

// // SỬ DỤNG SERVICE_ROLE_KEY ĐỂ CÓ QUYỀN GHI ADMIN
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
// );

// // Kiểm tra kết nối và quyền
// async function checkConnection() {
//   try {
//     const { count, error } = await supabase
//       .from("chapters")
//       .select("*", { count: "exact", head: true });
//     if (error) throw error;
//     console.log("✅ Kết nối Supabase thành công");
//     return true;
//   } catch (error) {
//     console.error("❌ Lỗi kết nối Supabase:", error);
//     console.log("Vui lòng kiểm tra:");
//     console.log("1. NEXT_PUBLIC_SUPABASE_URL trong .env");
//     console.log("2. SUPABASE_SERVICE_ROLE_KEY trong .env");
//     console.log("3. Đảm bảo đã tạo các bảng trong Supabase");
//     return false;
//   }
// }

// async function migrateData() {
//   // Kiểm tra kết nối trước
//   const isConnected = await checkConnection();
//   if (!isConnected) {
//     console.log("❌ Migration bị hủy do lỗi kết nối");
//     return;
//   }

//   console.log("🚀 Bắt đầu quá trình đẩy dữ liệu...");

//   for (const chapter of chapters) {
//     console.log(`📚 Đang xử lý chương: ${chapter.title}`);

//     // Generate UUID for chapter if it doesn't have a proper UUID
//     const chapterId = chapter.id.includes("-") ? chapter.id : generateUUID();

//     // 1. Chèn Chapter
//     const { data: chapterData, error: chapterError } = await supabase
//       .from("chapters")
//       .upsert({
//         id: chapterId,
//         title: chapter.title,
//         description: chapter.description,
//         order: chapter.order,
//         image_url: chapter.imageUrl,
//       })
//       .select()
//       .single();

//     if (chapterError) {
//       console.error(`❌ Lỗi Chapter ${chapter.title}:`, chapterError.message);
//       continue;
//     }

//     for (const lesson of chapter.lessons) {
//       console.log(`  📖 Đang xử lý bài: ${lesson.title}`);

//       // Generate UUID for lesson if it doesn't have a proper UUID
//       const lessonId = lesson.id.includes("-") ? lesson.id : generateUUID();

//       // 2. Chèn Lesson
//       const { data: lessonData, error: lessonError } = await supabase
//         .from("lessons")
//         .upsert({
//           id: lessonId,
//           chapter_id: chapterId,
//           title: lesson.title,
//           order: lesson.order,
//           summary: lesson.summary,
//           content: lesson.content,
//         })
//         .select()
//         .single();

//       if (lessonError) {
//         console.error(
//           `    ❌ Lỗi Lesson ${lesson.title}:`,
//           lessonError.message,
//         );
//         continue;
//       }

//       // 3. Chèn Sections (Nếu có)
//       if (lesson.sections && lesson.sections.length > 0) {
//         console.log(`    📝 Đang chèn ${lesson.sections.length} sections`);
//         const { error: sectionError } = await supabase.from("sections").upsert(
//           lesson.sections.map((s) => ({
//             ...s,
//             lesson_id: lessonId,
//             id: generateUUID(),
//           })),
//         );

//         if (sectionError) {
//           console.error(`    ❌ Lỗi chèn sections:`, sectionError.message);
//         }
//       }

//       // 4. Chèn Flashcards
//       if (lesson.flashcards && lesson.flashcards.length > 0) {
//         console.log(`    🎴 Đang chèn ${lesson.flashcards.length} flashcards`);
//         const { error: flashcardError } = await supabase
//           .from("flashcards")
//           .upsert(
//             lesson.flashcards.map((f, index) => ({
//               id: generateUUID(),
//               question: f.question,
//               answer: f.answer,
//               category: f.category,
//               difficulty: f.difficulty,
//               lesson_id: lessonId,
//             })),
//           );

//         if (flashcardError) {
//           console.error(`    ❌ Lỗi chèn flashcards:`, flashcardError.message);
//         }
//       }

//       // 5. Chèn Test & Questions
//       if (lesson.test) {
//         console.log(
//           `    🧪 Đang chèn test với ${lesson.test.questions.length} câu hỏi`,
//         );
//         const testId = generateUUID();
//         const { data: testData, error: testError } = await supabase
//           .from("tests")
//           .upsert({
//             id: testId,
//             lesson_id: lessonId,
//             title: lesson.test.title,
//             duration: lesson.test.duration,
//           })
//           .select()
//           .single();

//         if (testError) {
//           console.error(`    ❌ Lỗi chèn test:`, testError.message);
//         } else if (
//           testData &&
//           lesson.test.questions &&
//           lesson.test.questions.length > 0
//         ) {
//           const { error: questionError } = await supabase
//             .from("test_questions")
//             .upsert(
//               lesson.test.questions.map((q, index) => ({
//                 id: generateUUID(),
//                 test_id: testId,
//                 question: q.question,
//                 options: q.options,
//                 correct_answer: q.correctAnswer,
//                 explanation: q.explanation,
//               })),
//             );

//           if (questionError) {
//             console.error(`    ❌ Lỗi chèn questions:`, questionError.message);
//           }
//         }
//       }
//       console.log(`  ✅ Hoàn thành bài: ${lesson.title}`);
//     }
//     console.log(`✅ Hoàn thành chương: ${chapter.title}`);
//   }
//   console.log("🏁 Hoàn thành migration!");
// }

// // Chạy migration
// migrateData().catch(console.error);
