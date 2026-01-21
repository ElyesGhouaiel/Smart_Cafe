/**
 * Login Screen
 *
 * User authentication screen with email/password
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../components/Button';
import {Input} from '../components/Input';
import {COLORS, SPACING, FONT_SIZES} from '../../infrastructure/config/constants';
import {isValidEmail} from '../../infrastructure/utils/validation';
import {AuthService} from '../../infrastructure/services/AuthService';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onNavigateToRegister?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    let valid = true;

    if (!email.trim()) {
      setEmailError('L\'email est requis');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Format d\'email invalide');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Le mot de passe est requis');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const user = await AuthService.login({email, password});
      Alert.alert(
        'Succès',
        `Bienvenue ${user.firstName} ${user.lastName} !`,
      );
      // Redirect to menu after login
      onLoginSuccess?.();
    } catch (error: any) {
      Alert.alert(
        'Erreur de connexion',
        error.message || 'Identifiants incorrects',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.scrollContent, {paddingTop: insets.top + SPACING.md}]}>
        <View style={styles.header}>
          <Text style={styles.title}>☕ Smart Café</Text>
          <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="exemple@email.com"
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            isPassword
            placeholder="••••••••"
          />

          <Button
            title="Se connecter"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <Button
            title="Créer un compte"
            onPress={onNavigateToRegister}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.h1,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginBottom: SPACING.md,
  },
});
