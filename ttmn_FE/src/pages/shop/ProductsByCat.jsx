import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const ProductsByCat = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy sản phẩm theo category - THÊM INCLUDE BRAND
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/products/category/${id}?include=brand`)
      .then((res) => {
        setProducts(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [id]);

  // Lấy thông tin category
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/categories/${id}`)
      .then((res) => setCategory(res.data.data || null));
  }, [id]);

  // Lấy danh sách brand theo category
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/categories/${id}/brands`)
      .then((res) => setBrands(res.data.data || []));
  }, [id]);

  // Lọc sản phẩm theo brand - SỬA LẠI LOGIC LỌC
  const filteredProducts = selectedBrand === "all"
    ? products
    : products.filter((p) => {
        // Kiểm tra nhiều trường hợp để đảm bảo lọc chính xác
        if (!p.brand) return false;
        
        // So sánh cả số và chuỗi để tránh lỗi type
        const brandId = p.brand.id || p.brand;
        return brandId == selectedBrand; // Dùng == thay vì === để so sánh linh hoạt
      });

  // DEBUG: Kiểm tra dữ liệu
  console.log("Products:", products);
  console.log("Brands:", brands);
  console.log("Selected Brand:", selectedBrand);
  console.log("Filtered Products:", filteredProducts);

  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">
        {category ? `Danh mục: ${category.name}` : "Sản phẩm theo danh mục"}
      </h2>

      {/* Dropdown lọc brand */}
      <div className="mb-3">
        <label className="me-2"><strong>Lọc theo thương hiệu:</strong></label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="form-select"
          style={{ maxWidth: "300px" }}
        >
          <option value="all">Tất cả thương hiệu</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Hiển thị số lượng sản phẩn đã lọc */}
      <div className="mb-3">
        <p>
          <strong>
            {filteredProducts.length} sản phẩm
            {selectedBrand !== "all" && 
              ` trong thương hiệu ${brands.find(b => b.id == selectedBrand)?.name}`
            }
          </strong>
        </p>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="col-md-3 mb-4" key={product.id}>
              <div className="card h-100">
                <img
                  src={`http://127.0.0.1:8000/images/products/${product.thumbnail}`}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    Thương hiệu:{" "}
                    <strong>
                      {product.brand 
                        ? (typeof product.brand === 'object' ? product.brand.name : product.brand)
                        : "Không có"
                      }
                    </strong>
                  </p>
                  <p className="card-text">
                    Giá:{" "}
                    <span className="text-danger">
                      {product.price_sale?.toLocaleString()} VND
                    </span>
                  </p>
                  <p className="card-text">Số lượng: {product.qty}</p>
                  <Link
                    to={`/product-detail/${product.id}`}
                    className="btn btn-primary"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">
              {selectedBrand !== "all" 
                ? `Không có sản phẩm nào trong thương hiệu ${brands.find(b => b.id == selectedBrand)?.name}`
                : "Không có sản phẩm trong danh mục này."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsByCat;