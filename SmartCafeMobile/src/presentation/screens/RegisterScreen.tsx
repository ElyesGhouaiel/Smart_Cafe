import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../components/Button';
import {Input} from '../components/Input';
import {COLORS, SPACING} from '../../infrastructure/config/constants';
import {isValidEmail} from '../../infrastructure/utils/validation';
import {AuthService} from '../../infrastructure/services/AuthService';
import {styles} from './RegisterScreen.styles';

interface RegisterScreenProps {
  onRegisterSuccess?: () => void;
  onBackToLogin?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    let valid = true;

    // Email validation
    if (!email.trim()) {
      setEmailError('L\'email est requis');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Format d\'email invalide');
      valid = false;
    } else {
      setEmailError('');
    }

    // First name validation
    if (!firstName.trim()) {
      setFirstNameError('Le prénom est requis');
      valid = false;
    } else {
      setFirstNameError('');
    }

    // Last name validation
    if (!lastName.trim()) {
      setLastNameError('Le nom est requis');
      valid = false;
    } else {
      setLastNameError('');
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError('Le mot de passe est requis');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      valid = false;
    } else {
      setPasswordError('');
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Veuillez confirmer le mot de passe');
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const user = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
        phone: phone.trim() || undefined,
      });

      Alert.alert(
        'Succès',
        `Bienvenue ${user.firstName} ${user.lastName} !\nVotre compte a été créé.`,
      );

      // Redirect to menu after registration
      onRegisterSuccess?.();
    } catch (error: any) {
      Alert.alert(
        'Erreur d\'inscription',
        error.message || 'Impossible de créer le compte',
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
          <Text style={styles.subtitle}>Créez votre compte</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Prénom *"
            value={firstName}
            onChangeText={setFirstName}
            error={firstNameError}
            autoCapitalize="words"
            placeholder="John"
          />

          <Input
            label="Nom *"
            value={lastName}
            onChangeText={setLastName}
            error={lastNameError}
            autoCapitalize="words"
            placeholder="Doe"
          />

          <Input
            label="Email *"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="exemple@email.com"
          />

          <Input
            label="Téléphone (optionnel)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+33 6 12 34 56 78"
          />

          <Input
            label="Mot de passe *"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            isPassword
            placeholder="••••••••"
          />

          <Input
            label="Confirmer le mot de passe *"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmPasswordError}
            isPassword
            placeholder="••••••••"
          />

          <Button
            title="S'inscrire"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <Button
            title="Retour à la connexion"
            onPress={onBackToLogin}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
