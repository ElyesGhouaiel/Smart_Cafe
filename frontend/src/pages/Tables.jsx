import { useState, useEffect } from 'react';
import { tableService } from '../services/api';
import { Plus, Edit2, Trash2, UtensilsCrossed, X, Users, MapPin } from 'lucide-react';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '4',
    location: '',
  });

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const response = await tableService.getAll();
      setTables(response.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        tableNumber: table.table_number.toString(),
        capacity: table.capacity.toString(),
        location: table.location || '',
      });
    } else {
      setEditingTable(null);
      const maxNumber = tables.length > 0 ? Math.max(...tables.map(t => t.table_number)) : 0;
      setFormData({
        tableNumber: (maxNumber + 1).toString(),
        capacity: '4',
        location: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTable(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        tableNumber: parseInt(formData.tableNumber),
        capacity: parseInt(formData.capacity),
        location: formData.location,
      };

      if (editingTable) {
        await tableService.update(editingTable.id, data);
      } else {
        await tableService.create(data);
      }
      
      closeModal();
      loadTables();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
      try {
        await tableService.delete(id);
        loadTables();
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await tableService.updateStatus(id, status);
      loadTables();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'occupied': return 'status-occupied';
      case 'reserved': return 'status-reserved';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Occupée';
      case 'reserved': return 'Réservée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Chargement des tables...</p>
      </div>
    );
  }

  return (
    <div className="tables-page">
      <div className="page-header">
        <div>
          <h1><UtensilsCrossed size={28} /> Tables</h1>
          <p>Gérez les tables de votre établissement</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="tables-grid">
        {tables.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <p className="empty-message">Aucune table. Commencez par en ajouter une !</p>
            </div>
          </div>
        ) : (
          tables.map((table) => (
            <div key={table.id} className={`card table-card ${getStatusClass(table.status)}`}>
              <div className="card-body">
                <div className="table-header">
                  <h3>Table {table.table_number}</h3>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => openModal(table)}
                      title="Modifier"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(table.id)}
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="table-info">
                  <div className="info-item">
                    <Users size={16} />
                    <span>{table.capacity} places</span>
                  </div>
                  {table.location && (
                    <div className="info-item">
                      <MapPin size={16} />
                      <span>{table.location}</span>
                    </div>
                  )}
                </div>

                <div className="table-status">
                  <select
                    value={table.status}
                    onChange={(e) => updateStatus(table.id, e.target.value)}
                    className={`status-select ${getStatusClass(table.status)}`}
                  >
                    <option value="available">Disponible</option>
                    <option value="occupied">Occupée</option>
                    <option value="reserved">Réservée</option>
                  </select>
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
              <h2>{editingTable ? 'Modifier la table' : 'Nouvelle table'}</h2>
              <button className="btn-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Numéro de table *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.tableNumber}
                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacité (places) *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Emplacement</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Terrasse">Terrasse</option>
                    <option value="Intérieur">Intérieur</option>
                    <option value="Bar">Bar</option>
                    <option value="Salon privé">Salon privé</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTable ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
