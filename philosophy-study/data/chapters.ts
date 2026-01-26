import { Chapter } from "../src/lib/types/chapter";
import { vanDeCoBanCuaTrietHoc } from "./lessons/01-van-de-co-ban-cua-triet-hoc";
import { trietHocTrongDoiSong } from "./lessons/02-triet-hoc-trong-doi-song";
import { vatChatVaYThuc } from "./lessons/03-vat-chat-va-y-thuc";
import { bienChungDuyVat } from "./lessons/04-bien-chung-duy-vat";
import { lyLuanNhanThuc } from "./lessons/05-ly-luan-nhan-thuc";
import { trietHocVeConNguoi } from "./lessons/06-triet-hoc-ve-con-nguoi";
import { yThucXaHoi } from "./lessons/07-y-thuc-xa-hoi";
import { nhaNuocVaCachMangXaHoi } from "./lessons/08-nha-nuoc-va-cach-mang-xa-hoi";
import { giaiCapVaDanToc } from "./lessons/09-giai-cap-va-dan-toc";
import { hocThuyetHinhThaiKinhTeXaHoi } from "./lessons/10-hoc-thuyet-hinh-thai-kinh-te-xa-hoi";

export const chapters: Chapter[] = [
  {
    id: "chapter-1",
    title: "KHÁI LUẬN VỀ TRIẾT HỌC VÀ TRIẾT HỌC MÁC – LÊNIN",
    description:
      "Tìm hiểu về nguồn gốc, bản chất và vai trò của triết học; vấn đề cơ bản của triết học gồm chủ nghĩa duy vật, chủ nghĩa duy tâm, thuyết khả tri và bất khả tri; các hình thức biện chứng và siêu hình trong lịch sử.",
    order: 1,
    lessons: [vanDeCoBanCuaTrietHoc, trietHocTrongDoiSong],
    imageUrl: "/images/chapter-1-philosophy.jpg",
  },
  {
    id: "chapter-2",
    title: "CHỦ NGHĨA DUY VẬT BIỆN CHỨNG",
    description:
      "Học thuyết về mối liên hệ phổ biến và sự phát triển dưới hình thức hoàn bị nhất.",
    order: 2,
    lessons: [vatChatVaYThuc, bienChungDuyVat, lyLuanNhanThuc],
    imageUrl: "/images/chapter-2-dialectics.jpg",
  },
  {
    id: "chapter-3",
    title: "CHỦ NGHĨA DUY VẬT LỊCH SỬ",
    description:
      "Nghiên cứu các hình thái kinh tế - xã hội, mối quan hệ giữa giai cấp và dân tộc, bản chất nhà nước và cách mạng xã hội, các hình thái ý thức xã hội, và bản chất con người.",
    order: 3,
    lessons: [
      hocThuyetHinhThaiKinhTeXaHoi,
      giaiCapVaDanToc,
      nhaNuocVaCachMangXaHoi,
      yThucXaHoi,
      trietHocVeConNguoi,
    ],
    imageUrl: "/images/chapter-placeholder.jpg",
  },
];
