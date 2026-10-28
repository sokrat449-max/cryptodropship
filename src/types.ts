export interface WalletConfig {
  polygonWallet: string;
  baseWallet: string;
  tronWallet: string;
  solanaWallet: string;
  preferredChain: 'polygon' | 'base' | 'ethereum' | 'tron' | 'solana';
  minProfitMarginUsd: number;
  defaultCommissionRate: number;
  autoExecute: boolean;
  notificationEmail: string;
}

export interface ArbitrageItem {
  id: string;
  title: string;
  category: 'eSIM & Connectivity' | 'Software & OS' | 'Security & VPN' | 'Cloud & AI Vouchers' | 'Gaming & Digital Cards';
  supplier: string;
  wholesalePriceUsd: number;
  retailPriceUsd: number;
  estimatedNetMarginUsd: number;
  marginPercent: number;
  dailyDemandVolume: number;
  instantDeliveryType: 'API_CODE' | 'QR_ESIM' | 'LICENSE_KEY' | 'VOUCHER_PIN';
  chainSupported: ('polygon' | 'base' | 'ethereum' | 'tron' | 'solana')[];
  riskLevel: 'LOW' | 'VERY_LOW';
  activeDemandCount: number;
}

export interface OrderExecution {
  txId: string;
  timestamp: string;
  productTitle: string;
  category: string;
  chain: 'polygon' | 'base' | 'ethereum' | 'tron' | 'solana';
  currency: 'USDT' | 'USDC';
  totalPaidByCustomerUsd: number;
  wholesaleSupplierCostUsd: number;
  netCommissionToUserUsd: number;
  userRecipientWallet: string;
  onChainTxHash: string;
  deliveryStatus: 'COMPLETED' | 'SPLIT_CONFIRMED' | 'DELIVERED_TO_BUYER';
  deliveredItemKey: string;
}

export interface MarketRates {
  usdt: number;
  usdc: number;
  pol: number;
  trx: number;
  sol: number;
}
