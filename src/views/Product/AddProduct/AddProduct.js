import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from 'axios';
import Select from 'react-select';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const AddProduct = () => {
  const initialFormData = {
    product_name: '',
    sku: '',
    season: '',
    description: '',
    color: [],
    size: [],
    attribute: [],
    variations: [],
    cost_price: '',
    selling_price: '',
    discount_price: '',
    wholesale_price: '',
    retail_price: '',
    token_price: '',
    outlet: 1,
    category: '',
    brand: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams();
  const [headCategories, setHeadCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [productList, setProductList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [selectedHeadCategory, setSelectedHeadCategory] = useState('');
const [selectedParentCategory, setSelectedParentCategory] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
const [selectedsubCategory, setSelectedsubCategory] = useState('');
const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({})
  


  // Fetch attributes on component load
  useEffect(() => {
    fetchAttributes();
  }, []);
  const fetchAttributes = async (categoryId) => {
    if (!categoryId) {
      console.error('Category ID is undefined or null');
      return; // Prevent making the request if categoryId is invalid
    }
  
    try {
      const response = await axios.get(
        `http://16.171.145.107/pos/products/fetch_categories/${categoryId}`
      );
      const data = response.data;
  
      // Transform data for multi-select dropdown
      const options = data.map((item) => ({
        value: item.attribute,
        label: item.attribute,
        variations: item.variation, // Optional: Handle variations if needed
      }));
  
      setAttributes(options); // Populate attributes dropdown
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };
  

  // // Handle attribute selection
  // const handleAttributeChange = (selectedOptions) => {
  //   setSelectedAttributes(selectedOptions || []);

  //   // Extract variations for the selected attributes
  //   const selectedVariations = selectedOptions
  //     ? selectedOptions.map((option) => ({
  //         attribute: option.label,
  //         variations: option.variations,
  //       }))
  //     : [];

  //   setVariations(selectedVariations);
  // };


  // const handleVariationChange = (e, attribute) => {
  //   const { value, checked } = e.target;
  //   setSelectedVariations(prevState => {
  //     const updatedVariations = prevState[attribute] || [];
  //     if (checked) {
  //       // Add selected variation
  //       updatedVariations.push(value);
  //     } else {
  //       // Remove unselected variation
  //       const index = updatedVariations.indexOf(value);
  //       if (index > -1) updatedVariations.splice(index, 1);
  //     }
  //     return { ...prevState, [attribute]: updatedVariations };
  //   });
  // };


  // Handle attribute selection
  const handleAttributeChange = (selectedOptions) => {
    setSelectedAttributes(selectedOptions || []);

    // Extract variations for the selected attributes
    const selectedVariations = selectedOptions
      ? selectedOptions.map((option) => ({
          attribute: option.label,
          variations: option.variations,
        }))
      : [];

    setVariations(selectedVariations);
  };

  // Handle variation selection for each attribute
  const handleVariationChange = (e, attribute) => {
    const { value, checked } = e.target;

    setSelectedVariations((prevState) => {
      const updatedVariations = prevState[attribute] || [];

      if (checked) {
        // Add selected variation
        updatedVariations.push(value);
      } else {
        // Remove unselected variation
        const index = updatedVariations.indexOf(value);
        if (index > -1) updatedVariations.splice(index, 1);
      }

      return { ...prevState, [attribute]: updatedVariations };
    });
  };

useEffect(() => {
  fetchHeadCategories();
}, []);

// Fetch Head Categories
const fetchHeadCategories = async () => {
  try {
    const response = await axios.get('http://16.171.145.107/pos/products/add_head_category');
    setHeadCategories(response.data);
  } catch (error) {
    console.error('Error fetching head categories:', error);
    //setError('Failed to load head categories. Please try again later.');
  }
  
}; 

const handleHeadCategoryChange = async (e) => {
  const headCategoryId = e.target.value; // This will now hold the numeric ID
  console.log('Selected Head Category ID:', headCategoryId); // Logs the correct ID

  setSelectedHeadCategory(headCategoryId); // Save selected head category

  // Reset dependent dropdowns
  setParentCategories([]);
  setCategories([]);
  setSubCategories([]);
  setSelectedCategory('');
  setSelectedParentCategory('');
  setSelectedsubCategory('');

  if (headCategoryId) {
    try {
      const response = await axios.get(
        `http://16.171.145.107/pos/products/fetch_head_to_parent_category/${headCategoryId}/`
      );
      console.log('Parent Categories:', response.data);
      setParentCategories(response.data); // Populate parent categories
    } catch (error) {
      console.error(
        `Error fetching parent categories for Head Category ID: ${headCategoryId}`,
        error
      );
      // Optional: Display error message to user
    }
  }
};


// Fetch Categories based on selected Parent Category
const handleParentCategoryChange = async (e) => {
  const parentCategoryId = e.target.value;

  if (!parentCategoryId) {
    console.error('Parent Category ID is missing!');
    return; // Prevent making the request if parentCategoryId is invalid
  }

  setSelectedParentCategory(parentCategoryId); // Save selected parent category
  setCategories([]); // Reset categories and subcategories
  setSubCategories([]); 
  setSelectedCategory('');
  setSelectedsubCategory('');

  try {
    const response = await axios.get(
      `http://16.171.145.107/pos/products/fetch_parent_to_category/${encodeURIComponent(parentCategoryId)}/`
    );
    setCategories(response.data); // Populate categories
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
  
};

// Fetch Subcategories based on selected Category
const handleCategoryChange = async (e) => {
  const categoryId = e.target.value;
  
  // Check if categoryId is valid before proceeding
  if (!categoryId) {
    console.error('Category ID is missing!');
    return;
  }

  setSelectedCategory(categoryId); // Save selected category
  setSubCategories([]); // Reset subcategories
  setSelectedsubCategory('');
  setAttributes([]); // Reset attributes

  try {
    const response = await axios.get(
      `http://16.171.145.107/pos/products/fetch_category_to_sub_category/${encodeURIComponent(categoryId)}/`
    );
    setSubCategories(response.data); // Populate subcategories

    // Fetch related attributes dynamically
    fetchAttributes(categoryId); // Ensure categoryId is passed correctly
  } catch (error) {
    console.error('Error fetching subcategories or attributes:', error);
  }
  console.log('Category ID:', categoryId);

};


// Helper Function to Reset Dependent Dropdowns
const resetDependentDropdowns = () => {
  setParentCategories([]);
  setCategories([]);
  setSubCategories([]);
  setSelectedCategory('');
  setSelectedParentCategory('');
  setSelectedsubCategory('');
};



  const colorOptions = [
    { value: 'Almond', label: 'Almond' },
    { value: 'Angoori', label: 'Angoori' },
    { value: 'Baby blue', label: 'Baby blue' },
    { value: 'Baby pink', label: 'Baby pink' },
    { value: 'Beige', label: 'Beige' },
    { value: 'Biscuit', label: 'Biscuit' },
    { value: 'Black', label: 'Black' },
    { value: 'Bottle green', label: 'Bottle green' },
    { value: 'Bronze brown', label: 'Bronze brown' },
    { value: 'Burgundy', label: 'Burgundy' },
    { value: 'Camel', label: 'Camel' },
    { value: 'Caramel', label: 'Caramel' },
    { value: 'Champagne', label: 'Champagne' },
    { value: 'Violet', label: 'Violet' },
    { value: 'White', label: 'White' },
  ];

  const sizeOptions = [
    { value: 'S', label: 'S' },
    { value: 'XS', label: 'XS' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
  ];

  // const BASE_URL = 'http://16.171.145.107/pos';

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const [headResponse, parentResponse, categoryResponse, brandResponse] = await Promise.all([
          axios.get('http://16.171.145.107/pos/products/add_head_category'),
          axios.get('http://16.171.145.107/pos/products/add_parent_category/'),
          axios.get('http://16.171.145.107/pos/products/add_category'),
          axios.get('http://16.171.145.107/pos/products/add_brand')
        ]);
        
        const brandsData = brandResponse.data.results || [];
        setBrands(Array.isArray(brandsData) ? brandsData : []); // Ensure you are setting the correct data
        setHeadCategories(headResponse.data);
        setParentCategories(parentResponse.data);
        setCategories(categoryResponse.data);
       
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchProductList();
    // fetchSubCategories();
    // fetchParentCategories();
    // fetchCategories();
    
  }, []);
  
  const fetchProductList = async () => {
    try {
      const response = await axios.get('http://16.171.145.107/pos/products/add_temp_product');
      setProductList(response.data);  
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  ;

  
  


  const handleMultiSelectChange = (selectedOptions, name) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prevData => ({
      ...prevData,
      [name]: values,
    }));
  };
  
  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  
   
  };


  const handleAdd = async (e) => {
  e.preventDefault();

  // Manually format color as a string (e.g., "[ 'Baby pink' ]")
  const colorString = `[ '${formData.color.join("', '")}' ]`;

  const variationsFormatted = Object.keys(selectedVariations).map((attribute) => {
    return [selectedVariations[attribute]]; // Wrap each selection in an array
  });


  const newProduct = {
    product_name: formData.product_name,
    sku: formData.sku,
    season: formData.season,
    description: formData.description,
    color: colorString,  // color as a string (e.g., "[ 'Baby blue', 'Baby pink' ]")
    attribute: formData.attribute,  // Selected attributes
    variations: JSON.stringify(variationsFormatted), // Variations formatted as array of arrays
    cost_price: formData.cost_price,
    selling_price: formData.selling_price,
    discount_price: formData.discount_price,
    wholesale_price: formData.wholesale_price,
    retail_price: formData.retail_price,
    token_price: formData.token_price,
    outlet: formData.outlet,
    category: formData.category,
    brand: formData.brand,
  };
    try {
      const response = await axios.post('http://16.171.145.107/pos/products/add_temp_product', newProduct);
      if (response.status === 200 || response.status === 201) {
        alert('Product added successfully!');
        fetchProductList();
        resetForm();
      } else {
        alert('Failed to add the product. Please try again.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product.');
    }
  };
  
  
  

  
const handleEdit = async (id,e) => {
 
  const productToEdit = productList.find(product => product.id === id);
  if (productToEdit) {
    setFormData({
      product_name: productToEdit.product_name || '',
      outlet_name: productToEdit.outlet_name || 'Fazal Sons',
      sku: productToEdit.sku || '',
      head_category: productToEdit.head_category || '',
      parent_category: productToEdit.parent_category || '',
      category: productToEdit.category || '',
      season: productToEdit.season || '',
      description: productToEdit.description || '',
      color: productToEdit.color ? productToEdit.color.split(',') : [],
      cost_price: productToEdit.cost_price || '',
      selling_price: productToEdit.selling_price || '',
      discount_price: productToEdit.discount_price || '',
      wholesale_price: productToEdit.wholesale_price || '',
      retail_price: productToEdit.retail_price || '',
      token_price: productToEdit.token_price || '',
      brand_name: productToEdit.brand_name || '',
    });
    
    setEditMode(true);
    
    setEditProductId(id); 
    e.preventDefault();
    
  } else {
    console.error("Product not found:", id);
  }
};


const handleUpdate = async () => {
  if (editProductId) {
    const updatedProductData = {
      ...formData,
      color: formData.color.join(','), 
      size: formData.size.join(','),   
      used_for_inventory: formData.used_for_inventory ? "Yes" : "No",  
    };

    try {
      const response = await axios.put(`http://16.171.145.107/pos/products/action_temp_product/${editProductId}/`, updatedProductData); 
      if (response.status === 200 || response.status === 201) {
        const updatedProductList = productList.map((product) =>
          product.id === editProductId
            ? { ...product, ...updatedProductData }
            : product
        );
        setProductList(updatedProductList);
        
        // Success Toast
        toast.success('Product updated successfully!');
      } else {
        // Failure Toast
        toast.error('Failed to update the product. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      
      // Error Toast
      toast.error('An error occurred while updating the product.');
    }
  }
  resetForm(); 
};

  
const handleDelete = async (id) => {
  try {
    const response = await axios.delete(`http://16.171.145.107/pos/products/action_temp_product/${id}/`);
    if (response.status === 200 || response.status === 204) {
      setProductList(prevList => prevList.filter((product) => product.id !== id));
      alert('Product deleted successfully!');
    } else {
      console.error('Failed to delete the product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error deleting the product. Please try again.');
  }
};


const resetForm = () => {
  setFormData({
    product_name: '',
    outlet_name: 'Fazal Sons',
    sku: '',
    head_category: '',
    parent_category: '',
    category: '',
    sub_category: '',
    season: '',
    description: '',
    color: [],
    size: [],
    used_for_inventory: false,
    cost_price: '',
    selling_price: '',
    discount_price: '',
    wholesale_price: '',
    retail_price: '',
    token_price: '',
    brand_name: '',
  });
  setEditMode(false);
  setEditProductId(null);
};

const handlePublish = async () => {
  console.log('Publishing with data:', formData);
 
 

  try {
    const response = await axios.post('http://16.171.145.107/pos/products/add_product');
    if (response.status === 201 || response.status === 200) {
      alert('Product published successfully!');
      history.push('/Product/AllProducts'); 
    } else {
      alert('Failed to publish the product. Please try again.');
    }
  } catch (error) {
    console.error('Error publishing product:', error);
    alert('An error occurred while publishing the product.');
  }
};


  return (
    <div className="add-product-form">
      <h2>Product Information</h2>
      <h2>{editMode ? 'Edit Product' : ''}</h2>
    
      <Paper square>
        <Tabs
          value={activeTab}
          textColor="primary"
          indicatorColor="primary"
          onChange={(event, newValue) => setActiveTab(newValue)}
          centered
        >
          <Tab label="General" />
          <Tab label="Color, Sizes & Pricing" />
        </Tabs>
      </Paper>

      <div className="form-container">
        <form>
          {activeTab === 0 && (
            <div className="form-column">
              <label>
                Product Name:
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Outlet Name:
                <select
                  name="outlet_name"
                  value={formData.outlet_name}
                  onChange={handleChange}
                  required
                >
                  <option value="Fazal Sons">Fazal Sons</option>
                </select>
              </label>
              <label>
                SKU:
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </label>
             {/* Head Category Dropdown */}
      
        {/* Head Category Dropdown */}
<label>Head Category</label>
<select onChange={handleHeadCategoryChange}>
  <option value="">Select Head Category</option>
  {headCategories.map((headCategory) => (
    <option key={headCategory.id} value={headCategory.id}>
      {headCategory.hc_name} {/* Display the name but pass the ID */}
    </option>
  ))}
</select>
      
{/* Parent Category Dropdown */}
<label>Parent Category</label>
<select value={selectedParentCategory}
  onChange={handleParentCategoryChange}
  disabled={!selectedHeadCategory}>
  <option value="">Select Parent Category</option>
  {Array.isArray(parentCategories) && parentCategories.map(parentCategory => (
    <option key={parentCategory.id} value={parentCategory.id}>
      {parentCategory.pc_name}
    </option>
  ))}
</select>

{/* Category Dropdown */}
<label>Category</label>
<select value={selectedCategory}
  onChange={handleCategoryChange}
  disabled={!selectedParentCategory}>
  <option value="">Select Category</option>
  {Array.isArray(categories) && categories.map(category => (
    <option key={category.id} value={category.id}>
      {category.category_name}
    </option>
  ))}
</select>

{/* Subcategory Dropdown */}
<label>Subcategory</label>
<select value={selectedsubCategory}
  onChange={(e) => setSelectedsubCategory(e.target.value)}
  disabled={!selectedCategory}>
  <option value="">Select Subcategory</option>
  {Array.isArray(subcategories) && subcategories.map(subCategory => (
    <option key={subCategory.id} value={subCategory.id}>
      {subCategory.sub_category_name}
    </option>
  ))}
</select>

      
              <label>
              Brands:
              <select>
    {brands.map(brand => (
        <option key={brand.id} value={brand.id}>
            {brand.brand_name} 
        </option>
    ))}
</select>
              </label>
              <label>
                Season:
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                >
                  <option value="">Select Season</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                  <option value="Spring">Spring</option>
                  <option value="Autumn">Autumn</option>
                </select>
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-column">
              {/* Color and Size Inputs */}
              <label>
  Color:
  <Select
    isMulti
    options={colorOptions}
    value={formData.color.map(c => ({ value: c, label: c }))} // Pre-fill the select with the selected values
    onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'color')}
  />


</label>

     <label>Select Attributes:</label>
<Select
  isMulti
  options={attributes}
  onChange={handleAttributeChange}
  placeholder="Select attributes..."
/>

{/* Display Variations */}
{variations.length > 0 && (
  <div>
    <h3>Variations</h3>
    {variations.map(({ attribute, variations }) => (
      <div key={attribute} style={{ marginTop: '20px' }}>
        <h5>{attribute}</h5>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {variations.map(variation => (
            <label key={variation} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name={attribute} // Group checkboxes for each attribute
                value={variation}
                onChange={(e) => handleVariationChange(e, attribute)} // Handle variation change
              />
              {variation}
            </label>
          ))}
        </div>
      </div>
    ))}
  </div>
)}


    
              <label>
                Cost Price:
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Selling Price:
                <input
                  type="number"
                  name="selling_price"
                  value={formData.selling_price}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Discount Price:
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleChange}
                />
              </label>
              <label>
                Wholesale Price:
                <input
                  type="number"
                  name="wholesale_price"
                  value={formData.wholesale_price}
                  onChange={handleChange}
                />
              </label>
              <label>
                Retail Price:
                <input
                  type="number"
                  name="retail_price"
                  value={formData.retail_price}
                  onChange={handleChange}
                />
              </label>
              <label>
                Token Price:
                <input
                  type="number"
                  name="token_price"
                  value={formData.token_price}
                  onChange={handleChange}
                />
              </label>
              {/* <button type="button" onClick={handleAdd}>Add Product</button> */}
              <button type="button" onClick={editMode ? handleUpdate : handleAdd}> 
    {editMode ? 'Update Product' : 'Add Product'}
  </button>

              {/* Product List Table */}
              <table className="product-list-table">
                <thead>
                  <tr>
                    <th>Sr.#</th>
                    <th>Color</th>
                    <th>Cost</th>
                    <th>Selling</th>
                    <th>Discount</th>
                    <th>Wholesale</th>
                    <th>Retail</th>
                    <th>Token</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product,index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      
                      <td>{product.color}</td>
                      
                      <td>{product.cost_price}</td>
                      <td>{product.selling_price}</td>
                      <td>{product.discount_price}</td>
                      <td>{product.wholesale_price}</td>
                      <td>{product.retail_price}</td>
                      <td>{product.token_price}</td>
                      <td>
                        <button onClick={() => handleEdit(product.id)}>Edit</button>
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
  <button type="button" onClick={handlePublish}>Publish</button>
</div>
            </div>
          )}
        </form>
      </div>
    

    </div>
    
  );
  

};

export default AddProduct;
