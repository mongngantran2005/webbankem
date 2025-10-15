import React from "react";
import about from "../../assets/shop/images/about.jpg";
import about2 from "../../assets/shop/images/portfolio-6.jpg";
import about3 from "../../assets/shop/images/service-1.jpg";
import about4 from "../../assets/shop/images/service-2.jpg";
import about5 from "../../assets/shop/images/service-3.jpg";

import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
  
  return (
    <div className="about-section container py-5">
      <div className="text-center mb-5">
        <h2 className="section-title">
        Kem Truyền Thống & Thơm Ngon Từ Năm 1950
        </h2>
      </div>
      <div className="row align-items-center">
        {/* Phần About Us */}
        <div className="col-lg-4 col-md-6 mb-4">
          <h3 className="section-subtitle">Về Chúng Tôi</h3>
          <p className="text-muted">
          Chúng tôi tự hào mang đến những ly kem thơm ngon, 
          mát lạnh với công thức truyền thống từ năm 1950.
           Được làm từ nguyên liệu tự nhiên, kem của chúng
            tôi không chỉ có hương vị hấp dẫn mà còn mang lại 
            cảm giác tươi mát và sảng khoái
          </p>
          <p className="text-muted">
          Với sự kết hợp hoàn hảo giữa sữa tươi, trái cây và các nguyên liệu cao cấp, mỗi muỗng kem đều mang đến trải nghiệm đầy thú vị. Hãy cùng thưởng thức hương vị đặc biệt của chúng tôi!
          </p>
          <a href="#" className="btn btn-outline-primary rounded-pill px-4 py-2">
          [Tìm Hiểu Thêm]
          </a>
        </div>

        {/* Hình ảnh kem */}
        <div className="col-lg-4 col-md-12 mb-4 text-center">
          <div className="ice-cream-image-wrapper">
            <img src={about} alt="Ice Cream" className="img-fluid rounded"/>
          </div>
        </div>

         {/* Phần Our Features */}
        <div className="col-lg-4 col-md-6 mb-4">
          <h3 className="section-subtitle">Đặc Điểm Nổi Bật</h3>
          <p className="text-muted">
          Kem được làm từ nguyên liệu tự nhiên, mang đến hương vị thơm ngon, béo mịn và tươi mát. 
          </p>
          <p className="text-muted">
          Mỗi muỗng kem đều là sự hòa quyện hoàn hảo giữa vị ngọt dịu và kết cấu mềm mịn, tạo nên trải nghiệm đầy thú vị.

          </p>
          <ul className="list-unstyled features-list">
            <li>
              <span className="checkmark">✔</span>  Nguyên liệu tươi ngon, không chất bảo quản
            </li>
            <li>
              <span className="checkmark">✔</span> Hương vị đa dạng, từ truyền thống đến hiện đại
            </li>
            <li>
              <span className="checkmark">✔</span> Công thức độc quyền, giữ trọn vẹn vị ngon tự nhiên
            </li>
          </ul>
          
        </div>
      </div>







      <div className="ice-cream-section container-fluid py-5">
      <div className="row align-items-center">
        {/* Phần hình ảnh kem */}
        <div className="col-lg-6 col-md-12 mb-4 position-relative">
          <div className="ice-cream-image-wrapper">
            <img
              src={about2}
              alt="Ice Cream"
              className="img-fluid ice-cream-image"
            />
          </div>
        </div>

        {/* Phần thông tin kem */}
        <div className="col-lg-6 col-md-12 mb-4 text-center text-lg-start">
          <div className="ice-cream-info">
            {/* Giá */}
            <div className="price-tag">
              <span>$199</span>
            </div>
            {/* Tiêu đề */}
            <h3 className="ice-cream-title">Kem Ốc Quế Dâu Tươi Mát</h3>
            {/* Mô tả */}
            <p className="ice-cream-description">
            Thưởng thức hương vị tươi ngon và mát lạnh của kem ốc quế dâu – sự 
            kết hợp hoàn hảo giữa kem tươi béo mịn và vị dâu ngọt dịu tự nhiên. 
            Được bao bọc trong lớp vỏ ốc quế giòn tan, mỗi miếng kem mang đến trải nghiệm khó quên,
             giúp bạn tận hưởng khoảnh khắc ngọt ngào nhất.
            </p>
            {/* Nút Order Now */}
            <button className="btn order-now-btn">Hãy đặt hàng ngay và tận hưởng vị ngon khó cưỡng!</button>
          </div>
        </div>
      </div>
    </div>
      

    <div className="services-section container-fluid py-5">
      {/* Tiêu đề chính */}
      <div className="text-start mb-5">
        <h2 className="section-title">
        Dịch Vụ Tốt Nhất Chúng Tôi Cung Cấp        </h2>
        {/* Nút điều hướng */}
        <div className="navigation-arrows">
          <button className="arrow-btn left-arrow">←</button>
          <button className="arrow-btn right-arrow">→</button>
        </div>
      </div>

      {/* Danh sách dịch vụ */}
      <div className="row">
        {/* Dịch vụ 1 */}
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="service-card">
            <div className="service-image-wrapper">
              <img
                src={about3}
                alt="Quality Maintain"
                className="img-fluid service-image"
              />
            </div>
            <h3 className="service-title">Chất Lượng Hảo Hạng</h3>
            <p className="service-description">
            Chúng tôi cam kết mang đến những viên kem tươi ngon nhất, 
            được làm từ nguyên liệu tự nhiên và quy trình kiểm soát chất lượng nghiêm ngặt.
             Hương vị tuyệt vời trong từng muỗng kem!
            </p>
            <a href="#" className="learn-more-link">
            Khám phá ngay!
            </a>
          </div>
        </div>

        {/* Dịch vụ 2 */}
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="service-card">
            <div className="service-image-wrapper">
              <img
                src={about4}
                alt="Individual Approach"
                className="img-fluid service-image"
              />
            </div>
            <h3 className="service-title">Hương Vị Cá Nhân Hóa</h3>
            <p className="service-description">
            Tùy chỉnh hương vị theo sở thích của bạn! Hãy chọn từ nhiều loại 
            topping hấp dẫn như socola, trái cây, hoặc nước sốt đặc biệt để 
            tạo ra ly kem hoàn hảo cho riêng mình.
            </p>
            <a href="#" className="learn-more-link">
            Khám phá ngay!

            </a>
          </div>
        </div>

        {/* Dịch vụ 3 */}
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="service-card">
            <div className="service-image-wrapper">
              <img
                src={about5}
                alt="Celebration Ice Cream"
                className="img-fluid service-image"
              />
            </div>
            <h3 className="service-title">Kem Hoàn Hảo Cho Mọi Dịp</h3>
            <p className="service-description">
            Dù là tiệc sinh nhật, kỷ niệm hay buổi họp mặt gia đình, kem của
            chúng tôi sẽ giúp bạn tạo nên những khoảnh khắc ngọt ngào và đáng nhớ.
            </p>
            <a href="#" className="learn-more-link">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>




    </div>
  );
};

export default About;