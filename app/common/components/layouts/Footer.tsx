import Link from "next/link";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import Container from "./Container";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white mt-auto">
      {/* Main Footer */}
      <div className="py-8 md:py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {/* Thông tin công ty */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-4 text-white">Vạn Lộc Infotech</h3>
              <p className="text-gray-400 text-sm mb-4">
                Chuyên cung cấp thiết bị công nghệ, điện tử chất lượng cao. 
                Địa chỉ tin cậy cho mọi nhu cầu công nghệ của bạn.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full hover:bg-primary transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookOutlined />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full hover:bg-primary transition-colors"
                  aria-label="Youtube"
                >
                  <YoutubeOutlined />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full hover:bg-primary transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramOutlined />
                </a>
              </div>
            </div>

            {/* Empty space */}
            <div></div>

            {/* Liên hệ */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Liên hệ</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <PhoneOutlined className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Hotline</p>
                    <div className="flex flex-col gap-1">
                      <a href="tel:0387335333" className="text-white font-semibold hover:text-primary transition-colors">
                        038 733 5333
                      </a>
                      <a href="tel:0909309072" className="text-white font-semibold hover:text-primary transition-colors">
                        090 930 9072
                      </a>
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MailOutlined className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <a href="mailto:info@vanlucinfotech.vn" className="text-white hover:text-primary transition-colors text-sm">
                      info@vanlucinfotech.vn
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <EnvironmentOutlined className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Địa chỉ</p>
                    <p className="text-white text-sm">
                      Số 123, Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ClockCircleOutlined className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Giờ làm việc</p>
                    <p className="text-white text-sm">
                      8:00 - 20:00 (Thứ 2 - Chủ nhật)
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-4">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Vạn Lộc Infotech. Tất cả quyền được bảo lưu.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;

