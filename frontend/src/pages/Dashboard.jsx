import { useState, useEffect } from 'react';
import { productService, categoryService, tableService, orderService } from '../services/api';
import { Coffee, FolderOpen, UtensilsCrossed, ClipboardList, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    tables: 0,
    orders: 0,
    pendingOrders: 0,
    availableTables: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productsRes, categoriesRes, tablesRes, ordersRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        tableService.getAll(),
        orderService.getAll(),
      ]);

      const products = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.data || []);
      const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data?.data || []);
      const tables = Array.isArray(tablesRes.data) ? tablesRes.data : (tablesRes.data?.data || []);
      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.data || []);

      setStats({
        products: products.length,
        categories: categories.length,
        tables: tables.length,
        orders: orders.length,
        pendingOrders: orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)).length,
        availableTables: tables.filter(t => t.status === 'available').length,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue sur Smart Café Manager</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon products">
            <Coffee size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.products}</span>
            <span className="stat-label">Produits</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon categories">
            <FolderOpen size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.categories}</span>
            <span className="stat-label">Catégories</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon tables">
            <UtensilsCrossed size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.availableTables}/{stats.tables}</span>
            <span className="stat-label">Tables disponibles</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <ClipboardList size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.pendingOrders}</span>
            <span className="stat-label">Commandes en cours</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card recent-orders-card">
          <div className="card-header">
            <h2><Clock size={20} /> Commandes récentes</h2>
          </div>
          <div className="card-body">
            {recentOrders.length === 0 ? (
              <p className="empty-message">Aucune commande pour le moment</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>N° Commande</th>
                    <th>Table</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>{order.order_number}</strong></td>
                      <td>Table {order.table_id}</td>
                      <td>{parseFloat(order.total_amount).toFixed(2)} €</td>
                      <td>{getStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card quick-stats-card">
          <div className="card-header">
            <h2><TrendingUp size={20} /> Statistiques rapides</h2>
          </div>
          <div className="card-body">
            <div className="quick-stat">
              <span className="quick-stat-label">Total commandes</span>
              <span className="quick-stat-value">{stats.orders}</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-label">Produits actifs</span>
              <span className="quick-stat-value">{stats.products}</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-label">Capacité tables</span>
              <span className="quick-stat-value">{stats.tables} tables</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
