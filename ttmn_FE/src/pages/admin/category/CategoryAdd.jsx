import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiCategory from '../../../api/apiCategory';

const CategoryAdd = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    parent_id: 0,
    description: '',
    sort_order: 0,
    status: true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('🔄 Fetching categories for dropdown...');
      const response = await apiCategory.getAll();
      if (response.data.success) {
        console.log('✅ Categories loaded for dropdown:', response.data.data.length);
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📸 Image selected:', file.name, file.size);
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    console.log('🗑️ Removing image');
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});

  console.log('🚀 Starting create process...');
  console.log('📝 Form Data:', formData);

  try {
    const submitData = new FormData();
    
    // Đảm bảo tất cả giá trị đều được append
    submitData.append('name', formData.name || '');
    submitData.append('parent_id', formData.parent_id?.toString() || '0');
    submitData.append('description', formData.description || '');
    submitData.append('sort_order', formData.sort_order?.toString() || '0');
    submitData.append('status', formData.status ? '1' : '0');
    
    if (image) {
      submitData.append('image', image);
      console.log('📸 Image included:', image.name, image.size);
    }

    // Debug chi tiết FormData
    console.log('📤 FormData contents:');
    for (let [key, value] of submitData.entries()) {
      console.log(`  ${key}:`, value);
    }

    console.log('🌐 Calling API: POST /categories');
    const response = await apiCategory.admin.create(submitData);
    
    console.log('✅ API Response:', response.data);
    
    if (response.data.success) {
      alert('Thêm danh mục thành công');
      navigate('/admin/category');
    } else {
      console.error('❌ API returned error:', response.data.message);
      setErrors({ general: response.data.message });
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
    console.error('❌ Full error object:', error);
    console.error('❌ Error response data:', error.response?.data);
    console.error('❌ Error response status:', error.response?.status);
    console.error('❌ Validation errors:', error.response?.data?.errors);
    
    if (error.response?.status === 422) {
      // Hiển thị chi tiết lỗi validation
      const validationErrors = error.response.data.errors;
      console.log('🔍 Detailed validation errors:', validationErrors);
      setErrors(validationErrors);
      
      // Hiển thị alert với lỗi cụ thể
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join(', ');
        alert(`Lỗi validation: ${errorMessages}`);
      }
    } else {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi thêm danh mục';
      setErrors({ general: errorMessage });
      alert(`Lỗi: ${errorMessage}`);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="category-form">
      <div className="form-header">
        <h1>Thêm Danh Mục Mới</h1>
        <button 
          type="button"
          onClick={() => navigate('/admin/category')} 
          className="btn btn-back"
        >
          ← Quay Lại Danh Sách
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Tên Danh Mục *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Nhập tên danh mục"
            required
          />
          {errors.name && <span className="error-text">{errors.name[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="parent_id">Danh Mục Cha</label>
          <select
            id="parent_id"
            name="parent_id"
            value={formData.parent_id}
            onChange={handleChange}
          >
            <option value="0">-- Không có danh mục cha --</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô Tả</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Nhập mô tả cho danh mục"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sort_order">Thứ Tự Sắp Xếp</label>
          <input
            type="number"
            id="sort_order"
            name="sort_order"
            value={formData.sort_order}
            onChange={handleChange}
            min="0"
            placeholder="Số thứ tự hiển thị"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Hình Ảnh</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            <small>Chọn ảnh cho danh mục (JPEG, PNG, JPG, GIF - Tối đa 2MB)</small>
          </div>
          {errors.image && <span className="error-text">{errors.image[0]}</span>}
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="form-group">
            <label>Xem Trước Hình Ảnh:</label>
            <div className="image-preview-container">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="image-preview"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                  console.log('❌ Image failed to load, using placeholder');
                }}
              />
              <button 
                type="button" 
                onClick={removeImage}
                className="btn btn-delete btn-sm"
              >
                Xóa Ảnh
              </button>
            </div>
          </div>
        )}

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            Kích hoạt danh mục
          </label>
        </div>

        {errors.general && (
          <div className="error-message general-error">
            <strong>Lỗi:</strong> {errors.general}
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/admin/category')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Đang thêm...
              </>
            ) : (
              'Thêm Danh Mục'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryAdd;