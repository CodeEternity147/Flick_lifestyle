import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, fetchCategories } from '../../store/slices/productSlice';
import { X, Upload, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

const AddProductModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { categories, categoriesLoading, createLoading } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [],
    isActive: true,
    isFeatured: false,
    tags: [],
    variants: [],
    specifications: {}
  });

  const [newTag, setNewTag] = useState('');
  const [newVariant, setNewVariant] = useState({ name: '', options: [] });
  const [newVariantOption, setNewVariantOption] = useState('');

  useEffect(() => {
    if (isOpen) {
      toast.success('Opening product creation form...');
      dispatch(fetchCategories());
    }
  }, [isOpen, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const selectedFiles = Array.from(files);
      
      // Check file sizes
      const maxSize = 20 * 1024 * 1024; // 20MB
      const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
      
      if (oversizedFiles.length > 0) {
        toast.error(`Some files are too large. Maximum size is 20MB per image.`);
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...selectedFiles]
      }));
      toast.success(`${selectedFiles.length} image(s) selected successfully`);
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      toast.success(`${name} set to ${checked ? 'enabled' : 'disabled'}`);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Show toast for important field changes
      if (name === 'name' && value.length > 0) {
        toast.success('Product name updated');
      } else if (name === 'price' && value > 0) {
        toast.success('Price updated');
      } else if (name === 'stock' && value >= 0) {
        toast.success('Stock quantity updated');
      } else if (name === 'category' && value) {
        toast.success('Category selected');
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check file sizes
    const maxSize = 20 * 1024 * 1024; // 20MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error(`Some files are too large. Maximum size is 20MB per image.`);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    toast.success(`${files.length} image(s) uploaded successfully`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    toast.info('Drop your images here');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    // Check file sizes
    const maxSize = 20 * 1024 * 1024; // 20MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error(`Some files are too large. Maximum size is 20MB per image.`);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    toast.success(`${files.length} image(s) dropped successfully`);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    toast.success('Image removed successfully');
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      toast.success('Tag added successfully');
    } else if (formData.tags.includes(newTag.trim())) {
      toast.error('Tag already exists');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    toast.success('Tag removed successfully');
  };

  const addVariantOption = () => {
    if (newVariantOption.trim() && !newVariant.options.includes(newVariantOption.trim())) {
      setNewVariant(prev => ({
        ...prev,
        options: [...prev.options, newVariantOption.trim()]
      }));
      setNewVariantOption('');
      toast.success('Variant option added');
    } else if (newVariant.options.includes(newVariantOption.trim())) {
      toast.error('Option already exists');
    }
  };

  const removeVariantOption = (option) => {
    setNewVariant(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt !== option)
    }));
    toast.success('Variant option removed');
  };

  const addVariant = () => {
    if (newVariant.name && newVariant.options.length > 0) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { ...newVariant }]
      }));
      setNewVariant({ name: '', options: [] });
      toast.success('Variant added successfully');
    } else {
      toast.error('Please provide variant name and at least one option');
    }
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
    toast.success('Variant removed successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Form validation check starting...');
    
    toast.loading('Validating form data...', { id: 'form-validation' });
    
    // Basic validation
    if (!formData.name.trim()) {
      console.log('Validation failed: name is empty');
      toast.error('Product name is required', { id: 'form-validation' });
      return;
    }
    
    if (!formData.description.trim()) {
      console.log('Validation failed: description is empty');
      toast.error('Product description is required', { id: 'form-validation' });
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      console.log('Validation failed: invalid price');
      toast.error('Valid price is required', { id: 'form-validation' });
      return;
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      console.log('Validation failed: invalid stock');
      toast.error('Valid stock quantity is required', { id: 'form-validation' });
      return;
    }
    
    if (!formData.category) {
      console.log('Validation failed: category is empty');
      toast.error('Category is required', { id: 'form-validation' });
      return;
    }
    
    console.log('All validations passed, creating FormData...');
    toast.success('Form validation passed!', { id: 'form-validation' });
    toast.loading('Creating product...', { id: 'product-creation' });
    
    try {
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('isFeatured', formData.isFeatured);
      
      // Add arrays and objects
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('variants', JSON.stringify(formData.variants));
      formDataToSend.append('specifications', JSON.stringify(formData.specifications));
      
      // Add images
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });

      console.log('Dispatching createProduct with FormData:', {
        entries: Array.from(formDataToSend.entries())
      });

      const result = await dispatch(createProduct(formDataToSend));
      
      console.log('Create product result:', result);
      
      if (createProduct.fulfilled.match(result)) {
        console.log('Product creation successful!');
        toast.success('Product created successfully!', { id: 'product-creation' });
        toast.success('Product form will close automatically');
        onClose();
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          category: '',
          images: [],
          isActive: true,
          isFeatured: false,
          tags: [],
          variants: [],
          specifications: {}
        });
      } else {
        console.error('Product creation failed:', result.payload);
        toast.error(result.payload || 'Failed to create product', { id: 'product-creation' });
      }
    } catch (error) {
      console.error('Product creation error:', error);
      toast.error('An error occurred while creating the product', { id: 'product-creation' });
    }
  };

  const handleCloseModal = () => {
    toast.success('Product form closed');
    onClose();
  };

  const handleFieldFocus = (fieldName) => {
    toast.info(`Editing ${fieldName} field`);
  };

  const handleFieldBlur = (fieldName, value) => {
    if (value && value.trim()) {
      toast.success(`${fieldName} field completed`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      images: [],
      isActive: true,
      isFeatured: false,
      tags: [],
      variants: [],
      specifications: {}
    });
    setNewTag('');
    setNewVariant({ name: '', options: [] });
    setNewVariantOption('');
    toast.success('Form reset successfully');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={(e) => {
          console.log('Form onSubmit triggered');
          handleSubmit(e);
        }} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => handleFieldFocus('product name')}
                onBlur={(e) => handleFieldBlur('product name', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={categoriesLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('description')}
              onBlur={(e) => handleFieldBlur('description', e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload images or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Maximum file size: 20MB per image
                </span>
              </label>
            </div>
            
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus size={16} />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Variants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Variants
            </label>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Variant name (e.g., Color, Size)"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVariantOption}
                    onChange={(e) => setNewVariantOption(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Option value"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariantOption())}
                  />
                  <button
                    type="button"
                    onClick={addVariantOption}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Variant
                </button>
              </div>

              {newVariant.options.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newVariant.options.map((option, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {option}
                      <button
                        type="button"
                        onClick={() => removeVariantOption(option)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {formData.variants.length > 0 && (
                <div className="space-y-2">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{variant.name}:</span>
                        <span className="ml-2 text-gray-600">{variant.options.join(', ')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-between gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Reset Form
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={categoriesLoading || createLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={() => console.log('Submit button clicked')}
              >
                {createLoading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
