import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';

function ProductCard({ product, onDelete, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
  });

  const baseUrl = 'https://backend-db-seven.vercel.app';

  const handleClose = () => {
    Swal.fire({
      title: 'Discard changes?',
      text: "Your changes will not be saved!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, discard!',
      cancelButtonText: 'Continue editing'
    }).then((result) => {
      if (result.isConfirmed) {
        setShowModal(false);
        setEditedProduct({
          name: product.name,
          price: product.price,
          description: product.description,
        });
      }
    });
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.delete(`${baseUrl}/product/${product.id}`);
      onDelete(product.id);
      Swal.fire(
        'Deleted!',
        'Product has been deleted.',
        'success'
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire(
        'Error!',
        'Failed to delete product. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editedProduct.name || !editedProduct.price || !editedProduct.description) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'All fields are required!',
      });
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(`${baseUrl}/product/${product.id}`, editedProduct);
      onUpdate();
      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product has been updated.',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update product. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="product-card">
        <div className="product-content">
          <h3>{product.name}</h3>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>
          <p className="timestamp">{moment(product.created_at).format("DD MMM YYYY hh:mm A")}</p>
        </div>
        <div className="button-group">
          <button 
            onClick={() => setShowModal(true)} 
            className="btn-edit"
            disabled={isLoading}
          >
            Edit
          </button>
          <button 
            onClick={handleDelete} 
            className="btn-delete"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={editedProduct.name}
                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                placeholder="Enter product name"
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={editedProduct.price}
                onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                placeholder="Enter price"
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedProduct.description}
                onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                placeholder="Enter description"
                disabled={isLoading}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductCard;
