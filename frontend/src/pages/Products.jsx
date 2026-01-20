import { useState, useEffect } from 'react';
import { productService, categoryService } from '../services/api';
import { Plus, Edit2, Trash2, Check, X, Coffee } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    preparationTime: '10',
    allergens: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        categoryId: product.category_id?.toString() || '',
        preparationTime: product.preparation_time?.toString() || '10',
        allergens: product.allergens || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: categories[0]?.id?.toString() || '',
        preparationTime: '10',
        allergens: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        preparationTime: parseInt(formData.preparationTime),
        allergens: formData.allergens,
      };

      if (editingProduct) {
        await productService.update(editingProduct.id, data);
      } else {
        await productService.create(data);
      }
      
      closeModal();
      loadData();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await productService.delete(id);
        loadData();
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await productService.toggleAvailability(id);
      loadData();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Non catégorisé';
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1><Coffee size={28} /> Produits</h1>
          <p>Gérez les produits de votre café</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {products.length === 0 ? (
            <p className="empty-message">Aucun produit. Commencez par en ajouter un !</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Disponible</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                      {product.description && (
                        <small className="text-muted d-block">{product.description}</small>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-default">
                        {getCategoryName(product.category_id)}
                      </span>
                    </td>
                    <td><strong>{parseFloat(product.price).toFixed(2)} €</strong></td>
                    <td>
                      <button
                        className={`btn-icon ${product.is_available ? 'success' : 'danger'}`}
                        onClick={() => toggleAvailability(product.id)}
                        title={product.is_available ? 'Disponible' : 'Indisponible'}
                      >
                        {product.is_available ? <Check size={18} /> : <X size={18} />}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => openModal(product)}
                          title="Modifier"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(product.id)}
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button className="btn-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prix (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Catégorie *</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      required
                    >
                      <option value="">Sélectionner</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Temps de préparation (min)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Allergènes</label>
                    <input
                      type="text"
                      value={formData.allergens}
                      onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                      placeholder="ex: gluten, lactose"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
