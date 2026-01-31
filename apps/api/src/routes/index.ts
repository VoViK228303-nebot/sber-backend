import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { userController } from '../controllers/user.controller';
import { accountController } from '../controllers/account.controller';
import { transferController } from '../controllers/transfer.controller';
import { transactionController } from '../controllers/transaction.controller';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';
import { authLimiter, registerLimiter, transferLimiter } from '../middleware/rateLimit';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes (public)
router.post('/auth/register', registerLimiter, authController.register);
router.post('/auth/login', authLimiter, authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

// Protected routes
router.use(authenticate);

// User routes
router.get('/users/me', userController.getProfile);
router.put('/users/me', userController.updateProfile);
router.put('/users/me/password', authController.changePassword);
router.get('/users/me/sessions', userController.getSessions);
router.delete('/users/me/sessions/:id', userController.terminateSession);

// User settings
router.get('/users/me/settings', userController.getSettings);
router.put('/users/me/settings', userController.updateSettings);

// Account routes
router.get('/accounts', accountController.getAccounts);
router.post('/accounts', accountController.createAccount);
router.get('/accounts/:id', accountController.getAccountById);
router.put('/accounts/:id', accountController.updateAccount);
router.delete('/accounts/:id', accountController.closeAccount);
router.get('/accounts/:id/transactions', accountController.getAccountTransactions);

// Transfer routes
router.post('/transfers', transferLimiter, transferController.createTransfer);
router.get('/transfers', transferController.getTransfers);
router.get('/transfers/:id', transferController.getTransferById);
router.get('/transfers/templates', transferController.getTemplates);
router.post('/transfers/templates', transferController.createTemplate);
router.delete('/transfers/templates/:id', transferController.deleteTemplate);

// Transaction routes
router.get('/transactions', transactionController.getTransactions);
router.get('/transactions/:id', transactionController.getTransactionById);
router.get('/transactions/summary', transactionController.getSummary);
router.get('/transactions/categories', transactionController.getCategories);

// Dashboard routes
router.get('/dashboard', dashboardController.getDashboard);

export default router;
