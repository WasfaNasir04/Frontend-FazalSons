

// import React, { useEffect, useState } from 'react';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CForm,
//   CFormCheck,
//   CFormInput,
//   CFormLabel,
//   CRow,
//   CFormSelect,
//   CTable,
//   CTableBody,
//   CTableHeaderCell,
//   CTableDataCell,
//   CTableRow,
//   CTableHead,
// } from '@coreui/react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import axios from 'axios';

// const AddSubCategory = () => {
//   const [parentCategories, setParentCategories] = useState([]);
//   const [category_name, setCategoryName] = useState('');
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [Category, setCategory] = useState([]);
//   const [sub_category_name, setSubcategoryName] = useState('');
//   const [symbol, setSymbol] = useState('');
//   const [description, setDescription] = useState('');
//   const [status, setStatus] = useState('active');
//   const [isSubcategory, setIsSubcategory] = useState(false);
//   const [selectedParentCategory, setSelectedParentCategory] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedAttributeType, setSelectedAttributeType] = useState('');
//   const [selectedAttribute, setSelectedAttribute] = useState('');
//   const [attributeTypes, setAttributeTypes] = useState([]);
//   const [attributes, setAttributes] = useState([]);
//   const [variations, setVariations] = useState([]); // Variations for displaying in the table

//   useEffect(() => {
//     const fetchParentCategories = async () => {
//       try {
//         const response = await axios.get('http://195.26.253.123/pos/products/add_parent_category');
//         setParentCategories(response.data);
//       } catch (error) {
//         console.error('Error fetching parent categories:', error);
//       }
//     };

//     const fetchCategory = async () => {
//       try {
//         const response = await axios.get('http://195.26.253.123/pos/products/add_category');
//         setCategory(response.data);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     const fetchAttributeTypes = async () => {
//       try {
//         const response = await axios.get('http://195.26.253.123/pos/products/fetch_all_attribute_type/');
//         setAttributeTypes(response.data);
//       } catch (error) {
//         console.error('Error fetching attribute types:', error);
//       }
//     };

//     // Fetch subcategory data for edit
//     if (id) {
//       const fetchSubcategory = async () => {
//         try {
//           const response = await axios.get(`http://195.26.253.123/pos/products/action_subcategory/${id}/`);
//           const data = response.data;
//           setSubcategoryName(data.sub_category_name);
//           setSymbol(data.symbol);
//           setDescription(data.description);
//           setStatus(data.status);
//           setSelectedParentCategory(data.pc_name);
//           setSelectedCategory(data.category_name);
//         } catch (error) {
//           console.error('Error fetching subcategory data:', error);
//         }
//       };

//       fetchSubcategory();
//     }

//     fetchParentCategories();
//     fetchCategory();
//     fetchAttributeTypes();
//   }, [id]); // Dependency array to re-run effect when 'id' changes


//   const handleAttributeTypeChange = async (e) => {
//     const attributeTypeName = e.target.value;
//     setSelectedAttributeType(attributeTypeName);
//     setAttributes([]);
//     setSelectedAttribute('');

//     if (attributeTypeName) {
//       try {
//         const response = await axios.get(`http://195.26.253.123/pos/products/fetch_attribute/${attributeTypeName}/`);
//         setAttributes(response.data);
//       } catch (error) {
//         console.error('Error fetching attributes:', error);
//       }
//     }
//   };



//    const handleAttributeChange = async (e) => {
//     const attributeName = e.target.value;
//     setSelectedAttribute(attributeName);
//     setVariations([]); // Reset variations when a new attribute is selected

//     if (attributeName) {
//       try {
//         const response = await axios.get(`http://195.26.253.123/pos/products/fetch_variation/${encodeURIComponent(attributeName)}/`);
//         setVariations(response.data);  // Update variations with the response
//       } catch (error) {
//         console.error('Error fetching variations:', error);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newSubcategory = {
//       parentCategories: selectedParentCategory,
//       category_name: selectedCategory,
//       sub_category_name: sub_category_name,
//       symbol: symbol,
//       description: description,
//       status: status,
//       isSubcategory,
//       parentCategory: selectedParentCategory,
//       attribute_name: selectedAttribute,
//     };

//     try {
//       if (id) {
//         await axios.put(`http://195.26.253.123/pos/products/action_subcategory/${id}/`, newSubcategory);
//         alert('SubCategory updated successfully!');
//       } else {
//         await axios.post('http://195.26.253.123/pos/products/add_subcategory', newSubcategory);
//         alert('SubCategory added successfully!');
//       }
//       navigate('/Product/SubCategory');
//     } catch (error) {
//       console.error('Error saving the SubCategory:', error);
//       alert('Error saving the SubCategory. Please try again.');
//     }
//   };

//   return (
//     <CCard>
//       <CCardHeader>
//         <strong>{id ? 'Edit Subcategory' : 'Add Subcategory'}</strong>
//       </CCardHeader>
//       <CCardBody>
//         <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//           <Link to="/Product/SubCategory">
//             <CButton href="#" color="primary" className="me-md-2">
//               SubCategory List
//             </CButton>
//           </Link>
//         </div>
        
//         <CForm onSubmit={handleSubmit}>
//           <CRow className="mb-3">
//             <CFormLabel htmlFor="parentCategory" className="col-sm-2 col-form-label">
//               Parent Category
//             </CFormLabel>
//             <CCol sm={10}>
//               <CFormSelect
//                 id="parentCategory"
//                 value={selectedParentCategory}
//                 onChange={(e) => setSelectedParentCategory(e.target.value)}
//               >
//                 <option value="">Select Parent Category</option>
//                 {parentCategories.map((category) => (
//                   <option key={category.pc_name} value={category.pc_name}>
//                     {category.pc_name} 
//                   </option>
//                 ))}
//               </CFormSelect>
//             </CCol>
//           </CRow>

//           <CRow className="mb-3">
//             <CFormLabel htmlFor="Category" className="col-sm-2 col-form-label">
//               Category
//             </CFormLabel>
//             <CCol sm={10}>
//               <CFormSelect
//                 id="Category"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//               >
//                 <option value="">Select Category</option>
//                 {Category.map((category) => (
//                   <option key={category.category_name} value={category.category_name}>
//                     {category.category_name} 
//                   </option>
//                 ))}
//               </CFormSelect>
//             </CCol>
//           </CRow>

//           <CRow className="mb-3">
//             <CFormLabel htmlFor="subcategoryName" className="col-sm-2 col-form-label">
//               Subcategory Name
//             </CFormLabel>
//             <CCol sm={10}>
//               <CFormInput
//                 id="subcategoryName"
//                 value={sub_category_name}
//                 onChange={(e) => setSubcategoryName(e.target.value)}
//                 placeholder="Enter Subcategory Name"
//                 required
//               />
//             </CCol>
//           </CRow>

//           <CRow className="mb-3">
//             <CFormLabel htmlFor="symbol" className="col-sm-2 col-form-label">
//               Short Form/Symbol
//             </CFormLabel>
//             <CCol sm={10}>
//               <CFormInput
//                 id="symbol"
//                 value={symbol}
//                 onChange={(e) => setSymbol(e.target.value)}
//                 placeholder="Enter Symbol"
//               />
//             </CCol>
//           </CRow>

//           <CRow className="mb-3">
//             <CFormLabel htmlFor="description" className="col-sm-2 col-form-label">
//               Description
//             </CFormLabel>
//             <CCol sm={10}>
//               <CFormInput
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Enter Description"
//               />
//             </CCol>
//           </CRow>

//           <CRow className="mb-3">
//             <CFormLabel className="col-sm-2 col-form-label">Status</CFormLabel>
//             <CCol sm={10}>
//               <CFormCheck
//                 type="radio"
//                 id="active"
//                 label="Active"
//                 value="active"
//                 checked={status === 'active'}
//                 onChange={() => setStatus('active')}
//               />
//               <CFormCheck
//                 type="radio"
//                 id="inactive"
//                 label="Inactive"
//                 value="inactive"
//                 checked={status === 'inactive'}
//                 onChange={() => setStatus('inactive')}
//               />
//               <CFormCheck
//                 type="radio"
//                 id="pending"
//                 label="Pending"
//                 value="pending"
//                 checked={status === 'pending'}
//                 onChange={() => setStatus('pending')}
//               />
//             </CCol>
//           </CRow>

//           <CRow className="mb-3">
//             <CFormLabel htmlFor="attributeType" className="col-sm-2 col-form-label">
//               Attribute Type
//             </CFormLabel>
//             <CCol sm={8}>
//               <CFormSelect
//                 id="attributeType"
//                 value={selectedAttributeType}
//                 onChange={handleAttributeTypeChange}
//               >
//                 <option value="">Choose an attribute type</option>
//                 {attributeTypes.map((type) => (
//                   <option key={type.att_type} value={type.att_type}>{type.att_type}</option>
//                 ))}
//               </CFormSelect>
//             </CCol>
//           </CRow>

//           <CRow className="mb-3">
//             <CFormLabel htmlFor="attribute" className="col-sm-2 col-form-label">
//               Attribute
//             </CFormLabel>
//             <CCol sm={8}>
//               <CFormSelect 
//                 id="attribute" 
//                 value={selectedAttribute} 
//                 onChange={handleAttributeChange}
//               >
//                 <option value="">Choose an attribute</option>
//                 {attributes.map((attr) => (
//                   <option key={attr.attribute_name} value={attr.attribute_name}>{attr.attribute_name}</option>
//                 ))}
//               </CFormSelect>
//             </CCol>
//           </CRow>
          

//           <CTable hover responsive>   
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell>Sr#.</CTableHeaderCell>
//             <CTableHeaderCell>Size</CTableHeaderCell>
//             <CTableHeaderCell>Symbol</CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {variations.map((variation, index) => (
//             <CTableRow key={variation.id}>
//               <CTableDataCell>{index + 1}</CTableDataCell>
//               <CTableDataCell>{variation.variation_name}</CTableDataCell>
//               <CTableDataCell>{variation.symbol}</CTableDataCell>
//             </CTableRow>
//           ))}
//         </CTableBody>
//      </CTable>
//       {/* Display "No record found" if selectedAttributeType is set and no variations are found */}
//     {selectedAttributeType && selectedAttribute && variations.length === 0 && (
//       <div className="text-center text-muted mt-3">No record found</div>
//     )}

//           <CRow>
//             <CCol className="text-end">
              
//             </CCol>
//           </CRow>
//           <CButton type="submit" color="primary">{id ? 'Update SubCategory' : 'Add SubCategory'}</CButton>
//         </CForm>
//       </CCardBody>
//     </CCard>
//   );
// };

// export default AddSubCategory;
