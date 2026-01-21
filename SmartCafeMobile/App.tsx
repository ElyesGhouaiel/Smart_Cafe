/**
 * Smart Café Mobile App
 *
 * Main application entry point with screen tabs
 */

import React, {useState, useEffect} from 'react';
import {StatusBar, StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, Alert} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {LoginScreen} from './src/presentation/screens/LoginScreen';
import {RegisterScreen} from './src/presentation/screens/RegisterScreen';
import {ProfileScreen} from './src/presentation/screens/ProfileScreen';
import {MenuScreen} from './src/presentation/screens/MenuScreen';
import {CartScreen} from './src/presentation/screens/CartScreen';
import {OrdersScreen} from './src/presentation/screens/OrdersScreen';
import {COLORS, SPACING, FONT_SIZES} from './src/infrastructure/config/constants';
import {AuthService} from './src/infrastructure/services/AuthService';

type Screen = 'login' | 'register' | 'menu' | 'cart' | 'orders';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await AuthService.isAuthenticated();
      setIsAuthenticated(isAuth);

      // If not authenticated, show login screen
      if (!isAuth) {
        setCurrentScreen('login');
      }
    } catch (error) {
      console.error('[App] Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Redirect to menu after successful login
    setCurrentScreen('menu');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Redirect to login after logout
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        // If authenticated, show profile; otherwise show login
        return isAuthenticated ? (
          <ProfileScreen onLogout={handleLogout} />
        ) : (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setCurrentScreen('register')}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onRegisterSuccess={handleLoginSuccess}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        );
      case 'menu':
        return <MenuScreen />;
      case 'cart':
        return <CartScreen />;
      case 'orders':
        return <OrdersScreen />;
      default:
        return <MenuScreen />;
    }
  };

  // Show loading screen while checking auth
  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Smart Café</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.container}>
        {renderScreen()}

        {/* Simple tab bar for navigation (MVP) */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, !isAuthenticated && styles.tabDisabled]}
            onPress={() => {
              if (isAuthenticated) {
                setCurrentScreen('menu');
              } else {
                Alert.alert(
                  'Connexion requise',
                  'Veuillez vous connecter pour accéder au menu',
                );
              }
            }}
            disabled={!isAuthenticated}>
            <Text style={[styles.tabIcon, !isAuthenticated && styles.tabIconDisabled]}>🍽️</Text>
            <Text style={[
              styles.tabText,
              currentScreen === 'menu' && styles.tabTextActive,
              !isAuthenticated && styles.tabTextDisabled,
            ]}>
              Menu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, !isAuthenticated && styles.tabDisabled]}
            onPress={() => {
              if (isAuthenticated) {
                setCurrentScreen('cart');
              } else {
                Alert.alert(
                  'Connexion requise',
                  'Veuillez vous connecter pour accéder au panier',
                );
              }
            }}
            disabled={!isAuthenticated}>
            <Text style={[styles.tabIcon, !isAuthenticated && styles.tabIconDisabled]}>🛒</Text>
            <Text style={[
              styles.tabText,
              currentScreen === 'cart' && styles.tabTextActive,
              !isAuthenticated && styles.tabTextDisabled,
            ]}>
              Panier
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, !isAuthenticated && styles.tabDisabled]}
            onPress={() => {
              if (isAuthenticated) {
                setCurrentScreen('orders');
              } else {
                Alert.alert(
                  'Connexion requise',
                  'Veuillez vous connecter pour voir vos commandes',
                );
              }
            }}
            disabled={!isAuthenticated}>
            <Text style={[styles.tabIcon, !isAuthenticated && styles.tabIconDisabled]}>📦</Text>
            <Text style={[
              styles.tabText,
              currentScreen === 'orders' && styles.tabTextActive,
              !isAuthenticated && styles.tabTextDisabled,
            ]}>
              Commandes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setCurrentScreen('login')}>
            <Text style={styles.tabIcon}>👤</Text>
            <Text style={[
              styles.tabText,
              currentScreen === 'login' && styles.tabTextActive,
            ]}>
              Compte
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.lg,
    fontSize: FONT_SIZES.h2,
    fontWeight: '700',
    color: COLORS.primary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  tabDisabled: {
    opacity: 0.4,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  tabIconDisabled: {
    opacity: 0.3,
  },
  tabText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  tabTextDisabled: {
    opacity: 0.3,
  },
});

export default App;
