import { Lesson } from "../../src/lib/types/lesson";

export const vanDeCoBanCuaTrietHoc: Lesson = {
  id: "01-van-de-co-ban-cua-triet-hoc",
  title: "Vấn đề Cơ bản của Triết học",
  chapterId: "chapter-1",
  order: 1,
  summary:
    "Tìm hiểu về nguồn gốc, khái niệm, đối tượng và vai trò của triết học; vấn đề cơ bản của triết học gồm chủ nghĩa duy vật, chủ nghĩa duy tâm, thuyết khả tri và bất khả tri; các hình thức biện chứng và siêu hình trong lịch sử.",
  sections: [
    {
      id: "section-1",
      title: "1. Khái lược về triết học",
      content: `
## 🌟 **Triết học - Hành trình khám phá bản chất thế giới**

### 📜 **Nguồn gốc nhận thức: Từ huyền thoại đến lý trí**

**🎯 Câu chuyện lịch sử**: 
> *Hình ảnh minh họa: Người nguyên thủy nhìn lên bầu trời đầy sao, rồi đến các triết gia Hy Lạp cổ đại đang tranh luận*

**🔄 Hành trình tư duy**:
- **Thời kỳ nguyên thủy**: Con người giải thích thế giới bằng các câu chuyện thần thoại
- **Thời kỳ cổ đại**: Con người bắt đầu dùng lý trí để giải thích thế giới

**💡 Ví dụ minh họa**:
- **Cổ đại**: Sấm sét là do thần Zeus nổi giận
- **Hiện đại**: Sấm sét là hiện tượng vật lý do sự phóng điện trong khí quyển

### 🏛️ **Nguồn gốc xã hội: Khi xã hội phát triển, triết học ra đời**

**✅ **Điều kiện ra đời**:
- **Phân công lao động**: Lao động trí óc tách khỏi lao động chân tay
- **Xã hội có giai cấp**: Cần lý luận để giải thích trật tự xã hội
- **Tư hữu hóa**: Cần lý luận bảo vệ quyền lợi giai cấp

**📊 **Sơ đồ phát triển**:
\`\`\`mermaid
graph TD
    %% Hàng trên: Tiến trình xã hội
    A[Xã hội nguyên thủy] --> B[Xã hội có giai cấp]
    B --> C[Triết học ra đời]

    %% Hàng dưới: Đặc điểm/Nguồn gốc
    A --> D[Cộng đồng]
    B --> E[Giai cấp]
    C --> F[Lý luận hệ thống]

    %% Định dạng màu sắc để dễ phân biệt
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px

    %% 1. Định nghĩa một "lớp" style (CSS-like)
    classDef dashedBox fill:#fff,stroke:#333,stroke-dasharray: 5 5
    
    %% 2. Áp dụng lớp đó cho các node cụ thể
    class D,E,F dashedBox
\`\`\`

### 🧠 **Khái niệm triết học: Nghệ thuật yêu mến sự thông thái**

**🌍 **Theo các nền văn minh**:

| Nền văn minh | Thuật ngữ   | Ý nghĩa                |
|--------------|-------------|------------------------|
| Hy Lạp       | Philosophia | Yêu mến sự thông thái  |
| Trung Hoa    | Triết học   | Truy tìm bản chất      |
| Ấn Độ        | Dar'sana    | Chiêm ngưỡng, suy ngẫm |

**🎯 **Định nghĩa dễ hiểu**:

> **"Triết học là nghệ thuật đặt câu hỏi lớn nhất về cuộc sống và tìm kiếm câu trả lời sâu sắc nhất"**

**💡 **Ví dụ minh họa**:
- **Câu hỏi thường ngày**: "Hôm nay ăn gì?"
- **Câu hỏi triết học**: "Tại sao con người cần ăn uống để tồn tại?"

### 🎭 **Đối tượng của triết học trong lịch sử**

**📚 **Triết học qua các thời kỳ**:

| Thời kỳ | Đặc điểm | Ví dụ |
|---------|----------|-------|
| Cổ đại | "Khoa học của các khoa học" | Toán học, vật lý, thiên văn |
| Trung cổ | Nữ tì của thần học | Triết học kinh viện |
| Hiện đại | Khoa học về quy luật chung | Triết học Mác - Lênin |

**💡 **Triết học là gì?**
- **Hình thái ý thức xã hội** đặc biệt
- **Hệ thống quan điểm lý luận** chung nhất về thế giới
- **Hạt nhân của thế giới quan**
- **Khoa học về quy luật** vận động, phát triển của tự nhiên, xã hội và tư duy

### 🌐 **Triết học - Hạt nhân lý luận của thế giới quan**

**🧠 **Thế giới quan là gì?**

> **"Thế giới quan là hệ thống quan điểm của con người về thế giới và vị trí của con người trong thế giới đó"**

**🧩 **Các thành phần chủ yếu**:
1. **Tri thức** - Cơ sở lý luận
2. **Niềm tin** - Cơ sở tinh thần  
3. **Lý tưởng** - Cơ sở hành động

**🎭 **Các hình thức thế giới quan**:

| Hình thức | Đặc điểm | Ví dụ |
|----------|----------|-------|
| Tôn giáo | Dựa trên niềm tin | Kitô giáo, Phật giáo |
| Khoa học | Dựa trên lý trí | Thế giới quan duy vật |
| Triết học | Dựa trên lý luận | Chủ nghĩa Mác-Lênin |

**💡 **Tại sao triết học là hạt nhân?**
- Triết học chi phối mọi thế giới quan
- Dù người ta có thừa nhận hay không
- Triết học quyết định cách nhìn nhận và hành động của con người
      `,
    },
    {
      id: "section-2",
      title: "2. Vấn đề cơ bản của triết học",
      content: `
## ⚖️ **Vấn đề cơ bản: Mối quan hệ giữa tư duy và tồn tại**

### 🎯 **Nội dung vấn đề cơ bản**

**❓ **Hai câu hỏi lớn**:

**1️⃣ Mặt thứ nhất**: Vật chất hay ý thức cái nào quyết định cái nào?

**2️⃣ Mặt thứ hai**: Con người có thể nhận thức được thế giới hay không?

### 🏗️ **Chủ nghĩa duy vật: Vật chất quyết định ý thức**

**📊 **Ba hình thức phát triển**:

| Hình thức | Thời kỳ | Đặc điểm | Đại diện |
|-----------|---------|----------|----------|
| **Chất phác** | Cổ đại | Đồng nhất vật chất với chất cụ thể | Thales, Anaximenes |
| **Siêu hình** | XV-XVIII | Nhìn thế giới như cỗ máy | Bacon, Hobbes |
| **Biện chứng** | XIX | Nhìn thế giới trong mối liên hệ | Mác, Ăngghen |

**💡 **Ví dụ minh họa**:
- **Chủ nghĩa duy vật**: "Có thực mới vực được đạo"
- **Chủ nghĩa duy tâm**: "Tâm sinh tướng"

### 🧠 **Chủ nghĩa duy tâm: Ý thức quyết định vật chất**

**🎭 **Hai phái chính**:

| Phái | Quan điểm | Ví dụ |
|------|-----------|-------|
| **Chủ quan** | Cảm giác là thực tại | "Tôi tư duy, nên tôi tồn tại" |
| **Khách quan** | Ý niệm tuyệt đối là thực tại | Hegel: Tinh thần tuyệt đối |

**⚠️ **Sai lầm cố ý**:
- **Tuyệt đối hóa** một mặt của quá trình nhận thức
- **Thần thánh hóa** đặc tính nào đó của tư duy
- **Phiến diện** trong cách xem xét

### 🎯 **Thuyết khả tri: Con người có thể nhận thức thế giới**

**✅ **Đặc điểm**:
- **Tự tin** vào khả năng nhận thức
- **Chủ động** tìm hiểu thế giới
- **Phát triển** tri thức khoa học

**💡 **Ví dụ minh họa**:
> *Hình ảnh: Nhà khoa học đang nghiên cứu, khám phá các hiện tượng tự nhiên*

### 🚫 **Thuyết bất khả tri: Con người không thể nhận thức thế giới**

**❌ **Đặc điểm**:
- **Hoài nghi** về khả năng nhận thức
- **Hạn chế** trong việc khám phá thế giới
- **Thụ động** trước hiện thực

**👥 **Đại biểu tiêu biểu**:
- **D. Hume**: Chỉ biết được ấn tượng và ý niệm
- **I. Kant**: Chỉ biết được hiện tượng, không biết vật tự nó

**💡 **Ví dụ minh họa**:
> *Hình ảnh: Một cái cây đứng yên, không có sự thay đổi*

### 🔄 **Phương pháp biện chứng: Nhìn thế giới trong vận động**

**✅ **Ba đặc điểm chính**:
1. **Toàn diện**: Nhìn sự vật trong mối liên hệ
2. **Lịch sử**: Nhìn sự vật trong quá trình phát triển
3. **Phát triển**: Nhìn sự vật trong trạng thái vận động

**💡 **Ví dụ minh họa**:
> *Hình ảnh: Cây non → Cây lớn → Cây già → Cây chết*

### 📏 **Phương pháp siêu hình: Nhìn thế giới trong tĩnh tại**

**❌ **Ba đặc điểm chính**:
1. **Cô lập**: Tách rời sự vật khỏi mối liên hệ
2. **Tĩnh tại**: Đồng nhất sự vật với trạng thái hiện tại
3. **Tuyệt đối**: Coi ranh giới giữa các mặt đối lập là tuyệt đối

**⚠️ **Hạn chế**:
- **Ph. Ăngghen phê phán**: "Chỉ nhìn thấy cây mà không thấy rừng"
- **Không phản ánh đúng hiện thực**
- **Hạn chế trong nghiên cứu khoa học**
      `,
    },
    {
      id: "section-3",
      title: "3. Biện chứng và siêu hình",
      content: `
## 🔄 **Phương pháp tư duy: Biện chứng vs Siêu hình**

### 🎯 **Khái niệm biện chứng và siêu hình**

**📚 **Nguồn gốc từ ngữ**:
- **Biện chứng**: Nghệ thuật tranh luận để tìm chân lý (Socrates)
- **Siêu hình**: Khoa học siêu cảm tính, phi thực nghiệm (Aristotle)

### 📊 **So sánh hai phương pháp**

| Tiêu chí | Biện chứng | Siêu hình |
|----------|------------|-----------|
| **Cách nhìn** | Toàn diện, liên hệ | Cô lập, tách rời |
| **Trạng thái** | Vận động, phát triển | Tĩnh tại, bất biến |
| **Mâu thuẫn** | Đấu tranh, chuyển hóa | Tuyệt đối, bất khả dung |
| **Phản ánh** | Đúng hiện thực | Sai lệch hiện thực |

### 🔄 **Phương pháp biện chứng**

**✅ **Đặc điểm nổi bật**:
- **Toàn diện**: Nhìn sự vật trong mối liên hệ phổ biến
- **Lịch sử**: Nhìn sự vật trong quá trình phát triển
- **Phát triển**: Nhìn sự vật trong trạng thái vận động biến đổi

**💡 **Ví dụ minh họa**:
> *Hình ảnh: Cây non → Cây lớn → Cây già → Cây chết*

**🧠 **Tư duy biện chứng**:
- **Mềm dẻo, linh hoạt**
- **Không tuyệt đối hóa ranh giới**
- **Thừa nhận cái này lẫn cái kia**
- **Thực hiện sự môi giới giữa các mặt đối lập**

### 📏 **Phương pháp siêu hình**

**❌ **Đặc điểm nổi bật**:
- **Cô lập**: Tách rời đối tượng khỏi các quan hệ
- **Tĩnh tại**: Đồng nhất đối tượng với trạng thái tĩnh nhất thời
- **Tuyệt đối**: Coi ranh giới giữa các mặt đối lập là tuyệt đối

**⚠️ **Hạn chế nghiêm trọng**:
- **Chỉ nhìn thấy cây mà không thấy rừng** (Ph. Ăngghen)
- **Không phản ánh đúng hiện thực**
- **Hạn chế trong nghiên cứu khoa học**

**💡 **Ví dụ minh họa**:
> *Hình ảnh: Một cái cây đứng yên, không có sự thay đổi*

### 🎭 **Các hình thức biện chứng trong lịch sử**

**📊 **Ba hình thức phát triển**:

| Hình thức | Thời kỳ | Đặc điểm | Đại diện |
|-----------|---------|----------|----------|
| **Tự phát** | Cổ đại | Trực kiến, chưa có nghiên cứu khoa học | Phương Đông & Tây |
| **Duy tâm** | Cổ điển Đức | Biện chứng bắt đầu từ tinh thần | Kant, Hegel |
| **Duy vật** | XIX | Biện chứng dựa trên chủ nghĩa duy vật | Mác, Ăngghen |

### 🏛️ **Phương pháp siêu hình trong lịch sử**

**📚 **Nguồn gốc**:
- **Khoa học cơ học cổ điển**: Newton, Galileo
- **Phương pháp toán học và vật lý học cổ điển**
- **Phân tích từng bộ phận riêng biệt**

**⚠️ **Hạn chế**:
- **Chỉ phù hợp trong phạm vi nhất định**
- **Không phản ánh được mối liên hệ phổ biến**
- **Không giải thích được sự vận động, phát triển**

### 🎯 **Ứng dụng thực tiễn**

**🏫 **Trong học tập**:
- **Tư duy biện chứng**: Nhìn nhận vấn đề toàn diện, phát triển
- **Tư duy siêu hình**: Cần tránh trong nghiên cứu khoa học

**🏢 **Trong công việc**:
- **Chủ nghĩa duy vật**: Dựa vào thực tế, khách quan
- **Chủ nghĩa duy tâm**: Cần thận trọng với suy diễn chủ quan

**🤝 **Trong giao tiếp**:
- **Thuyết khả tri**: Tự tin vào khả năng hiểu người khác
- **Thuyết bất khả tri**: Cẩn trọng trong đánh giá, nhận định
      `,
    },
    {
      id: "section-4",
      title: "Sơ đồ tư duy - Vấn đề cơ bản của triết học",
      content: `
## 🎨 **SƠ ĐỒ TƯ DUY - VẤN ĐỀ CƠ BẢN CỦA TRIẾT HỌC**

\`\`\`mermaid
graph TD
    %% Định nghĩa nút gốc
    Root["<b>VẤN ĐỀ CƠ BẢN CỦA TRIẾT HỌC</b><br/>(Mối quan hệ giữa Tư duy và Tồn tại)"]

    %% Các nhánh chính
    Root --> M1["<b>Mặt thứ nhất</b><br/>(Bản thể luận)"]
    Root --> M2["<b>Mặt thứ hai</b><br/>(Nhận thức luận)"]

    %% Chi tiết mặt thứ nhất
    M1 --> Q1["Vật chất hay ý thức<br/>cái nào quyết định?"]
    Q1 --> DV["Duy vật"]
    Q1 --> DT["Duy tâm"]

    %% Chi tiết mặt thứ hai
    M2 --> Q2["Có thể nhận thức<br/>thế giới hay không?"]
    Q2 --> KT["Khả tri"]
    Q2 --> BKT["Bất khả tri"]

    %% Các hình thức phát triển
    DV --> DV1["Chất phác"]
    DV --> DV2["Siêu hình"]
    DV --> DV3["Biện chứng"]

    DT --> DT1["Chủ quan"]
    DT --> DT2["Khách quan"]

    %% Ảnh hưởng
    DV & DT --> TGQ["ẢNH HƯỞNG ĐẾN:<br/>Thế giới quan"]

    %% --- HỆ THỐNG CLASS (CSS-LIKE) ---
    classDef mainBranch fill:#1e293b,stroke:#4ade80,stroke-width:2px,color:#fff
    classDef materialism fill:#bfdbfe,stroke:#2563eb,stroke-width:2px,color:#000
    classDef cognition fill:#bbf7d0,stroke:#16a34a,stroke-width:2px,color:#000
    classDef matForms fill:#ddd6fe,stroke:#7c3aed,stroke-width:1px,color:#000
    classDef idealForms fill:#fecaca,stroke:#dc2626,stroke-width:1px,color:#000
    classDef result fill:#1e293b,stroke:#facc15,stroke-width:2px,color:#fff

    %% Áp dụng class cho các nhóm node
    class Root mainBranch
    class DV,DT materialism
    class KT,BKT cognition
    class DV1,DV2,DV3 matForms
    class DT1,DT2 idealForms
    class TGQ result
\`\`\`

### 🎯 **Cách đọc sơ đồ**:

**1️⃣ **Vấn đề cơ bản**: Mối quan hệ giữa tư duy và tồn tại

**2️⃣ **Mặt thứ nhất**: Quyết định học (Vật chất vs Ý thức)
- **Chủ nghĩa duy vật**: Vật chất quyết định ý thức
  - Chất phác → Siêu hình → Biện chứng
- **Chủ nghĩa duy tâm**: Ý thức quyết định vật chất
  - Chủ quan → Khách quan

**3️⃣ **Mặt thứ hai**: Nhận thức luận (Có thể biết vs Không thể biết)
- **Thuyết khả tri**: Con người có thể nhận thức thế giới
- **Thuyết bất khả tri**: Con người không thể nhận thức thế giới

**4️⃣ **Ảnh hưởng**: Tất cả các quan điểm đều ảnh hưởng đến thế giới quan
      `,
    },
    {
      id: "section-5",
      title: "Tổng kết bài học",
      content: `
## 🎯 **TỔNG KẾT BÀI HỌC**

### 📝 **3 điều cần nhớ**:

**1️⃣ **Triết học** là hệ thống lý luận chung nhất về thế giới
- **Hình thái ý thức xã hội** đặc biệt
- **Hạt nhân của thế giới quan**
- **Khoa học về quy luật** vận động, phát triển

**2️⃣ **Vấn đề cơ bản** là mối quan hệ giữa tư duy và tồn tại
- **Mặt thứ nhất**: Vật chất hay ý thức cái nào quyết định?
- **Mặt thứ hai**: Con người có thể nhận thức được thế giới?

**3️⃣ **Phương pháp biện chứng** là phương pháp tư duy khoa học nhất
- **Toàn diện, lịch sử, phát triển**
- **Phản ánh hiện thực đúng như nó tồn tại**
- **Công cụ hữu hiệu** giúp nhận thức và cải tạo thế giới

### 🛠️ **3 kỹ năng cần có**:

**1️⃣ **Phân tích** được các quan điểm triết học
- Nhận diện chủ nghĩa duy vật vs duy tâm
- Phân biệt thuyết khả tri vs bất khả tri
- Hiểu được phương pháp biện chứng vs siêu hình

**2️⃣ **Vận dụng** tư duy biện chứng trong thực tiễn
- Nhìn nhận vấn đề toàn diện
- Xem xét sự vật trong mối liên hệ
- Theo dõi sự phát triển, biến đổi

**3️⃣ **Phản biện** các quan điểm sai lầm về thế giới
- Phát hiện tư duy siêu hình
- Nhận diện chủ nghĩa duy tâm
- Phê phán quan điểm bất khả tri cực đoan

### 📚 **Tài liệu tham khảo**:

**1️⃣ **Các tác phẩm kinh điển**:
- C. Mác và Ph. Ăngghen: *Biện chứng của tự nhiên*
- V.I. Lênin: *Chủ nghĩa duy vật và chủ nghĩa kinh nghiệm phê phán*
- G.W.F. Hegel: *Khoa học lôgích*

**2️⃣ **Tài liệu hiện đại**:
- Triết học Mác - Lênin, NXB Chính trị Quốc gia
- Giáo trình Triết học, Học viện Chính trị Quốc gia Hồ Chí Minh

**3️⃣ **Tài liệu bổ trợ**:
- Bách khoa thư Britannica
- Bách khoa thư triết học mới (Viện Triết học Nga)

### 💡 **Câu hỏi thảo luận**:

1. **Tại sao triết học được coi là "hạt nhân của thế giới quan"?**
2. **Làm thế nào để phân biệt tư duy biện chứng và tư duy siêu hình trong thực tiễn?**
3. **Vai trò của triết học trong thời đại ngày nay là gì?**
      `,
    },
  ],
  flashcards: [
    // Dễ - Khái niệm cơ bản
    {
      id: "01-van-de-co-ban-cua-triet-hoc-1",
      question: "Triết học là gì?",
      answer:
        "Triết học là hình thái đặc biệt của ý thức xã hội, được thể hiện thành hệ thống các quan điểm lý luận chung nhất về thế giới và về con người và về tư duy của con người trong thế giới ấy.",
      category: "Khái niệm cơ bản",
      difficulty: "easy",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-2",
      question: "Triết học ra đời vào thời gian nào?",
      answer:
        "Khoảng thế kỷ VIII - VI trước Công nguyên, ở cả phương Đông và phương Tây.",
      category: "Lịch sử triết học",
      difficulty: "easy",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-3",
      question: "Thuật ngữ 'philosophia' có nghĩa là gì?",
      answer: "Yêu mến sự thông thái (từ tiếng Hy Lạp).",
      category: "Nguồn gốc từ ngữ",
      difficulty: "easy",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-4",
      question: "Vấn đề cơ bản của triết học là gì?",
      answer: "Vấn đề quan hệ giữa tư duy với tồn tại.",
      category: "Vấn đề cơ bản",
      difficulty: "easy",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },

    // Trung bình - Chủ nghĩa duy vật
    {
      id: "01-van-de-co-ban-cua-triet-hoc-5",
      question: "Chủ nghĩa duy vật là gì?",
      answer:
        "Chủ nghĩa duy vật là học thuyết triết học cho rằng vật chất, giới tự nhiên là cái có trước và quyết định ý thức của con người.",
      category: "Chủ nghĩa duy vật",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-6",
      question: "Chủ nghĩa duy vật có mấy hình thức phát triển?",
      answer: "Ba hình thức: chất phác, siêu hình và biện chứng.",
      category: "Chủ nghĩa duy vật",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-7",
      question: "Chủ nghĩa duy vật biện chứng do ai xây dựng?",
      answer: "C. Mác và Ph. Ăngghen vào những năm 40 thế kỷ XIX.",
      category: "Chủ nghĩa duy vật",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-8",
      question: "Chủ nghĩa duy vật chất phác có đặc điểm gì?",
      answer:
        "Đồng nhất vật chất với các chất cụ thể, mang tính trực quan, chất phác.",
      category: "Chủ nghĩa duy vật",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },

    // Trung bình - Chủ nghĩa duy tâm
    {
      id: "01-van-de-co-ban-cua-triet-hoc-9",
      question: "Chủ nghĩa duy tâm là gì?",
      answer:
        "Chủ nghĩa duy tâm là học thuyết triết học cho rằng ý thức, tinh thần, ý niệm, cảm giác là cái có trước giới tự nhiên.",
      category: "Chủ nghĩa duy tâm",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-10",
      question: "Chủ nghĩa duy tâm có mấy phái chính?",
      answer: "Hai phái: chủ quan và khách quan.",
      category: "Chủ nghĩa duy tâm",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-11",
      question: "Chủ nghĩa duy tâm chủ quan cho rằng gì?",
      answer: "Mọi sự vật, hiện tượng chỉ là phức hợp của những cảm giác.",
      category: "Chủ nghĩa duy tâm",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-12",
      question: "Chủ nghĩa duy tâm khách quan cho rằng gì?",
      answer:
        "Tồn tại một tinh thần khách quan có trước và độc lập với con người.",
      category: "Chủ nghĩa duy tâm",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },

    // Trung bình - Thuyết khả tri và bất khả tri
    {
      id: "01-van-de-co-ban-cua-triet-hoc-13",
      question: "Thuyết khả tri là gì?",
      answer:
        "Thuyết khả tri khẳng định con người có thể nhận thức được thế giới.",
      category: "Thuyết khả tri",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-14",
      question: "Thuyết bất khả tri là gì?",
      answer:
        "Thuyết bất khả tri phủ nhận khả năng nhận thức của con người về thế giới.",
      category: "Thuyết bất khả tri",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-15",
      question: "Ai là đại biểu tiêu biểu của thuyết bất khả tri?",
      answer: "D. Hume và I. Kant.",
      category: "Thuyết bất khả tri",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-16",
      question: "Kant đưa ra khái niệm gì để giải thích giới hạn nhận thức?",
      answer: "Vật tự nó (Ding an sich).",
      category: "Thuyết bất khả tri",
      difficulty: "medium",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },

    // Khó - Phương pháp biện chứng
    {
      id: "01-van-de-co-ban-cua-triet-hoc-17",
      question: "Phương pháp biện chứng là gì?",
      answer:
        "Phương pháp nhận thức đối tượng trong các mối liên hệ phổ biến, ở trạng thái vận động biến đổi, nằm trong khuynh hướng phát triển.",
      category: "Phương pháp biện chứng",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-18",
      question: "Phương pháp biện chứng có mấy đặc điểm chính?",
      answer: "Ba đặc điểm: toàn diện, lịch sử, phát triển.",
      category: "Phương pháp biện chứng",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-19",
      question: "Phương pháp biện chứng duy vật là gì?",
      answer:
        "Học thuyết về mối liên hệ phổ biến và về sự phát triển dưới hình thức hoàn bị nhất.",
      category: "Phương pháp biện chứng",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-20",
      question: "Phép biện chứng có mấy hình thức lịch sử?",
      answer: "Ba hình thức: tự phát, duy tâm, duy vật.",
      category: "Phương pháp biện chứng",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },

    // Khó - Phương pháp siêu hình
    {
      id: "01-van-de-co-ban-cua-triet-hoc-21",
      question: "Phương pháp siêu hình là gì?",
      answer:
        "Phương pháp nhận thức đối tượng ở trạng thái cô lập, tĩnh tại, tách rời khỏi các quan hệ.",
      category: "Phương pháp siêu hình",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-22",
      question: "Phương pháp siêu hình có đặc điểm gì?",
      answer: "Cô lập, tĩnh tại, tuyệt đối hóa ranh giới giữa các mặt đối lập.",
      category: "Phương pháp siêu hình",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-23",
      question: "Phương pháp siêu hình bắt nguồn từ đâu?",
      answer: "Từ khoa học cơ học cổ điển, nhìn thế giới như một cỗ máy.",
      category: "Phương pháp siêu hình",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-24",
      question: "Ph. Ăngghen phê phán phương pháp siêu hình như thế nào?",
      answer: "Chỉ nhìn thấy cây mà không thấy rừng.",
      category: "Phương pháp siêu hình",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },

    // Khó - Thế giới quan
    {
      id: "01-van-de-co-ban-cua-triet-hoc-25",
      question: "Thế giới quan là gì?",
      answer:
        "Hệ thống quan điểm của con người về thế giới và vị trí của con người trong thế giới đó.",
      category: "Thế giới quan",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-26",
      question: "Thế giới quan có những hình thức nào?",
      answer: "Tôn giáo, khoa học, triết học.",
      category: "Thế giới quan",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-27",
      question: "Tại sao triết học là hạt nhân của thế giới quan?",
      answer:
        "Vì triết học chi phối mọi thế giới quan, dù người ta có thừa nhận hay không.",
      category: "Thế giới quan",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
    {
      id: "01-van-de-co-ban-cua-triet-hoc-28",
      question: "Thế giới quan duy vật biện chứng có đặc điểm gì?",
      answer:
        "Nhìn thế giới theo quan điểm toàn diện, lịch sử, cụ thể và phát triển.",
      category: "Thế giới quan",
      difficulty: "hard",
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      isMarked: false,
    },
  ],
  test: {
    id: "01-van-de-co-ban-cua-triet-hoc-test",
    lessonId: "01-van-de-co-ban-cua-triet-hoc",
    title: "Kiểm tra Vấn đề Cơ bản của Triết học",
    description:
      "Bài kiểm tra đánh giá kiến thức về nguồn gốc, bản chất và vai trò của triết học",
    duration: 30,
    totalQuestions: 20,
    passingScore: 70,
    questions: [
      // Câu hỏi dễ (5 câu)
      {
        id: "q1",
        question: "Triết học ra đời vào thời gian nào?",
        options: [
          "Thế kỷ VIII - VI trước Công nguyên",
          "Thế kỷ I - III sau Công nguyên",
          "Thế kỷ XV - XVII",
          "Thế kỷ XIX",
        ],
        correctAnswer: 0,
        explanation:
          "Triết học ra đời ở cả phương Đông và phương Tây gần như cùng một thời gian (khoảng từ thế kỷ VIII đến thế kỷ VI trước Công nguyên).",
        difficulty: "easy",
        category: "Lịch sử triết học",
      },
      {
        id: "q2",
        question: "Thuật ngữ 'philosophia' có nghĩa là gì?",
        options: [
          "Yêu mến sự thông thái",
          "Tìm kiếm chân lý",
          "Hiểu biết thế giới",
          "Suy ngẫm cuộc sống",
        ],
        correctAnswer: 0,
        explanation:
          "Philosophia xuất phát từ tiếng Hy Lạp, nghĩa là yêu mến sự thông thái.",
        difficulty: "easy",
        category: "Nguồn gốc từ ngữ",
      },
      {
        id: "q3",
        question: "Vấn đề cơ bản của triết học là gì?",
        options: [
          "Quan hệ giữa tư duy với tồn tại",
          "Quan hệ giữa vật chất với ý thức",
          "Quan hệ giữa con người với thế giới",
          "Quan hệ giữa lý thuyết với thực tiễn",
        ],
        correctAnswer: 0,
        explanation:
          "Vấn đề cơ bản lớn của mọi triết học là vấn đề quan hệ giữa tư duy với tồn tại.",
        difficulty: "easy",
        category: "Vấn đề cơ bản",
      },
      {
        id: "q4",
        question: "Chủ nghĩa duy vật cho rằng điều gì có trước?",
        options: ["Vật chất", "Ý thức", "Tinh thần", "Cảm giác"],
        correctAnswer: 0,
        explanation:
          "Chủ nghĩa duy vật cho rằng vật chất, giới tự nhiên là cái có trước và quyết định ý thức.",
        difficulty: "easy",
        category: "Chủ nghĩa duy vật",
      },
      {
        id: "q5",
        question: "Phương pháp biện chứng nhìn nhận sự vật như thế nào?",
        options: [
          "Trong mối liên hệ và phát triển",
          "Trong trạng thái tĩnh tại",
          "Tách rời khỏi các quan hệ",
          "Cô lập và biệt lập",
        ],
        correctAnswer: 0,
        explanation:
          "Phương pháp biện chứng nhìn nhận sự vật trong các mối liên hệ phổ biến và ở trạng thái vận động phát triển.",
        difficulty: "easy",
        category: "Phương pháp biện chứng",
      },

      // Câu hỏi trung bình (10 câu)
      {
        id: "q6",
        question: "Chủ nghĩa duy vật có mấy hình thức phát triển chính?",
        options: ["3 hình thức", "2 hình thức", "4 hình thức", "5 hình thức"],
        correctAnswer: 0,
        explanation:
          "Chủ nghĩa duy vật có 3 hình thức: chất phác, siêu hình và biện chứng.",
        difficulty: "medium",
        category: "Chủ nghĩa duy vật",
      },
      {
        id: "q7",
        question: "Chủ nghĩa duy tâm khách quan cho rằng cái gì có trước?",
        options: [
          "Tinh thần khách quan",
          "Cảm giác cá nhân",
          "Ý thức con người",
          "Tư duy cá nhân",
        ],
        correctAnswer: 0,
        explanation:
          "Chủ nghĩa duy tâm khách quan cho rằng tồn tại một tinh thần khách quan có trước và độc lập với con người.",
        difficulty: "medium",
        category: "Chủ nghĩa duy tâm",
      },
      {
        id: "q8",
        question: "Thuyết khả tri khẳng định điều gì?",
        options: [
          "Con người có thể nhận thức được thế giới",
          "Con người không thể nhận thức được thế giới",
          "Chỉ có thần linh mới hiểu được thế giới",
          "Tri thức con người luôn sai lầm",
        ],
        correctAnswer: 0,
        explanation:
          "Thuyết khả tri khẳng định con người có thể nhận thức được thế giới.",
        difficulty: "medium",
        category: "Thuyết khả tri",
      },
      {
        id: "q9",
        question: "Ai là đại biểu tiêu biểu của thuyết bất khả tri?",
        options: [
          "D. Hume và I. Kant",
          "C. Mác và Ph. Ăngghen",
          "Hegel và Aristotle",
          "Plato và Socrates",
        ],
        correctAnswer: 0,
        explanation:
          "D. Hume và I. Kant là những đại biểu tiêu biểu của thuyết bất khả tri.",
        difficulty: "medium",
        category: "Thuyết bất khả tri",
      },
      {
        id: "q10",
        question: "Phương pháp siêu hình có đặc điểm gì?",
        options: [
          "Nhìn sự vật trong trạng thái cô lập",
          "Nhìn sự vật trong mối liên hệ",
          "Nhìn sự vật trong quá trình phát triển",
          "Nhìn sự vật trong vận động biến đổi",
        ],
        correctAnswer: 0,
        explanation:
          "Phương pháp siêu hình nhìn nhận sự vật ở trạng thái cô lập, tách rời khỏi các quan hệ.",
        difficulty: "medium",
        category: "Phương pháp siêu hình",
      },
      {
        id: "q11",
        question: "Chủ nghĩa duy vật biện chứng ra đời vào thời gian nào?",
        options: [
          "Những năm 40 thế kỷ XIX",
          "Thế kỷ XVIII",
          "Thế kỷ XVII",
          "Thế kỷ XX",
        ],
        correctAnswer: 0,
        explanation:
          "Chủ nghĩa duy vật biện chứng do C. Mác và Ph. Ăngghen xây dựng vào những năm 40 thế kỷ XIX.",
        difficulty: "medium",
        category: "Chủ nghĩa duy vật",
      },
      {
        id: "q12",
        question: "Kant đưa ra khái niệm nào để giải thích giới hạn nhận thức?",
        options: [
          "Vật tự nó",
          "Vật cho ta",
          "Ý niệm tuyệt đối",
          "Tinh thần tuyệt đối",
        ],
        correctAnswer: 0,
        explanation:
          "Kant đưa ra khái niệm 'vật tự nó' (Ding an sich) để giải thích giới hạn nhận thức của con người.",
        difficulty: "medium",
        category: "Thuyết bất khả tri",
      },
      {
        id: "q13",
        question: "Phép biện chứng duy vật là gì?",
        options: [
          "Học thuyết về mối liên hệ phổ biến và phát triển",
          "Học thuyết về vật chất quyết định ý thức",
          "Học thuyết về sự phát triển theo vòng tròn",
          "Học thuyết về sự phát triển theo đường thẳng",
        ],
        correctAnswer: 0,
        explanation:
          "Phép biện chứng duy vật là học thuyết về mối liên hệ phổ biến và về sự phát triển dưới hình thức hoàn bị nhất.",
        difficulty: "medium",
        category: "Phương pháp biện chứng",
      },
      {
        id: "q14",
        question: "Thế giới quan có những hình thức nào?",
        options: [
          "Tôn giáo, khoa học, triết học",
          "Tôn giáo, nghệ thuật, khoa học",
          "Triết học, chính trị, kinh tế",
          "Khoa học, nghệ thuật, chính trị",
        ],
        correctAnswer: 0,
        explanation:
          "Thế giới quan có ba hình thức chính: tôn giáo, khoa học và triết học.",
        difficulty: "medium",
        category: "Thế giới quan",
      },
      {
        id: "q15",
        question: "Nguồn gốc xã hội của triết học là gì?",
        options: [
          "Sự phân công lao động và xuất hiện giai cấp",
          "Sự phát triển của khoa học tự nhiên",
          "Sự xuất hiện của tôn giáo",
          "Sự phát triển của nghệ thuật",
        ],
        correctAnswer: 0,
        explanation:
          "Triết học ra đời khi xã hội có sự phân công lao động và xuất hiện giai cấp.",
        difficulty: "medium",
        category: "Nguồn gốc xã hội",
      },

      // Câu hỏi khó (5 câu)
      {
        id: "q16",
        question: "Ph. Ăngghen phê phán phương pháp siêu hình như thế nào?",
        options: [
          "Chỉ nhìn thấy cây mà không thấy rừng",
          "Chỉ nhìn thấy rừng mà không thấy cây",
          "Nhìn thấy cả cây và rừng",
          "Không nhìn thấy gì cả",
        ],
        correctAnswer: 0,
        explanation:
          "Ph. Ăngghen phê phán phương pháp siêu hình là 'chỉ nhìn thấy cây mà không thấy rừng'.",
        difficulty: "hard",
        category: "Phương pháp siêu hình",
      },
      {
        id: "q17",
        question: "Chủ nghĩa duy vật chất phác có đặc điểm gì?",
        options: [
          "Đồng nhất vật chất với các chất cụ thể",
          "Nhìn thế giới như một cỗ máy",
          "Nhìn thế giới trong mối liên hệ biện chứng",
          "Cho rằng ý thức quyết định vật chất",
        ],
        correctAnswer: 0,
        explanation:
          "Chủ nghĩa duy vật chất phác đồng nhất vật chất với các chất cụ thể như nước, lửa, không khí...",
        difficulty: "hard",
        category: "Chủ nghĩa duy vật",
      },
      {
        id: "q18",
        question: "Phép biện chứng có mấy hình thức lịch sử?",
        options: ["3 hình thức", "2 hình thức", "4 hình thức", "5 hình thức"],
        correctAnswer: 0,
        explanation:
          "Phép biện chứng có 3 hình thức: tự phát, duy tâm và duy vật.",
        difficulty: "hard",
        category: "Phương pháp biện chứng",
      },
      {
        id: "q19",
        question: "Tại sao triết học được coi là hạt nhân của thế giới quan?",
        options: [
          "Vì triết học chi phối mọi thế giới quan",
          "Vì triết học là khoa học cao nhất",
          "Vì triết học giải thích mọi hiện tượng",
          "Vì triết học là nền tảng của mọi khoa học",
        ],
        correctAnswer: 0,
        explanation:
          "Triết học chi phối mọi thế giới quan, dù người ta có thừa nhận hay không.",
        difficulty: "hard",
        category: "Thế giới quan",
      },
      {
        id: "q20",
        question: "Thế giới quan duy vật biện chứng có đặc điểm gì?",
        options: [
          "Nhìn thế giới theo quan điểm toàn diện, lịch sử, cụ thể và phát triển",
          "Nhìn thế giới theo quan điểm cô lập, tĩnh tại, tuyệt đối",
          "Nhìn thế giới theo quan điểm tôn giáo, thần bí",
          "Nhìn thế giới theo quan điểm cảm tính, chủ quan",
        ],
        correctAnswer: 0,
        explanation:
          "Thế giới quan duy vật biện chứng nhìn thế giới theo quan điểm toàn diện, lịch sử, cụ thể và phát triển.",
        difficulty: "hard",
        category: "Thế giới quan",
      },
    ],
  },
};
