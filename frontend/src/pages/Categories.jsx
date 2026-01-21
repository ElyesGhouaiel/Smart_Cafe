import { useState, useEffect } from 'react';
import { categoryService } from '../services/api';
import { Plus, Edit2, Trash2, FolderOpen, X } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayOrder: '0',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(Array.isArray(response.data) ? response.data : (response.data?.data || []));
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        displayOrder: category.display_order?.toString() || '0',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        displayOrder: '0',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        description: formData.description,
        displayOrder: parseInt(formData.displayOrder),
      };

      if (editingCategory) {
        await categoryService.update(editingCategory.id, data);
      } else {
        await categoryService.create(data);
      }
      
      closeModal();
      loadCategories();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await categoryService.delete(id);
        loadCategories();
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression. Vérifiez qu\'aucun produit n\'est lié à cette catégorie.');
      }
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Chargement des catégories...</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <div>
          <h1><FolderOpen size={28} /> Catégories</h1>
          <p>Organisez vos produits par catégories</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="categories-grid">
        {categories.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <p className="empty-message">Aucune catégorie. Commencez par en créer une !</p>
            </div>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="card category-card">
              <div className="card-body">
                <div className="category-header">
                  <h3>{category.name}</h3>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => openModal(category)}
                      title="Modifier"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(category.id)}
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {category.description && (
                  <p className="category-description">{category.description}</p>
                )}
                <div className="category-meta">
                  <span>Ordre d'affichage: {category.display_order}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
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
                <div className="form-group">
                  <label>Ordre d'affichage</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
