/**
 * Blockchain and NFT-related type definitions for Curmunchkins Mystery Box Explorer
 * Defines Algorand blockchain integration, NFT metadata, and wallet management
 */

import type { MunchieCharacter, AttachmentType, RarityTier } from './story.types';

export type NetworkType = 'mainnet' | 'testnet' | 'betanet' | 'sandnet';

export type WalletProvider = 'pera' | 'myalgo' | 'walletconnect' | 'defly' | 'exodus' | 'app_managed';

export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'rejected';

export type AssetType = 'story_nft' | 'character_nft' | 'achievement_nft' | 'collection_nft';

export interface WalletConnection {
  provider: WalletProvider;
  address: string;
  isConnected: boolean;
  connectedAt: number;
  lastActivity: number;
  
  // Wallet capabilities
  capabilities: {
    signTransactions: boolean;
    signArbitraryData: boolean;
    multisig: boolean;
    atomicTransactions: boolean;
  };
  
  // Network information
  network: NetworkType;
  nodeUrl: string;
  indexerUrl: string;
}

export interface AlgorandAccount {
  address: string;
  balance: number; // microAlgos
  minBalance: number; // microAlgos
  assets: AlgorandAsset[];
  createdAssets: number[];
  participation?: {
    voteParticipationKey: string;
    selectionParticipationKey: string;
    voteFirst: number;
    voteLast: number;
    voteKeyDilution: number;
  };
  status: 'online' | 'offline';
  rewardsBase: number;
}

export interface AlgorandAsset {
  assetId: number;
  amount: number;
  creator: string;
  frozen: boolean;
  decimals: number;
  name: string;
  unitName: string;
  url: string;
  metadataHash: string;
  manager: string;
  reserve: string;
  freeze: string;
  clawback: string;
  total: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS hash or URL
  imageIntegrity?: string; // SHA-256 hash
  imageMimetype?: string;
  
  // Standard NFT properties
  properties: {
    // Curmunchkins-specific properties
    character: MunchieCharacter;
    attachment: AttachmentType;
    storyId: string;
    rarity: RarityTier;
    
    // Therapeutic and educational properties
    sensoryStrategies: string[];
    therapeuticGoals: string[];
    ageRange: string;
    difficultyLevel: string;
    
    // Collection properties
    series: string;
    edition: number;
    totalSupply: number;
    
    // Gameplay properties
    unlockDate: number;
    completionTime?: number;
    achievements: string[];
    
    // Accessibility properties
    accessibilityFeatures: string[];
    languageSupport: string[];
  };
  
  // Additional metadata
  attributes: {
    trait_type: string;
    value: string | number;
    display_type?: 'boost_number' | 'boost_percentage' | 'number' | 'date';
    max_value?: number;
  }[];
  
  // External links
  external_url?: string;
  animation_url?: string; // For animated NFTs
  youtube_url?: string;
  
  // Creator information
  creator: {
    name: string;
    description: string;
    image: string;
    external_url: string;
  };
  
  // Collection information
  collection: {
    name: string;
    family: string;
    description: string;
    image: string;
    external_url: string;
  };
}

export interface NFTAsset {
  assetId: number;
  metadata: NFTMetadata;
  owner: string;
  creator: string;
  mintedAt: number;
  lastTransferred?: number;
  
  // On-chain data
  onChain: {
    name: string;
    unitName: string;
    total: number;
    decimals: number;
    url: string;
    metadataHash: string;
    manager: string;
    reserve: string;
    freeze: string;
    clawback: string;
  };
  
  // IPFS data
  ipfs: {
    metadataHash: string;
    imageHash: string;
    metadataUrl: string;
    imageUrl: string;
  };
  
  // Verification status
  verification: {
    verified: boolean;
    verifiedBy: string;
    verificationDate: number;
    authenticity: 'genuine' | 'suspicious' | 'fake';
  };
}

export interface TransactionRequest {
  type: 'asset_create' | 'asset_transfer' | 'asset_opt_in' | 'payment';
  from: string;
  to?: string;
  amount?: number;
  assetId?: number;
  note?: string;
  
  // Asset creation specific
  assetParams?: {
    total: number;
    decimals: number;
    defaultFrozen: boolean;
    unitName: string;
    assetName: string;
    url: string;
    metadataHash: string;
    manager?: string;
    reserve?: string;
    freeze?: string;
    clawback?: string;
  };
  
  // Transaction options
  options: {
    fee?: number;
    flatFee?: boolean;
    firstRound?: number;
    lastRound?: number;
    genesisID?: string;
    genesisHash?: string;
    lease?: Uint8Array;
    rekeyTo?: string;
  };
}

export interface TransactionResult {
  txId: string;
  status: TransactionStatus;
  confirmedRound?: number;
  assetId?: number;
  fee: number;
  timestamp: number;
  
  // Error information
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  
  // Transaction details
  details: {
    sender: string;
    receiver?: string;
    amount?: number;
    assetId?: number;
    note?: string;
    type: string;
  };
}

export interface MintingRequest {
  storyId: string;
  userId: string;
  characterId: MunchieCharacter;
  attachmentType: AttachmentType;
  completionData: {
    completedAt: number;
    duration: number;
    achievements: string[];
    accessibilityUsed: string[];
  };
  
  // Minting preferences
  preferences: {
    walletAddress?: string; // If user has connected wallet
    autoMint: boolean;
    shareWithParent: boolean;
    includeInCollection: boolean;
  };
}

export interface MintingResult {
  success: boolean;
  assetId?: number;
  txId?: string;
  ipfsHash?: string;
  error?: string;
  
  // Minting details
  details: {
    mintedAt: number;
    gasUsed: number;
    totalCost: number; // microAlgos
    metadata: NFTMetadata;
    recipient: string;
  };
}

export interface CollectionStats {
  userId: string;
  totalNFTs: number;
  uniqueCharacters: MunchieCharacter[];
  uniqueAttachments: AttachmentType[];
  rarityDistribution: Record<RarityTier, number>;
  
  // Collection milestones
  milestones: {
    firstNFT: number;
    tenthNFT: number;
    firstRare: number;
    firstEpic: number;
    firstLegendary: number;
    completeCharacterSet: number;
    completeAttachmentSet: number;
  };
  
  // Value and rarity
  estimatedValue: number; // In Algos
  rarityScore: number;
  collectionRank: number;
  
  lastUpdated: number;
}

export interface MarketplaceData {
  assetId: number;
  
  // Listing information
  listing: {
    isListed: boolean;
    price?: number; // microAlgos
    seller?: string;
    listedAt?: number;
    expiresAt?: number;
  };
  
  // Trading history
  history: {
    date: number;
    price: number;
    seller: string;
    buyer: string;
    txId: string;
  }[];
  
  // Market metrics
  metrics: {
    floorPrice: number;
    lastSalePrice: number;
    averagePrice: number;
    totalVolume: number;
    salesCount: number;
    uniqueOwners: number;
  };
  
  // Rarity and ranking
  rarity: {
    rank: number;
    score: number;
    percentile: number;
    traits: {
      trait: string;
      value: string;
      rarity: number;
    }[];
  };
}

export interface BlockchainError {
  code: 'WALLET_NOT_CONNECTED' | 'INSUFFICIENT_FUNDS' | 'TRANSACTION_FAILED' | 'NETWORK_ERROR' | 'INVALID_ADDRESS' | 'ASSET_NOT_FOUND' | 'MINTING_FAILED' | 'IPFS_ERROR';
  message: string;
  details?: any;
  timestamp: number;
  recoverable: boolean;
  suggestedAction: string;
  
  // Context information
  context: {
    walletAddress?: string;
    assetId?: number;
    txId?: string;
    network: NetworkType;
    operation: string;
  };
}

export interface IPFSUpload {
  hash: string;
  url: string;
  size: number;
  uploadedAt: number;
  
  // Upload details
  details: {
    filename: string;
    mimetype: string;
    gateway: string;
    pinned: boolean;
    replications: number;
  };
  
  // Verification
  verification: {
    verified: boolean;
    integrity: string; // SHA-256 hash
    accessible: boolean;
    lastChecked: number;
  };
}

// Type guards for blockchain data validation
export const isNetworkType = (value: string): value is NetworkType => {
  return ['mainnet', 'testnet', 'betanet', 'sandnet'].includes(value);
};

export const isWalletProvider = (value: string): value is WalletProvider => {
  return ['pera', 'myalgo', 'walletconnect', 'defly', 'exodus', 'app_managed'].includes(value);
};

export const isTransactionStatus = (value: string): value is TransactionStatus => {
  return ['pending', 'confirmed', 'failed', 'rejected'].includes(value);
};

export const isAssetType = (value: string): value is AssetType => {
  return ['story_nft', 'character_nft', 'achievement_nft', 'collection_nft'].includes(value);
};

// Utility types for blockchain data manipulation
export type WalletConnectionUpdate = Partial<Omit<WalletConnection, 'provider' | 'address'>>;
export type NFTMetadataUpdate = Partial<NFTMetadata>;
export type TransactionRequestUpdate = Partial<TransactionRequest>;

// Default configurations
export const DEFAULT_NETWORK_CONFIG = {
  testnet: {
    server: 'https://testnet-api.algonode.cloud',
    indexer: 'https://testnet-idx.algonode.cloud',
    port: 443,
    token: '',
  },
  mainnet: {
    server: 'https://mainnet-api.algonode.cloud',
    indexer: 'https://mainnet-idx.algonode.cloud',
    port: 443,
    token: '',
  },
};

export const DEFAULT_MINTING_CONFIG = {
  decimals: 0, // NFTs are not divisible
  defaultFrozen: false,
  unitName: 'CMBE', // Curmunchkins Mystery Box Explorer
  manager: '', // Will be set to app account
  reserve: '', // Will be set to app account
  freeze: '', // Will be set to app account
  clawback: '', // Will be set to app account
};