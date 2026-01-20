import { useState, useEffect } from 'react';
import { orderService, tableService, productService } from '../services/api';
import { Plus, ClipboardList, X, Eye, RefreshCw } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    tableId: '',
    items: [{ productId: '', quantity: 1 }],
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersRes, tablesRes, productsRes] = await Promise.all([
        orderService.getAll(),
        tableService.getAll(),
        productService.getAll(),
      ]);
      setOrders(ordersRes.data);
      setTables(tablesRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setFormData({
      tableId: tables[0]?.id?.toString() || '',
      items: [{ productId: products[0]?.id?.toString() || '', quantity: 1 }],
      notes: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: products[0]?.id?.toString() || '', quantity: 1 }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        tableId: parseInt(formData.tableId),
        items: formData.items.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
        })),
        notes: formData.notes,
      };

      await orderService.create(data);
      closeModal();
      loadData();
    } catch (error) {
      console.error('Erreur création:', error);
      alert('Erreur lors de la création de la commande');
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      loadData();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  const cancelOrder = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      try {
        await orderService.cancel(orderId);
        loadData();
        if (showDetailModal) closeDetailModal();
      } catch (error) {
        console.error('Erreur annulation:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'En attente', class: 'badge-warning' },
      confirmed: { label: 'Confirmée', class: 'badge-info' },
      preparing: { label: 'En préparation', class: 'badge-info' },
      ready: { label: 'Prête', class: 'badge-success' },
      served: { label: 'Servie', class: 'badge-success' },
      paid: { label: 'Payée', class: 'badge-success' },
      cancelled: { label: 'Annulée', class: 'badge-danger' },
    };
    const statusInfo = statusMap[status] || { label: status, class: 'badge-default' };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const filteredOrders = filterStatus
    ? orders.filter(o => o.status === filterStatus)
    : orders;

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Produit inconnu';
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Chargement des commandes...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1><ClipboardList size={28} /> Commandes</h1>
          <p>Gérez les commandes du café</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={loadData} title="Rafraîchir">
            <RefreshCw size={18} />
          </button>
          <button className="btn btn-primary" onClick={openModal}>
            <Plus size={18} /> Nouvelle commande
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="preparing">En préparation</option>
          <option value="ready">Prête</option>
          <option value="served">Servie</option>
          <option value="paid">Payée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      <div className="card">
        <div className="card-body">
          {filteredOrders.length === 0 ? (
            <p className="empty-message">Aucune commande trouvée</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Table</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.order_number}</strong></td>
                    <td>Table {order.table_id}</td>
                    <td><strong>{parseFloat(order.total_amount).toFixed(2)} €</strong></td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>{new Date(order.created_at).toLocaleString('fr-FR')}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => openDetailModal(order)}
                          title="Voir détails"
                        >
                          <Eye size={18} />
                        </button>
                        {order.status !== 'cancelled' && order.status !== 'paid' && (
                          <select
                            className="status-mini-select"
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="preparing">En préparation</option>
                            <option value="ready">Prête</option>
                            <option value="served">Servie</option>
                            <option value="paid">Payée</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Nouvelle Commande */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nouvelle commande</h2>
              <button className="btn-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Table *</label>
                  <select
                    value={formData.tableId}
                    onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner une table</option>
                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        Table {table.table_number} ({table.capacity} places) - {table.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Articles *</label>
                  <div className="items-list">
                    {formData.items.map((item, index) => (
                      <div key={index} className="item-row">
                        <select
                          value={item.productId}
                          onChange={(e) => updateItem(index, 'productId', e.target.value)}
                          required
                        >
                          <option value="">Sélectionner un produit</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - {parseFloat(product.price).toFixed(2)} €
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          className="quantity-input"
                        />
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            className="btn-icon danger"
                            onClick={() => removeItem(index)}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
                      <Plus size={16} /> Ajouter un article
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="2"
                    placeholder="Instructions spéciales..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Créer la commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détail Commande */}
      {showDetailModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Commande {selectedOrder.order_number}</h2>
              <button className="btn-close" onClick={closeDetailModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="order-detail-info">
                <p><strong>Table:</strong> {selectedOrder.table_id}</p>
                <p><strong>Statut:</strong> {getStatusBadge(selectedOrder.status)}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</p>
                <p><strong>Total:</strong> {parseFloat(selectedOrder.total_amount).toFixed(2)} €</p>
                {selectedOrder.notes && (
                  <p><strong>Notes:</strong> {selectedOrder.notes}</p>
                )}
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="order-items-list">
                  <h4>Articles</h4>
                  <ul>
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx}>
                        {item.quantity}x {getProductName(item.product_id)} - {parseFloat(item.unit_price).toFixed(2)} €
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="modal-footer">
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'paid' && (
                <button
                  className="btn btn-danger"
                  onClick={() => cancelOrder(selectedOrder.id)}
                >
                  Annuler la commande
                </button>
              )}
              <button className="btn btn-secondary" onClick={closeDetailModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
