import { Lesson } from "../src/lib/types/lesson";
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

export const lessons: Lesson[] = [
  vanDeCoBanCuaTrietHoc,
  trietHocTrongDoiSong,
  vatChatVaYThuc,
  bienChungDuyVat,
  lyLuanNhanThuc,
  trietHocVeConNguoi,
  yThucXaHoi,
  nhaNuocVaCachMangXaHoi,
  giaiCapVaDanToc,
  hocThuyetHinhThaiKinhTeXaHoi,
];