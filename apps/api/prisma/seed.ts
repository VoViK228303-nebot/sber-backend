import { PrismaClient, AccountType, TransactionType } from '@prisma/client';
import { hashPassword } from '../src/utils/password';
import {
  generateAccountNumber,
  generateCardNumber,
  generateExpiryDate,
  generateCVV,
} from '../src/utils/formatters';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.transaction.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.transferTemplate.deleteMany();
  await prisma.card.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleaned existing data');

  // Create test user
  const hashedPassword = await hashPassword('password123');

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      phone: '+79001234567',
      password: hashedPassword,
      firstName: 'Иван',
      lastName: 'Иванов',
      patronymic: 'Иванович',
      verified: true,
      settings: {
        create: {},
      },
    },
  });

  console.log('👤 Created test user:', user.email);

  // Create accounts
  const debitAccount = await prisma.account.create({
    data: {
      userId: user.id,
      type: AccountType.DEBIT,
      number: generateAccountNumber(),
      balance: 125000.5,
      availableBalance: 125000.5,
      currency: 'RUB',
      name: 'Основной счёт',
    },
  });

  const savingsAccount = await prisma.account.create({
    data: {
      userId: user.id,
      type: AccountType.SAVINGS,
      number: generateAccountNumber(),
      balance: 50000.0,
      availableBalance: 50000.0,
      currency: 'RUB',
      name: 'Накопительный счёт',
    },
  });

  const creditAccount = await prisma.account.create({
    data: {
      userId: user.id,
      type: AccountType.CREDIT,
      number: generateAccountNumber(),
      balance: 0,
      availableBalance: 100000.0,
      currency: 'RUB',
      name: 'Кредитный счёт',
    },
  });

  console.log('💳 Created 3 accounts');

  // Create cards
  await prisma.card.create({
    data: {
      accountId: debitAccount.id,
      number: generateCardNumber(),
      expiryDate: generateExpiryDate(),
      cvv: generateCVV(),
      holderName: 'IVAN IVANOV',
      isVirtual: false,
    },
  });

  await prisma.card.create({
    data: {
      accountId: savingsAccount.id,
      number: generateCardNumber(),
      expiryDate: generateExpiryDate(),
      cvv: generateCVV(),
      holderName: 'IVAN IVANOV',
      isVirtual: true,
    },
  });

  console.log('💳 Created 2 cards');

  // Create transactions
  const transactions = [
    {
      userId: user.id,
      toAccountId: debitAccount.id,
      amount: 150000.0,
      currency: 'RUB',
      type: TransactionType.CREDIT,
      description: 'Зачисление зарплаты',
      category: 'salary',
      balanceAfter: 150000.0,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    },
    {
      userId: user.id,
      fromAccountId: debitAccount.id,
      amount: 1500.0,
      currency: 'RUB',
      type: TransactionType.DEBIT,
      description: 'Пятёрочка',
      category: 'groceries',
      balanceAfter: 148500.0,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      userId: user.id,
      fromAccountId: debitAccount.id,
      amount: 2500.0,
      currency: 'RUB',
      type: TransactionType.DEBIT,
      description: 'Метро',
      category: 'transport',
      balanceAfter: 146000.0,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      userId: user.id,
      fromAccountId: debitAccount.id,
      amount: 3500.0,
      currency: 'RUB',
      type: TransactionType.DEBIT,
      description: 'Кино',
      category: 'entertainment',
      balanceAfter: 142500.0,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      userId: user.id,
      fromAccountId: debitAccount.id,
      toAccountId: savingsAccount.id,
      amount: 17500.0,
      currency: 'RUB',
      type: TransactionType.TRANSFER_OUT,
      description: 'Перевод на накопительный счёт',
      category: 'transfer',
      balanceAfter: 125000.0,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      userId: user.id,
      toAccountId: savingsAccount.id,
      fromAccountId: debitAccount.id,
      amount: 17500.0,
      currency: 'RUB',
      type: TransactionType.TRANSFER_IN,
      description: 'Пополнение с основного счёта',
      category: 'transfer',
      balanceAfter: 50000.0,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      userId: user.id,
      fromAccountId: debitAccount.id,
      amount: 2800.0,
      currency: 'RUB',
      type: TransactionType.DEBIT,
      description: 'Аптека',
      category: 'health',
      balanceAfter: 122200.0,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      userId: user.id,
      fromAccountId: debitAccount.id,
      amount: 4500.0,
      currency: 'RUB',
      type: TransactionType.DEBIT,
      description: 'Ресторан',
      category: 'restaurants',
      balanceAfter: 117700.0,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const tx of transactions) {
    await prisma.transaction.create({
      data: tx,
    });
  }

  console.log('💰 Created 8 transactions');

  // Create transfer templates
  await prisma.transferTemplate.create({
    data: {
      userId: user.id,
      name: 'Маме',
      toAccountNumber: '40817810100001234567',
      recipientName: 'Мария Ивановна',
      amount: 5000.0,
      currency: 'RUB',
      description: 'На продукты',
    },
  });

  await prisma.transferTemplate.create({
    data: {
      userId: user.id,
      name: 'Аренда',
      toAccountNumber: '40817810100007654321',
      recipientName: 'ИП Смирнов',
      amount: 35000.0,
      currency: 'RUB',
      description: 'Аренда квартиры',
    },
  });

  console.log('📝 Created 2 transfer templates');

  // Create a second user for testing transfers
  const user2Password = await hashPassword('password456');
  const user2 = await prisma.user.create({
    data: {
      email: 'petr@example.com',
      phone: '+79009876543',
      password: user2Password,
      firstName: 'Пётр',
      lastName: 'Петров',
      patronymic: 'Петрович',
      verified: true,
      settings: {
        create: {},
      },
    },
  });

  const user2Account = await prisma.account.create({
    data: {
      userId: user2.id,
      type: AccountType.DEBIT,
      number: generateAccountNumber(),
      balance: 75000.0,
      availableBalance: 75000.0,
      currency: 'RUB',
      name: 'Основной счёт',
    },
  });

  await prisma.card.create({
    data: {
      accountId: user2Account.id,
      number: generateCardNumber(),
      expiryDate: generateExpiryDate(),
      cvv: generateCVV(),
      holderName: 'PETR PETROV',
      isVirtual: false,
    },
  });

  console.log('👤 Created second test user:', user2.email);

  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('Test credentials:');
  console.log('  Email: user@example.com');
  console.log('  Password: password123');
  console.log('');
  console.log('  Email: petr@example.com');
  console.log('  Password: password456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
