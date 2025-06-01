import React from 'react'
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-white text-gray-800">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">🌍 TravelViet</div>
          <ul className="hidden md:flex space-x-6">
            <Link to="login">Login</Link>
            <Link to="/admin/staff">Staff</Link>
          </ul>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative">
        <img
          src="https://source.unsplash.com/1600x600/?vietnam,travel"
          alt="Ảnh du lịch"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center">
            Khám phá vẻ đẹp Việt Nam
          </h1>
          <p className="text-lg md:text-xl text-center">
            Từ núi rừng Tây Bắc đến biển xanh Phú Quốc
          </p>
        </div>
      </header>

      {/* Nội dung */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Về TravelViet</h2>
          <p className="text-gray-700 leading-relaxed">
            TravelViet là nền tảng du lịch hàng đầu tại Việt Nam, mang đến những trải nghiệm độc đáo và đáng nhớ
            cho mọi du khách. Chúng tôi kết nối bạn với những địa điểm nổi bật, văn hóa đa dạng và ẩm thực phong phú khắp cả nước.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Tại sao chọn chúng tôi?</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Hỗ trợ 24/7 tận tâm</li>
            <li>Hàng trăm tour đa dạng</li>
            <li>Giá cả minh bạch, không phụ phí</li>
            <li>Đối tác uy tín trên khắp Việt Nam</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-4 mt-12">
        © 2025 TravelViet. Bản quyền đã được bảo hộ.
      </footer>
    </div>
  )
}
