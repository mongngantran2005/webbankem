import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiCategory from '../../../api/apiCategory';

const CategoryEdit = () => {
  const navigate = useNavigate();
  const { documentId } = useParams();
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
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchCategory();
  }, [documentId]);

  const fetchCategories = async () => {
    try {
      const response = await apiCategory.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await apiCategory.getById(documentId);
      if (response.data.success) {
        const category = response.data.data;
        setFormData({
          name: category.name || '',
          parent_id: category.parent_id || 0,
          description: category.description || '',
          sort_order: category.sort_order || 0,
          status: category.status !== undefined ? category.status : true
        });
        
        // Set image preview if image exists
        if (category.image) {
          setImagePreview(`http://127.0.0.1:8000/storage/${category.image}`);
        }
      } else {
        setErrors({ general: 'Không tìm thấy danh mục' });
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      setErrors({ general: 'Lỗi khi tải thông tin danh mục' });
    } finally {
      setFetchLoading(false);
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
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('parent_id', formData.parent_id);
      submitData.append('description', formData.description);
      submitData.append('sort_order', formData.sort_order);
      submitData.append('status', formData.status ? 1 : 0);
      
      if (image) {
        submitData.append('image', image);
      }

      const response = await apiCategory.update(documentId, submitData);
      if (response.data.success) {
        alert('Cập nhật danh mục thành công');
        navigate('/admin/category');
      } else {
        setErrors({ general: response.data.message });
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Lỗi khi cập nhật danh mục' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="loading">Đang tải thông tin danh mục...</div>;

  return (
    <div className="category-form">
      <div className="form-header">
        <h1>Sửa Danh Mục</h1>
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
            {categories
              .filter(cat => cat.id != documentId) // Tránh chọn chính nó làm cha
              .map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            }
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
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
          {errors.image && <span className="error-text">{errors.image[0]}</span>}
        </div>

        {/* Image Preview */}
        {(imagePreview || formData.image) && (
          <div className="form-group">
            <label>Xem Trước Hình Ảnh:</label>
            <div className="image-preview-container">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="image-preview"
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
          <label>
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
          <div className="error-text general-error">
            {errors.general}
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/admin/category')}
            className="btn btn-secondary"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Đang cập nhật...' : 'Cập Nhật Danh Mục'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryEdit;