import {initPaymentSheet, presentPaymentSheet} from '@stripe/stripe-react-native';
import ENV from '../config/env';

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

export class PaymentService {
  // Mode démo pour MVP (pas besoin de backend)
  static async processPayment(amount: number): Promise<PaymentResult> {
    try {
      console.log('[PaymentService] Processing payment:', amount);

      const {error: initError} = await initPaymentSheet({
        merchantDisplayName: ENV.APP_NAME,
        paymentIntentClientSecret: await this.createMockPaymentIntent(amount),
        defaultBillingDetails: {
          name: 'Client Smart Café',
        },
        testEnv: __DEV__,
        returnURL: 'smartcafe://payment-return',
      });

      if (initError) {
        console.error('[PaymentService] Init error:', initError);
        return {
          success: false,
          error: initError.message,
        };
      }

      const {error: presentError} = await presentPaymentSheet();

      if (presentError) {
        console.error('[PaymentService] Present error:', presentError);
        return {
          success: false,
          error: presentError.message,
        };
      }

      console.log('[PaymentService] Payment successful');
      return {
        success: true,
        paymentIntentId: 'pi_demo_' + Date.now(),
      };
    } catch (error: any) {
      console.error('[PaymentService] Payment failed:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors du paiement',
      };
    }
  }

  // Mock PaymentIntent pour MVP (sans backend)
  // En production: appeler POST /api/payment/create-intent
  private static async createMockPaymentIntent(amount: number): Promise<string> {
    const amountInCents = Math.round(amount * 100);
    return `pi_demo_${Date.now()}_secret_${amountInCents}`;
  }
}
