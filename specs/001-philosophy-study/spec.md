# Specification: Philosophy Study Application - Lesson Content Component

## Overview
This specification defines the requirements for implementing a sophisticated LessonContent component for a Philosophy Study application focused on Marxist-Leninist Philosophy. The component will display structured philosophical content with interactive UI elements and animations.

## Data Structure Requirements

### PhilosophySection Interface
```typescript
interface PhilosophySection {
  id: string;          // slug (vd: 'nguon-goc')
  title: string;       // Tiêu đề chương
  summary: string;     // Tóm tắt ngắn gọn cho Meta/Card
  contentBlocks: {
    heading: string;
    body: string;      // Nội dung chi tiết trích từ docx
    keywords?: string[];
    uiHint: 'tabs' | 'timeline' | 'bento-grid' | 'tree-diagram' | 'comparison-table' | 'split-view';
  }[];
}
```

### Content Mapping from VanDeCoBanCuaTrietHoc.docx

#### Section 1: Nguồn gốc ra đời (nguon-goc)
- **Title**: "Nguồn Gốc Ra Đời Của Triết Học"
- **Summary**: "Khám phá nguồn gốc nhận thức và xã hội của triết học từ thời cổ đại"
- **UI Hint**: 'tabs'
- **Content Blocks**:
  1. **Heading**: "Nguồn gốc nhận thức"
     - **Body**: "Tư duy huyền thoại → Tư duy triết học. Người nguyên thủy giải thích thế giới bằng thần thoại, đến thời cổ đại dùng lý trí. Ví dụ: Sấm sét do thần Zeus → hiện tượng vật lý phóng điện"
     - **Keywords**: ["tư duy huyền thoại", "tư duy triết học", "lý trí", "thần thoại"]
  
  2. **Heading**: "Nguồn gốc xã hội"
     - **Body**: "Phân công lao động, xã hội có giai cấp, tư hữu hóa. Triết học ra đời khi xã hội đạt trình độ sản xuất cao, có giai cấp, nhà nước. Tầng lớp trí thức xuất hiện, giáo dục phát triển"
     - **Keywords**: ["phân công lao động", "giai cấp", "tư hữu", "trí thức"]

#### Section 2: Khái niệm & Đối tượng (khai-niem)
- **Title**: "Khái Niệm Và Đối Tượng Của Triết Học"
- **Summary**: "Hiểu bản chất, đối tượng và vai trò của triết học trong lịch sử phát triển"
- **UI Hint**: 'timeline'
- **Content Blocks**:
  1. **Heading**: "Khái niệm triết học"
     - **Body**: "Triết học là hình thái đặc biệt của ý thức xã hội, hệ thống quan điểm lý luận chung nhất về thế giới. Từ Hy Lạp: philosophia (yêu mến sự thông thái)"
     - **Keywords**: ["triết học", "ý thức xã hội", "philosophia", "lý luận"]
  
  2. **Heading**: "Đối tượng triết học"
     - **Body**: "Các quan hệ phổ biến và quy luật chung nhất của tự nhiên, xã hội và tư duy. Từ 'khoa học của các khoa học' đến khoa học về quy luật vận động chung nhất"
     - **Keywords**: ["đối tượng", "quy luật", "tự nhiên", "xã hội", "tư duy"]

#### Section 3: Triết học là hạt nhân thế giới quan (the-gioi-quan)
- **Title**: "Triết Học - Hạt Nhân Của Thế Giới Quan"
- **Summary**: "Vai trò trung tâm của triết học trong việc hình thành thế giới quan"
- **UI Hint**: 'bento-grid'
- **Content Blocks**:
  1. **Heading**: "Thế giới quan là gì?"
     - **Body**: "Hệ thống quan điểm của con người về thế giới và vị trí của con người trong thế giới đó. Gồm tri thức, niềm tin, lý tưởng"
     - **Keywords**: ["thế giới quan", "tri thức", "niềm tin", "lý tưởng"]
  
  2. **Heading**: "Các hình thức thế giới quan"
     - **Body**: "Tôn giáo (dựa trên niềm tin), Khoa học (dựa trên lý trí), Triết học (dựa trên lý luận). Triết học chi phối mọi thế giới quan"
     - **Keywords**: ["tôn giáo", "khoa học", "triết học", "chi phối"]

#### Section 4: Vấn đề cơ bản của triết học (van-de-co-ban)
- **Title**: "Vấn Đề Cơ Bản Của Triết Học"
- **Summary**: "Mối quan hệ giữa tư duy và tồn tại - nền tảng của mọi học thuyết triết học"
- **UI Hint**: 'tree-diagram'
- **Content Blocks**:
  1. **Heading**: "Mặt thứ nhất: Bản thể luận"
     - **Body**: "Vật chất hay ý thức cái nào quyết định cái nào? Dẫn đến hai trường phái: Chủ nghĩa duy vật và Chủ nghĩa duy tâm"
     - **Keywords**: ["bản thể luận", "vật chất", "ý thức", "duy vật", "duy tâm"]
  
  2. **Heading**: "Mặt thứ hai: Nhận thức luận"
     - **Body**: "Con người có thể nhận thức được thế giới hay không? Dẫn đến Thuyết khả tri và Thuyết bất khả tri"
     - **Keywords**: ["nhận thức luận", "khả tri", "bất khả tri"]

#### Section 5: Khả năng nhận thức (kha-tri)
- **Title**: "Thuyết Khả Tri Và Bất Khả Tri"
- **Summary**: "Cuộc tranh luận về khả năng nhận thức thế giới của con người"
- **UI Hint**: 'comparison-table'
- **Content Blocks**:
  1. **Heading**: "Thuyết khả tri"
     - **Body**: "Khẳng định con người có thể nhận thức được thế giới. Cảm giác, biểu tượng, quan niệm phù hợp với bản thân sự vật"
     - **Keywords**: ["khả tri", "nhận thức", "phù hợp", "hiểu biết"]
  
  2. **Heading**: "Thuyết bất khả tri"
     - **Body**: "Phủ nhận khả năng nhận thức của con người. Nhận thức chỉ là hình thức bề ngoài, hạn hẹp. Đại biểu: Hume, Kant với 'vật tự nó'"
     - **Keywords**: ["bất khả tri", "hạn hẹp", "Hume", "Kant", "vật tự nó"]

#### Section 6: Biện chứng & Siêu hình (phuong-phap)
- **Title**: "Phương Pháp Biện Chứng Và Siêu Hình"
- **Summary**: "Hai phương pháp tư duy đối lập nhau trong nghiên cứu triết học"
- **UI Hint**: 'split-view'
- **Content Blocks**:
  1. **Heading**: "Phương pháp biện chứng"
     - **Body**: "Nhìn đối tượng trong mối liên hệ phổ biến, vận động biến đổi, phát triển. Nguồn gốc: đấu tranh giữa các mặt đối lập. Công cụ hữu hiệu nhận thức và cải tạo thế giới"
     - **Keywords**: ["biện chứng", "mối liên hệ", "vận động", "phát triển", "đấu tranh"]
  
  2. **Heading**: "Phương pháp siêu hình"
     - **Body**: "Nhìn đối tượng ở trạng thái cô lập, tĩnh tại, tách rời quan hệ. Nguyên nhân biến đổi nằm ngoài đối tượng. Chỉ nhìn thấy cây mà không thấy rừng"
     - **Keywords**: ["siêu hình", "cô lập", "tĩnh tại", "tách rời", "cây mà không thấy rừng"]

## UI/UX Requirements

### Theme & Design System
- **Theme**: Education, Modern, Trustworthy
- **Color Palette**: 
  - Deep Blue (#1e3a8a, #3b82f6, #93c5fd)
  - Paper White (#ffffff, #f8fafc, #e2e8f0)
  - Accent Colors: Emerald (#10b981), Amber (#f59e0b)
- **Typography**: Modern sans-serif with good readability
- **Spacing**: Consistent padding and margins for academic feel

### Component Architecture

#### 1. Pagination Component
- **Purpose**: Navigate between 6 sections
- **Features**:
  - Previous/Next buttons
  - Section indicators (1-6)
  - Current section highlighting
  - Smooth transitions between sections
  - Keyboard navigation support

#### 2. DynamicRenderer Component
- **Purpose**: Render appropriate UI based on uiHint
- **Supported Types**:
  - **Tabs**: For Section 1 (nguon-goc)
  - **Timeline**: For Section 2 (khai-niem)
  - **BentoGrid**: For Section 3 (the-gioi-quan)
  - **TreeDiagram**: For Section 4 (van-de-co-ban)
  - **ComparisonTable**: For Section 5 (kha-tri)
  - **SplitView**: For Section 6 (phuong-phap)

#### 3. Sub-components

##### ComparisonTable Component
- **Purpose**: Display side-by-side comparison
- **Features**:
  - Two-column layout
  - Header for each column
  - Row-based comparison items
  - Highlight differences
  - Responsive design

##### TimelineView Component
- **Purpose**: Show chronological development
- **Features**:
  - Vertical or horizontal timeline
  - Time markers with descriptions
  - Visual indicators for different periods
  - Smooth animations for timeline items

##### BentoGrid Component
- **Purpose**: Display multiple related concepts
- **Features**:
  - Grid layout (2x2 or 3x2)
  - Equal-sized cards
  - Hover effects
  - Consistent spacing

##### SplitView Component
- **Purpose**: Compare two opposing concepts
- **Features**:
  - Side-by-side layout
  - Clear visual separation
  - Balanced content distribution
  - Interactive elements

## Animation Requirements

### Page Transitions
- **Library**: Framer Motion
- **Effects**:
  - Fade in/out between sections
  - Slide transitions
  - Stagger children animations
  - Smooth scroll behavior

### Content Animations
- **Stagger Children**: Sequential appearance of content blocks
- **Fade In**: Individual elements appearing smoothly
- **Scale Effects**: Subtle scaling for emphasis
- **Slide Effects**: Horizontal/vertical sliding for lists

### Interaction Animations
- **Hover Effects**: Subtle color changes, scaling
- **Click Animations**: Button presses, card selections
- **Loading States**: Skeleton screens for content loading

## Technical Requirements

### Data Management
- **State Management**: Context API or Zustand
- **Data Fetching**: Static data from TypeScript files
- **Caching**: Minimal caching needed for static content
- **Error Handling**: Graceful fallbacks for missing data

### Performance
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Prevent unnecessary re-renders
- **Bundle Size**: Keep animations lightweight
- **Accessibility**: ARIA labels, keyboard navigation

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Responsive design for all screen sizes
- **Performance**: Smooth 60fps animations

## Content Quality Standards

### Accuracy
- All content must be factually accurate
- Proper attribution of philosophical concepts
- Correct terminology usage

### Readability
- Clear, concise language
- Appropriate academic level
- Logical flow between sections
- Consistent formatting

### Engagement
- Interactive elements to maintain interest
- Visual variety to prevent monotony
- Progressive disclosure of complex concepts

## Testing Requirements

### Unit Tests
- Component rendering tests
- Data structure validation
- Animation timing tests

### Integration Tests
- Navigation flow testing
- State management testing
- Cross-browser compatibility

### User Experience Tests
- Accessibility compliance
- Performance benchmarks
- Mobile responsiveness

## Success Criteria

1. **Content Accuracy**: 100% accurate philosophical content
2. **User Engagement**: Smooth navigation and interactive elements
3. **Performance**: <3s load time, 60fps animations
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Mobile Experience**: Fully responsive design
6. **Code Quality**: TypeScript strict mode, comprehensive tests

## Implementation Phases

1. **Phase 1**: Data structure and basic component architecture
2. **Phase 2**: Core UI components and navigation
3. **Phase 3**: Animations and interactions
4. **Phase 4**: Testing and optimization
5. **Phase 5**: Documentation and deployment