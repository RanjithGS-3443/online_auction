import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBox, FaEdit, FaMoneyBillWave, FaPlus, FaTrash, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ products: 0, users: 0, payments: 0 });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    startingPrice: '',
    sellerName: '',
    sellerEmail: '',
    imageUrl: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const navigate = useNavigate();
  const adminToken = localStorage.getItem('adminToken');
  
  // Check if admin is logged in
  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
    }
  }, [adminToken, navigate]);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        setStats(response.data.stats);
        setProducts(response.data.recentProducts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [adminToken]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/products', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch all payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/payments', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    if (tab === 'products') {
      fetchProducts();
    } else if (tab === 'users') {
      fetchUsers();
    } else if (tab === 'payments') {
      fetchPayments();
    }
  };
  
  // Handle product form input change
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };
  
  // Handle edit product form input change
  const handleEditProductInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/admin/products', newProduct, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      toast.success('Product added successfully');
      setNewProduct({
        name: '',
        description: '',
        startingPrice: '',
        sellerName: '',
        sellerEmail: '',
        imageUrl: ''
      });
      
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  // Start editing a product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };
  
  // Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/admin/products/${editingProduct._id}`, editingProduct, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      toast.success('Product updated successfully');
      setEditingProduct(null);
      
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      } finally {
        setLoading(false);
      }
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };
  
  // Render dashboard tab
  const renderDashboardTab = () => {
    return (
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Products</h5>
                  <h2>{stats.products}</h2>
                </div>
                <FaBox size={40} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Users</h5>
                  <h2>{stats.users}</h2>
                </div>
                <FaUsers size={40} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Payments</h5>
                  <h2>{stats.payments}</h2>
                </div>
                <FaMoneyBillWave size={40} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Recent Products</h5>
            </div>
            <div className="card-body">
              {products.length > 0 ? (
                <ul className="list-group">
                  {products.map(product => (
                    <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                      {product.name}
                      <span className="badge bg-primary rounded-pill">${product.startingPrice}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No products found</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Recent Payments</h5>
            </div>
            <div className="card-body">
              {payments.length > 0 ? (
                <ul className="list-group">
                  {payments.map(payment => (
                    <li key={payment._id} className="list-group-item d-flex justify-content-between align-items-center">
                      {payment.productName}
                      <span className="badge bg-success rounded-pill">${payment.biddedAmount}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No payments found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render products tab
  const renderProductsTab = () => {
    return (
      <div>
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Add New Product</h5>
            <button className="btn btn-primary btn-sm" onClick={() => setNewProduct({...newProduct, showForm: !newProduct.showForm})}>
              <FaPlus /> {newProduct.showForm ? 'Hide Form' : 'Show Form'}
            </button>
          </div>
          <div className="card-body">
            {newProduct.showForm && (
              <form onSubmit={handleAddProduct}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={newProduct.name}
                      onChange={handleProductInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Starting Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="startingPrice"
                      value={newProduct.startingPrice}
                      onChange={handleProductInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={newProduct.description}
                    onChange={handleProductInputChange}
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Seller Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="sellerName"
                      value={newProduct.sellerName}
                      onChange={handleProductInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Seller Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="sellerEmail"
                      value={newProduct.sellerEmail}
                      onChange={handleProductInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    name="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={handleProductInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5>All Products</h5>
          </div>
          <div className="card-body">
            {loading ? (
              <p>Loading products...</p>
            ) : products.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Seller</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>${product.startingPrice}</td>
                        <td>{product.sellerName}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleEditProduct(product)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No products found</p>
            )}
          </div>
        </div>
        
        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Product</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setEditingProduct(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleUpdateProduct}>
                    <div className="mb-3">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={editingProduct.name}
                        onChange={handleEditProductInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Starting Price</label>
                      <input
                        type="number"
                        className="form-control"
                        name="startingPrice"
                        value={editingProduct.startingPrice}
                        onChange={handleEditProductInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={editingProduct.description}
                        onChange={handleEditProductInputChange}
                        rows="3"
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Seller Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="sellerName"
                        value={editingProduct.sellerName}
                        onChange={handleEditProductInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Seller Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="sellerEmail"
                        value={editingProduct.sellerEmail}
                        onChange={handleEditProductInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Image URL</label>
                      <input
                        type="text"
                        className="form-control"
                        name="imageUrl"
                        value={editingProduct.imageUrl}
                        onChange={handleEditProductInputChange}
                        required
                      />
                    </div>
                    <div className="d-flex justify-content-end">
                      <button 
                        type="button" 
                        className="btn btn-secondary me-2"
                        onClick={() => setEditingProduct(null)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-backdrop show"></div>
          </div>
        )}
      </div>
    );
  };
  
  // Render users tab
  const renderUsersTab = () => {
    return (
      <div className="card">
        <div className="card-header">
          <h5>All Users</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading users...</p>
          ) : users.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
    );
  };
  
  // Render payments tab
  const renderPaymentsTab = () => {
    return (
      <div className="card">
        <div className="card-header">
          <h5>All Payments</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading payments...</p>
          ) : payments.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Bidder</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment._id}>
                      <td>{payment.productName}</td>
                      <td>{payment.userName}</td>
                      <td>${payment.biddedAmount}</td>
                      <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No payments found</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
          <div className="position-sticky pt-3">
            <div className="text-center mb-4">
              <h4 className="text-white">Admin Panel</h4>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'dashboard' ? 'active' : 'text-white'}`}
                  onClick={() => handleTabChange('dashboard')}
                >
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'products' ? 'active' : 'text-white'}`}
                  onClick={() => handleTabChange('products')}
                >
                  Products
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'users' ? 'active' : 'text-white'}`}
                  onClick={() => handleTabChange('users')}
                >
                  Users
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'payments' ? 'active' : 'text-white'}`}
                  onClick={() => handleTabChange('payments')}
                >
                  Payments
                </button>
              </li>
              <li className="nav-item mt-4">
                <button 
                  className="nav-link text-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'products' && 'Products Management'}
              {activeTab === 'users' && 'Users Management'}
              {activeTab === 'payments' && 'Payments'}
            </h1>
          </div>
          
          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'products' && renderProductsTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
        </main>
      </div>

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
          padding: 48px 0 0;
          box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
        }
        
        .sidebar .nav-link {
          font-weight: 500;
          color: #333;
        }
        
        .sidebar .nav-link.active {
          color: #2470dc;
        }
        
        .sidebar-heading {
          font-size: .75rem;
          text-transform: uppercase;
        }
        
        .nav-link {
          padding: 0.5rem 1rem;
        }
        
        .nav-link.active {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 767.98px) {
          .sidebar {
            top: 5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard; 