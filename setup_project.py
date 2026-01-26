import os

# Cấu trúc thư mục chuẩn của Spec-Kit
folders = [
    ".specify",
    "specs",
    "plans",
    "tasks",
    ".vscode" # Dành cho VS Code
]

# Nội dung file hiến pháp (Constitution) mẫu
constitution_content = """# Project Constitution
1. **Tech Stack**: Next.js, React, TypeScript.
2. **Design**: Mobile-first, Responsive, Modern Clean UI.
3. **AI Behavior**: Không được tự ý thay đổi logic cốt lõi trong file specs.
"""

# Nội dung file hướng dẫn cho Cline/Roo Code (thay cho .cursorrules)
cline_rules = """
Bạn là một kỹ sư phần mềm cao cấp tuân thủ quy trình Spec-Driven Development.
Quy trình làm việc của bạn:
1. Đọc yêu cầu từ người dùng -> Ghi vào `specs/spec.md`.
2. Phân tích `specs/spec.md` -> Tạo kế hoạch vào `plans/plan.md`.
3. Chia nhỏ `plans/plan.md` -> Tạo danh sách việc làm vào `tasks/tasks.md`.
4. Thực thi từng task và cập nhật trạng thái vào `tasks/tasks.md`.
"""

def init_project():
    # 1. Tạo thư mục
    for folder in folders:
        os.makedirs(folder, exist_ok=True)
        print(f"✅ Đã tạo thư mục: {folder}")

    # 2. Tạo file Constitution
    with open(".specify/constitution.md", "w", encoding="utf-8") as f:
        f.write(constitution_content)
    print("✅ Đã tạo file: .specify/constitution.md")

    # 3. Tạo file cấu hình cho Cline/Roo Code
    with open(".vscode/cline_custom_instructions.md", "w", encoding="utf-8") as f:
        f.write(cline_rules)
    print("✅ Đã tạo file hướng dẫn cho AI: .vscode/cline_custom_instructions.md")

    # 4. Tạo file rỗng để bắt đầu
    open("specs/spec.md", "w").close()
    open("plans/plan.md", "w").close()
    open("tasks/tasks.md", "w").close()
    print("✅ Đã khởi tạo các file markdown rỗng.")

if __name__ == "__main__":
    init_project()
    print("\n🎉 Khởi tạo dự án thành công! Bạn có thể xóa file setup_project.py này.")