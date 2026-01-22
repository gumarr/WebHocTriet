'use client';

import { useState } from 'react';
import FlashCard from './FlashCard';
import Quiz from './Quiz';

interface ContentData {
  [key: string]: {
    title: string;
    description: string;
    topics?: string[];
    thinkers?: string[];
    detailedContent?: boolean;
  };
}

const contentData: ContentData = {
  'c1-1': {
    title: 'Triết học và vấn đề cơ bản của triết học',
    description: 'Triết học là môn khoa học nghiên cứu những vấn đề cơ bản và phổ quát nhất về thế giới quan, nhận thức luận và phương pháp luận.',
    detailedContent: true,
  },
  'c1-2': {
    title: 'Triết học Mác - Lênin và vai trò trong đời sống xã hội',
    description: 'Triết học Mác - Lênin là hệ thống quan điểm duy vật biện chứng và duy vật lịch sử về thế giới, về con người và về vai trò của con người trong việc nhận thức và cải tạo thế giới.',
    topics: [
      'Nguồn gốc lý luận của triết học Mác',
      'Quá trình hình thành triết học Mác - Lênin',
      'Những nội dung cơ bản của triết học Mác - Lênin',
      'Vai trò của triết học Mác - Lênin trong đời sống xã hội',
      'Ý nghĩa phương pháp luận của triết học Mác - Lênin',
    ],
    thinkers: ['Karl Marx', 'Friedrich Engels', 'V.I. Lenin', 'Hegel', 'Feuerbach'],
  },
  'c2-1': {
    title: 'Vật chất và ý thức',
    description: 'Vật chất là phạm trù triết học dùng để chỉ thực tại khách quan, tồn tại độc lập với ý thức và được ý thức phản ánh. Ý thức là sự phản ánh tích cực, sáng tạo thế giới khách quan vào bộ óc người.',
    topics: [
      'Khái niệm vật chất triết học',
      'Tính thống nhất vật chất của thế giới',
      'Vận động - phương thức tồn tại của vật chất',
      'Không gian và thời gian',
      'Bản chất và nguồn gốc của ý thức',
      'Mối quan hệ giữa vật chất và ý thức',
    ],
    thinkers: ['Marx', 'Engels', 'Lenin', 'Spinoza'],
  },
  'c2-2': {
    title: 'Phép biện chứng duy vật',
    description: 'Phép biện chứng duy vật là khoa học về những quy luật phổ biến nhất của sự vận động, phát triển của tự nhiên, xã hội và tư duy.',
    topics: [
      'Hai đặc trưng cơ bản của phép biện chứng duy vật',
      'Các quy luật cơ bản của phép biện chứng',
      'Quy luật thống nhất và đấu tranh của các mặt đối lập',
      'Quy luật từ những thay đổi về lượng đến những thay đổi về chất',
      'Quy luật phủ định của phủ định',
      'Các cặp phạm trù của phép biện chứng',
    ],
    thinkers: ['Hegel', 'Marx', 'Engels', 'Lenin'],
  },
  'c2-3': {
    title: 'Lý luận nhận thức',
    description: 'Lý luận nhận thức duy vật biện chứng nghiên cứu bản chất, nguồn gốc, quá trình phát triển của nhận thức và tiêu chuẩn của chân lý.',
    topics: [
      'Thực tiễn và vai trò của thực tiễn trong nhận thức',
      'Quá trình nhận thức và quy luật biện chứng của nhận thức',
      'Chân lý và tiêu chuẩn của chân lý',
      'Chân lý tương đối và chân lý tuyệt đối',
      'Chân lý khách quan và chân lý cụ thể',
    ],
    thinkers: ['Marx', 'Lenin', 'Engels', 'Kant'],
  },
  'c3-1': {
    title: 'Học thuyết hình thái kinh tế - xã hội',
    description: 'Hình thái kinh tế - xã hội là một xã hội có tính lịch sử cụ thể, được quy định bởi một phương thức sản xuất nhất định, có một cơ sở hạ tầng và kiến trúc thượng tầng tương ứng.',
    topics: [
      'Khái niệm hình thái kinh tế - xã hội',
      'Cơ sở hạ tầng và kiến trúc thượng tầng',
      'Sự vận động và phát triển của hình thái kinh tế - xã hội',
      'Vai trò của quần chúng nhân dân và cá nhân lịch sử',
      'Các quy luật khách quan của lịch sử',
    ],
    thinkers: ['Marx', 'Engels', 'Lenin'],
  },
  'c3-2': {
    title: 'Biện chứng giữa lực lượng sản xuất và quan hệ sản xuất',
    description: 'Lực lượng sản xuất và quan hệ sản xuất là hai mặt của phương thức sản xuất, có mối quan hệ biện chứng với nhau và quyết định sự phát triển của xã hội.',
    topics: [
      'Lực lượng sản xuất và các yếu tố cấu thành',
      'Quan hệ sản xuất và bản chất của nó',
      'Quy luật phù hợp giữa quan hệ sản xuất với trình độ lực lượng sản xuất',
      'Mâu thuẫn giữa lực lượng sản xuất và quan hệ sản xuất',
      'Cách mạng xã hội và sự thay đổi phương thức sản xuất',
    ],
    thinkers: ['Marx', 'Engels', 'Lenin'],
  },
  'c3-3': {
    title: 'Giai cấp và dân tộc',
    description: 'Giai cấp và dân tộc là hai cộng đồng người quan trọng trong xã hội, có ảnh hưởng sâu sắc đến sự phát triển lịch sử xã hội loài người.',
    topics: [
      'Sự hình thành và bản chất của giai cấp',
      'Đấu tranh giai cấp và vai trò của nó',
      'Khái niệm dân tộc và vấn đề dân tộc',
      'Mối quan hệ giữa giai cấp và dân tộc',
      'Chủ nghĩa dân tộc và chủ nghĩa quốc tế',
    ],
    thinkers: ['Marx', 'Engels', 'Lenin', 'Stalin'],
  },
  'c3-4': {
    title: 'Nhà nước và cách mạng xã hội',
    description: 'Nhà nước là bộ máy cưỡng chế đặc biệt của giai cấp thống trị. Cách mạng xã hội là sự thay thế một hình thái kinh tế - xã hội này bằng một hình thái tiến bộ hơn.',
    topics: [
      'Nguồn gốc, bản chất và chức năng của nhà nước',
      'Nhà nước và cách mạng xã hội',
      'Các kiểu nhà nước trong lịch sử',
      'Dân chủ và chuyên chính',
      'Sự tàn lụi của nhà nước',
    ],
    thinkers: ['Marx', 'Engels', 'Lenin'],
  },
  'c3-5': {
    title: 'Ý thức xã hội',
    description: 'Ý thức xã hội là sự phản ánh đời sống xã hội vào đầu óc con người, bao gồm các quan điểm chính trị, pháp luật, đạo đức, nghệ thuật, tôn giáo, triết học và khoa học.',
    topics: [
      'Khái niệm và cấu trúc của ý thức xã hội',
      'Các hình thái ý thức xã hội',
      'Tính độc lập tương đối của ý thức xã hội',
      'Vai trò của ý thức xã hội đối với tồn tại xã hội',
      'Ý thức xã hội tiên tiến và lạc hậu',
    ],
    thinkers: ['Marx', 'Engels', 'Lenin', 'Gramsci'],
  },
  'c3-6': {
    title: 'Triết học về con người',
    description: 'Con người là chủ thể của lịch sử, vừa là sản phẩm vừa là người sáng tạo ra lịch sử xã hội. Triết học Mác - Lênin nghiên cứu con người trong mối quan hệ xã hội cụ thể.',
    topics: [
      'Bản chất con người theo quan điểm triết học Mác - Lênin',
      'Con người và hệ thống các mối quan hệ xã hội',
      'Giá trị con người và ý nghĩa cuộc đời',
      'Tự do và trách nhiệm của con người',
      'Con người và vấn đề giải phóng con người',
    ],
    thinkers: ['Marx', 'Engels', 'Lenin', 'Feuerbach', 'Gramsci'],
  },
};

interface ContentAreaProps {
  activeSection: string;
}

export default function ContentArea({ activeSection }: ContentAreaProps) {
  const [showFlashCard, setShowFlashCard] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const content = contentData[activeSection];

  if (!content) {
    return (
      <div className="flex-1 p-8 bg-linear-to-br from-gray-50 to-blue-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="text-8xl mb-6">📚</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Triết học Mác - Lênin
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Chọn một mục trong sidebar để bắt đầu học
          </p>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
              Nội dung chương trình
            </h2>
            <div className="text-left space-y-4">
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-semibold text-lg">Chương 1</h3>
                <p className="text-gray-600">Khái luận về Triết học và Triết học Mác - Lênin</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-lg">Chương 2</h3>
                <p className="text-gray-600">Chủ nghĩa Duy vật biện chứng</p>
              </div>
              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="font-semibold text-lg">Chương 3</h3>
                <p className="text-gray-600">Chủ nghĩa Duy vật lịch sử</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-linear-to-br from-gray-50 to-blue-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {/* Hiển thị nội dung chi tiết cho c1-1 */}
        {activeSection === 'c1-1' ? (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h1 className="text-4xl font-bold text-indigo-900 mb-4">{content.title}</h1>
              <p className="text-lg text-gray-700 leading-relaxed">{content.description}</p>
            </div>

            {/* Phần 1: Khái lược về triết học */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-3xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-3">
                1. Khái lược về triết học
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">a) Nguồn gốc của triết học</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Triết học không xuất hiện ngẫu nhiên mà ra đời từ thực tiễn xã hội và nhu cầu nhận thức của con người, dựa trên hai nguồn gốc chính:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">• Nguồn gốc nhận thức:</h4>
                      <p className="text-gray-700">
                        Triết học xuất hiện khi tư duy con người đạt đến trình độ trừu tượng hóa và khái quát hóa cao. 
                        Con người không còn thỏa mãn với các giải thích huyền thoại hay tôn giáo mà muốn giải thích 
                        thế giới một cách hệ thống, lôgích dựa trên các quy luật chung. Triết học là hình thức tư duy 
                        lý luận đầu tiên thay thế cho tư duy huyền thoại.
                      </p>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4">
                      <h4 className="font-semibold text-green-900 mb-2">• Nguồn gốc xã hội:</h4>
                      <p className="text-gray-700">
                        Triết học ra đời khi xã hội đã có sự phân công lao động (tách lao động trí óc khỏi lao động chân tay), 
                        xuất hiện chế độ tư hữu, giai cấp và nhà nước. Tầng lớp trí thức xuất hiện, có điều kiện nghiên cứu 
                        và hệ thống hóa tri thức thành các học thuyết lý luận.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">b) Khái niệm triết học</h3>
                  <div className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-900 mb-2">🌏 Phương Đông:</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Ở <strong>Trung Quốc</strong>, triết học (Triết) mang ý nghĩa là trí tuệ, sự hiểu biết sâu sắc về thế giới (thiên - địa - nhân).</li>
                        <li>Ở <strong>Ấn Độ (Dar'sana)</strong>, triết học mang hàm ý là sự chiêm ngưỡng, suy ngẫm dựa trên lý trí để dẫn dắt con người đến lẽ phải.</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">🏛️ Phương Tây:</h4>
                      <p className="text-gray-700 ml-4">
                        Thuật ngữ <strong>"Philosophia"</strong> (Hy Lạp cổ đại) nghĩa là "yêu mến sự thông thái", 
                        vừa giải thích vũ trụ vừa định hướng hành vi.
                      </p>
                    </div>
                    <div className="bg-indigo-50 border-2 border-indigo-300 p-5 rounded-lg">
                      <h4 className="font-bold text-indigo-900 mb-2">📚 Định nghĩa chung:</h4>
                      <p className="text-gray-800 leading-relaxed text-lg">
                        Triết học là <strong>hệ thống quan điểm lý luận chung nhất</strong> về thế giới và vị trí con người 
                        trong thế giới đó, là <strong>khoa học về những quy luật vận động, phát triển chung nhất</strong> của 
                        tự nhiên, xã hội và tư duy.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">c) Đối tượng của triết học trong lịch sử</h3>
                  <div className="space-y-3">
                    <div className="flex gap-4 items-start p-3 bg-gray-50 rounded-lg">
                      <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Thời cổ đại:</h4>
                        <p className="text-gray-700">Triết học là "khoa học của các khoa học", bao trùm mọi tri thức.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-3 bg-gray-50 rounded-lg">
                      <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Thời trung cổ:</h4>
                        <p className="text-gray-700">Triết học bị chi phối bởi thần học (Kitô giáo), trở thành công cụ lý giải kinh thánh.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-3 bg-gray-50 rounded-lg">
                      <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Thời kỳ cận đại (thế kỷ XV-XVIII):</h4>
                        <p className="text-gray-700">Các khoa học chuyên ngành tách ra, triết học duy vật phát triển gắn với khoa học thực nghiệm nhưng còn mang tính siêu hình.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-3 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">★</div>
                      <div>
                        <h4 className="font-semibold text-red-900">Triết học Mác:</h4>
                        <p className="text-gray-700">Xác định đối tượng nghiên cứu là giải quyết mối quan hệ giữa vật chất và ý thức trên lập trường duy vật triệt để, nghiên cứu những quy luật chung nhất của tự nhiên, xã hội và tư duy.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">d) Triết học - hạt nhân lý luận của thế giới quan</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">🌍 Thế giới quan:</h4>
                      <p className="text-gray-700">
                        Là hệ thống các quan điểm, tri thức, niềm tin, lý tưởng của con người về thế giới và về vị trí của con người trong thế giới đó.
                      </p>
                    </div>
                    <div className="bg-linear-to-r from-indigo-50 to-purple-50 p-5 rounded-lg border-2 border-indigo-200">
                      <h4 className="font-bold text-indigo-900 mb-2">⚡ Vai trò hạt nhân của triết học:</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Triết học đóng vai trò cốt lõi, chi phối mọi thế giới quan. Nó cung cấp cơ sở lý luận để xây dựng 
                        thế giới quan khoa học, định hướng tư duy và hành động của con người. Thế giới quan duy vật biện chứng 
                        là đỉnh cao, đòi hỏi xem xét thế giới dựa trên các nguyên lý về mối liên hệ phổ biến và sự phát triển.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phần 2: Vấn đề cơ bản của triết học */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-3xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-3">
                2. Vấn đề cơ bản của triết học
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">a) Nội dung vấn đề cơ bản</h3>
                  <div className="bg-red-50 border-2 border-red-300 p-5 rounded-lg mb-4">
                    <p className="text-gray-800 font-semibold text-lg">
                      Vấn đề cơ bản lớn của mọi triết học là vấn đề về <span className="text-red-700">mối quan hệ giữa tư duy và tồn tại</span> (hay giữa ý thức và vật chất).
                    </p>
                  </div>
                  <p className="text-gray-700 mb-4">Vấn đề này có hai mặt:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                      <h4 className="font-bold text-blue-900 mb-2">Mặt thứ nhất (Bản thể luận):</h4>
                      <p className="text-gray-700">Giữa ý thức và vật chất, cái nào có trước, cái nào có sau? Cái nào quyết định cái nào?</p>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4">
                      <h4 className="font-bold text-green-900 mb-2">Mặt thứ hai (Nhận thức luận):</h4>
                      <p className="text-gray-700">Con người có khả năng nhận thức được thế giới hay không?</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">b) Các trường phái triết học chính</h3>
                  <p className="text-gray-700 mb-4">Việc giải quyết mặt thứ nhất chia các nhà triết học thành hai trường phái:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-linear-to-r from-green-100 to-green-50 p-5 rounded-lg border-2 border-green-400">
                      <h4 className="text-xl font-bold text-green-900 mb-3">🟢 Chủ nghĩa duy vật</h4>
                      <p className="text-gray-700 mb-4">Cho rằng <strong>vật chất có trước, ý thức có sau, vật chất quyết định ý thức.</strong></p>
                      <p className="font-semibold text-gray-800 mb-2">Có ba hình thức cơ bản:</p>
                      <div className="space-y-3 ml-4">
                        <div className="bg-white p-3 rounded border-l-4 border-green-600">
                          <h5 className="font-semibold text-gray-900">1. Chủ nghĩa duy vật chất phác (Cổ đại):</h5>
                          <p className="text-gray-700 text-sm">Trực quan, ngây thơ, đồng nhất vật chất với các dạng cụ thể (nước, lửa...).</p>
                        </div>
                        <div className="bg-white p-3 rounded border-l-4 border-green-600">
                          <h5 className="font-semibold text-gray-900">2. Chủ nghĩa duy vật siêu hình (Thế kỷ XV-XVIII):</h5>
                          <p className="text-gray-700 text-sm">Máy móc, xem xét thế giới trong trạng thái tĩnh tại, biệt lập.</p>
                        </div>
                        <div className="bg-white p-3 rounded border-l-4 border-red-600">
                          <h5 className="font-semibold text-red-900">3. Chủ nghĩa duy vật biện chứng (Mác - Lênin): ⭐</h5>
                          <p className="text-gray-700 text-sm">Khắc phục hạn chế cũ, phản ánh hiện thực đúng như nó tồn tại và là công cụ cải tạo thế giới.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-linear-to-r from-purple-100 to-purple-50 p-5 rounded-lg border-2 border-purple-400">
                      <h4 className="text-xl font-bold text-purple-900 mb-3">🟣 Chủ nghĩa duy tâm</h4>
                      <p className="text-gray-700 mb-4">Cho rằng <strong>ý thức, tinh thần có trước và quyết định giới tự nhiên.</strong></p>
                      <p className="font-semibold text-gray-800 mb-2">Gồm hai phái:</p>
                      <div className="space-y-3 ml-4">
                        <div className="bg-white p-3 rounded border-l-4 border-purple-600">
                          <h5 className="font-semibold text-gray-900">1. Chủ nghĩa duy tâm chủ quan:</h5>
                          <p className="text-gray-700 text-sm">Thừa nhận tính thứ nhất của ý thức con người (sự vật là phức hợp cảm giác).</p>
                        </div>
                        <div className="bg-white p-3 rounded border-l-4 border-purple-600">
                          <h5 className="font-semibold text-gray-900">2. Chủ nghĩa duy tâm khách quan:</h5>
                          <p className="text-gray-700 text-sm">Thừa nhận tính thứ nhất của một lực lượng tinh thần khách quan (Ý niệm, Tinh thần tuyệt đối).</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-400">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">⚪ Thuyết nhị nguyên</h4>
                      <p className="text-gray-700">Thừa nhận cả vật chất và tinh thần là hai bản nguyên song song tồn tại (điển hình là Descartes).</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">c) Thuyết khả tri và Thuyết bất khả tri</h3>
                  <p className="text-gray-700 mb-4">Việc giải quyết mặt thứ hai chia triết học thành:</p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 border-2 border-green-400 p-4 rounded-lg">
                      <h4 className="font-bold text-green-900 mb-2">✅ Thuyết khả tri (Gnosticism):</h4>
                      <p className="text-gray-700">Khẳng định con người có thể nhận thức được bản chất của thế giới.</p>
                    </div>
                    <div className="bg-red-50 border-2 border-red-400 p-4 rounded-lg">
                      <h4 className="font-bold text-red-900 mb-2">❌ Thuyết bất khả tri (Agnosticism):</h4>
                      <p className="text-gray-700">Cho rằng con người không thể hiểu được bản chất thực sự của đối tượng (Vật tự nó), chỉ biết được hiện tượng bề ngoài (điển hình là Hume và Kant).</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">❓ Hoài nghi luận:</h4>
                    <p className="text-gray-700">Nghi ngờ khả năng đạt đến chân lý khách quan, có vai trò chống lại giáo điều tôn giáo thời trung cổ.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phần 3: Biện chứng và siêu hình */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-3xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-3">
                3. Biện chứng và siêu hình
              </h2>
              <p className="text-gray-700 mb-6">Đây là hai phương pháp tư duy đối lập nhau trong việc xem xét thế giới:</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">a) Phương pháp siêu hình</h3>
                  <div className="bg-gray-100 p-5 rounded-lg border-2 border-gray-400">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-gray-600 text-xl">•</span>
                        <span className="text-gray-700">Nhận thức đối tượng ở trạng thái <strong>cô lập, tách rời</strong>.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-600 text-xl">•</span>
                        <span className="text-gray-700">Nhận thức đối tượng ở trạng thái <strong>tĩnh tại</strong>; nếu có biến đổi chỉ là biến đổi về lượng, nguyên nhân nằm ở bên ngoài sự vật.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-600 text-xl">•</span>
                        <span className="text-gray-700">Nhìn thấy cây mà không thấy rừng, chỉ thấy sự vật riêng biệt mà không thấy mối liên hệ.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">b) Phương pháp biện chứng</h3>
                  <div className="bg-linear-to-r from-green-100 to-blue-100 p-5 rounded-lg border-2 border-green-400">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 text-xl font-bold">✓</span>
                        <span className="text-gray-800">Nhận thức đối tượng trong các <strong>mối liên hệ phổ biến, ràng buộc và quy định lẫn nhau</strong>.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 text-xl font-bold">✓</span>
                        <span className="text-gray-800">Nhận thức đối tượng ở trạng thái <strong>vận động, biến đổi và phát triển không ngừng</strong>.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 text-xl font-bold">✓</span>
                        <span className="text-gray-800">Nguồn gốc của sự vận động là do <strong>đấu tranh giữa các mặt đối lập (mâu thuẫn nội tại)</strong>.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 text-xl font-bold">✓</span>
                        <span className="text-gray-800">Tư duy mềm dẻo, linh hoạt, thừa nhận sự vật <strong>vừa là nó vừa không phải là nó</strong>.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">c) Các hình thức của phép biện chứng trong lịch sử</h3>
                  <div className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                      <h4 className="font-bold text-amber-900 mb-2">1. Phép biện chứng tự phát (Cổ đại):</h4>
                      <p className="text-gray-700">Thấy được sự biến hóa của vũ trụ nhưng còn dựa trên trực kiến, chưa có cơ sở khoa học thực nghiệm.</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-900 mb-2">2. Phép biện chứng duy tâm (Cổ điển Đức):</h4>
                      <p className="text-gray-700">Đỉnh cao là Hegel. Trình bày hệ thống các quy luật biện chứng nhưng lại cho rằng đó là sự vận động của "Ý niệm tuyệt đối", biện chứng bắt đầu từ tinh thần.</p>
                    </div>
                    <div className="bg-linear-to-r from-red-100 to-pink-100 p-5 rounded-lg border-2 border-red-500">
                      <h4 className="font-bold text-red-900 mb-2 text-lg">3. Phép biện chứng duy vật (Mác - Lênin): ⭐</h4>
                      <p className="text-gray-800">Do C. Mác và Ph. Ăngghen xây dựng. Kế thừa hạt nhân hợp lý của Hegel nhưng gạt bỏ tính thần bí, xây dựng trên lập trường duy vật. Đây là <strong>hình thức hoàn bị nhất</strong>, thống nhất giữa chủ nghĩa duy vật và phép biện chứng.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tóm tắt */}
            <div className="bg-linear-to-r from-indigo-100 via-purple-100 to-pink-100 p-6 rounded-xl border-2 border-indigo-300 mb-6">
              <h3 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                📌 Tóm tắt
              </h3>
              <ul className="space-y-2 text-gray-800">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">✓</span>
                  <span>Triết học là khoa học về những quy luật chung nhất của tự nhiên, xã hội và tư duy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">✓</span>
                  <span>Vấn đề cơ bản: mối quan hệ giữa vật chất và ý thức</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">✓</span>
                  <span>Chủ nghĩa duy vật biện chứng là hình thức triết học cao nhất</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">✓</span>
                  <span>Phép biện chứng duy vật xem xét sự vật trong mối liên hệ và phát triển</span>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Hiển thị nội dung tóm tắt cho các mục khác */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h1 className="text-4xl font-bold text-indigo-900 mb-4">{content.title}</h1>
              <p className="text-lg text-gray-700 leading-relaxed">{content.description}</p>
            </div>

            {content.topics && content.thinkers && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                    📖 Chủ đề chính
                  </h2>
                  <ul className="space-y-3">
                    {content.topics.map((topic, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <span className="text-indigo-600 font-bold mt-1">{index + 1}.</span>
                        <span className="text-gray-700">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
                    👤 Triết gia tiêu biểu
                  </h2>
                  <div className="space-y-3">
                    {content.thinkers.map((thinker, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                          {thinker.charAt(0)}
                        </div>
                        <span className="text-gray-800 font-medium">{thinker}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Phần học tập và ôn tập cho tất cả các mục */}        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4 flex items-center gap-2">
            🎯 Bắt đầu học
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <button className="bg-linear-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all">
              📝 Bài giảng
            </button>
            <button className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all">
              📹 Video
            </button>
            <button className="bg-linear-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all">
              ✍️ Bài tập
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
            🧪 Ôn tập & Kiểm tra
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setShowFlashCard(true)}
              className="bg-linear-to-r from-orange-500 to-amber-500 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              🃏 Flash Cards
            </button>
            <button
              onClick={() => setShowQuiz(true)}
              className="bg-linear-to-r from-teal-500 to-cyan-500 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              📝 Trắc nghiệm
            </button>
          </div>
        </div>
      </div>

      {showFlashCard && <FlashCard onClose={() => setShowFlashCard(false)} />}
      {showQuiz && <Quiz onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
