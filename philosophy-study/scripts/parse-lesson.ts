// import fs from "fs";
// import path from "path";
// import mammoth from "mammoth";

// // 1. CẤU HÌNH DANH SÁCH FILE (MAPPING)
// // Cột trái là tên file DOCX trong thư mục documents
// // Cột phải là tên file JSON đích bạn muốn xuất ra
// const LESSON_MAP = [
//   {
//     input: "VanDeCoBanCuaTrietHoc.docx",
//     output: "01-van-de-co-ban-cua-triet-hoc",
//   },
//   { input: "TrietHocTrongDoiSong.docx", output: "02-triet-hoc-trong-doi-song" },
//   { input: "VatChatVaYThuc.docx", output: "03-vat-chat-va-y-thuc" },
//   { input: "BienChungDuyVat.docx", output: "04-bien-chung-duy-vat" },
//   { input: "LyLuanNhanThuc.docx", output: "05-ly-luan-nhan-thuc" },
//   { input: "TrietHocVeConNguoi.docx", output: "06-triet-hoc-ve-con-nguoi" },
//   { input: "YThucXaHoi.docx", output: "07-y-thuc-xa-hoi" },
//   {
//     input: "NhaNuocVaCachMangXaHoi.docx",
//     output: "08-nha-nuoc-va-cach-mang-xa-hoi",
//   },
//   { input: "GiaiCapVaDanToc.docx", output: "09-giai-cap-va-dan-toc" },
//   {
//     input: "HọcThuyetHinhThaiKinhTeXaHoi.docx",
//     output: "10-hoc-thuyet-hinh-thai-kinh-te-xa-hoi",
//   },
// ];

// // Định nghĩa cấu trúc dữ liệu đầu ra
// interface ContentBlock {
//   title: string;
//   level: number; // 1 (I-), 2 (1.), 3 (a))
//   body: string;
// }

// // Hàm xử lý chính
// async function main() {
//   console.log("🚀 Bắt đầu chuyển đổi hàng loạt...");

//   const documentsDir = path.join(process.cwd(), "documents");
//   const outputDir = path.join(process.cwd(), "src/data");

//   // Tạo thư mục output nếu chưa có
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
//   }

//   // Duyệt qua từng bài trong danh sách
//   for (const lesson of LESSON_MAP) {
//     const inputPath = path.join(documentsDir, lesson.input);
//     const outputPath = path.join(outputDir, `${lesson.output}.json`);

//     console.log(`\n📄 Đang xử lý: ${lesson.input}...`);

//     if (!fs.existsSync(inputPath)) {
//       console.warn(`⚠️ Bỏ qua: Không tìm thấy file ${lesson.input}`);
//       continue;
//     }

//     try {
//       // Đọc file
//       const result = await mammoth.extractRawText({ path: inputPath });
//       const text = result.value;

//       // Phân tích nội dung
//       const blocks = parseContent(text);

//       // Ghi file JSON
//       fs.writeFileSync(outputPath, JSON.stringify(blocks, null, 2), "utf-8");
//       console.log(
//         `✅ Xong! Đã xuất ra: ${lesson.output}.json (${blocks.length} mục)`,
//       );
//     } catch (error) {
//       console.error(`❌ Lỗi khi xử lý file ${lesson.input}:`, error);
//     }
//   }

//   console.log("\n🎉 HOÀN THÀNH TẤT CẢ!");
// }

// // Hàm tách nội dung (Regex đã được tinh chỉnh cho tài liệu của bạn)
// function parseContent(text: string): ContentBlock[] {
//   // Tách dòng và làm sạch
//   const lines = text.split("\n").filter((line) => line.trim() !== "");
//   const blocks: ContentBlock[] = [];

//   let currentBlock: ContentBlock | null = null;
//   let buffer: string[] = [];

//   const saveBlock = () => {
//     if (currentBlock) {
//       currentBlock.body = buffer.join("\n").trim();
//       // Chỉ lưu nếu có nội dung hoặc tiêu đề
//       if (currentBlock.body || currentBlock.title) {
//         blocks.push(currentBlock);
//       }
//     }
//     buffer = [];
//   };

//   for (const line of lines) {
//     const trimmed = line.trim();

//     // Regex nhận diện tiêu đề (Dựa trên tài liệu nguồn)

//     // Cấp 1: Số La Mã + dấu gạch ngang hoặc chấm (VD: "I-", "II.", "A.")
//     // Thêm trường hợp "A." "B." cho các phần MỤC TIÊU/NỘI DUNG
//     const level1Regex = /^([IVX]+|[ABC])(?:\-|\.)\s+(.+)$/;

//     // Cấp 2: Số Ả Rập + chấm (VD: "1. ", "2. ")
//     const level2Regex = /^(\d+)\.\s+(.+)$/;

//     // Cấp 3: Chữ cái + ngoặc đơn (VD: "a) ", "b) ")
//     const level3Regex = /^([a-z])\)\s+(.+)$/;

//     let match;

//     // Kiểm tra Level 1
//     if ((match = trimmed.match(level1Regex))) {
//       saveBlock();
//       currentBlock = { title: trimmed, level: 1, body: "" };
//       continue;
//     }

//     // Kiểm tra Level 2
//     if ((match = trimmed.match(level2Regex))) {
//       saveBlock();
//       currentBlock = { title: trimmed, level: 2, body: "" };
//       continue;
//     }

//     // Kiểm tra Level 3
//     if ((match = trimmed.match(level3Regex))) {
//       saveBlock();
//       currentBlock = { title: trimmed, level: 3, body: "" };
//       continue;
//     }

//     // Nếu không phải tiêu đề thì là nội dung
//     if (currentBlock) {
//       buffer.push(trimmed);
//     } else {
//       // Xử lý phần mở đầu chưa có tiêu đề (Ví dụ: tên chương)
//       currentBlock = { title: "Giới thiệu / Mở đầu", level: 0, body: "" };
//       buffer.push(trimmed);
//     }
//   }
//   saveBlock(); // Lưu block cuối cùng
//   return blocks;
// }

// // Chạy hàm main
// main();
