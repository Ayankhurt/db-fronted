import { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ProductCard from './component/productCard1';
import { useFormik } from 'formik';
import * as yup from 'yup';

function App() {
  const [productList, setProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const baseUrl = 'http://localhost:3000';

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/products`);
      setProductList(res.data.product_list);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = (productId) => {
    setProductList(prev => prev.filter(product => product.id !== productId));
  };

  const validationSchema = yup.object({
    productName: yup.string().required('Product name is required'),
    productPrice: yup
      .number()
      .typeError('Price must be a number')
      .positive('Price must be positive')
      .required('Product price is required'),
    description: yup.string().required('Description is required'),
  });

  const formik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        await axios.post(`${baseUrl}/product`, {
          name: values.productName,
          price: values.productPrice,
          description: values.description,
        });
        resetForm();
        getProducts();
      } catch (error) {
        console.error("Submit error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="app-title">Product Management</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="main-content">
        <div className="form-wrapper">
          <h2>Add New Product</h2>
          <form onSubmit={formik.handleSubmit} className="product-form">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                onChange={formik.handleChange}
                value={formik.values.productName}
                className={formik.errors.productName && formik.touched.productName ? "input-error" : ""}
                placeholder="Enter product name"
              />
              {formik.errors.productName && formik.touched.productName && (
                <div className="error-msg">{formik.errors.productName}</div>
              )}
            </div>

            <div className="form-group">
              <label>Product Price</label>
              <input
                type="number"
                name="productPrice"
                onChange={formik.handleChange}
                value={formik.values.productPrice}
                className={formik.errors.productPrice && formik.touched.productPrice ? "input-error" : ""}
                placeholder="Enter price"
              />
              {formik.errors.productPrice && formik.touched.productPrice && (
                <div className="error-msg">{formik.errors.productPrice}</div>
              )}
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                className={formik.errors.description && formik.touched.description ? "input-error" : ""}
                placeholder="Enter product description"
              ></textarea>
              {formik.errors.description && formik.touched.description && (
                <div className="error-msg">{formik.errors.description}</div>
              )}
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>

        <div className="product-list">
          {loading && <div className="loading">Loading...</div>}
          {!loading && filteredProducts.length === 0 && (
            <p className="no-products">No products found.</p>
          )}
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onDelete={handleDelete}
              onUpdate={getProducts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
