/**
 * Blockchain and NFT state management using Zustand
 * Handles Algorand wallet connections, NFT minting, and collection management
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { 
  WalletConnection,
  AlgorandAccount,
  NFTAsset,
  TransactionResult,
  MintingRequest,
  MintingResult,
  CollectionStats,
  BlockchainError,
  NetworkType,
  WalletProvider,
  TransactionStatus,
  DEFAULT_NETWORK_CONFIG 
} from '@/types';

export interface BlockchainStoreState {
  // Network and connection
  network: NetworkType;
  isConnected: boolean;
  walletConnection: WalletConnection | null;
  account: AlgorandAccount | null;
  
  // NFT collection
  nftCollection: NFTAsset[];
  collectionStats: CollectionStats | null;
  
  // Transaction state
  pendingTransactions: Map<string, TransactionResult>;
  transactionHistory: TransactionResult[];
  
  // Minting state
  isMinting: boolean;
  mintingQueue: MintingRequest[];
  lastMintResult: MintingResult | null;
  
  // Loading and error states
  isLoading: boolean;
  error: BlockchainError | null;
  
  // App-managed wallet (for children without crypto knowledge)
  appManagedWallet: {
    enabled: boolean;
    address: string | null;
    balance: number;
  };
}

export interface BlockchainStoreActions {
  // Network management
  setNetwork: (network: NetworkType) => void;
  
  // Wallet connection
  connectWallet: (provider?: WalletProvider) => Promise<void>;
  disconnectWallet: () => void;
  createAppManagedWallet: () => Promise<void>;
  
  // Account management
  refreshAccount: () => Promise<void>;
  getBalance: () => Promise<number>;
  
  // NFT operations
  mintStoryNFT: (request: MintingRequest) => Promise<MintingResult>;
  loadNFTCollection: () => Promise<void>;
  refreshCollectionStats: () => Promise<void>;
  
  // Transaction management
  submitTransaction: (transaction: any) => Promise<TransactionResult>;
  checkTransactionStatus: (txId: string) => Promise<TransactionStatus>;
  
  // Collection management
  getNFTsByCharacter: (characterId: string) => NFTAsset[];
  getNFTsByRarity: (rarity: string) => NFTAsset[];
  exportCollection: () => any;
  
  // Error handling
  setError: (error: BlockchainError | null) => void;
  clearError: () => void;
  
  // Utilities
  formatAlgoAmount: (microAlgos: number) => string;
  validateAddress: (address: string) => boolean;
}

export const useBlockchainStore = create<BlockchainStoreState & BlockchainStoreActions>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    network: 'testnet',
    isConnected: false,
    walletConnection: null,
    account: null,
    nftCollection: [],
    collectionStats: null,
    pendingTransactions: new Map(),
    transactionHistory: [],
    isMinting: false,
    mintingQueue: [],
    lastMintResult: null,
    isLoading: false,
    error: null,
    appManagedWallet: {
      enabled: true, // Default to app-managed for children
      address: null,
      balance: 0,
    },

    // Actions
    setNetwork: (network) => {
      set({ network });
      console.log(`Network changed to: ${network}`);
    },

    connectWallet: async (provider = 'app_managed') => {
      set({ isLoading: true, error: null });
      
      try {
        if (provider === 'app_managed') {
          await get().createAppManagedWallet();
          return;
        }
        
        // For now, simulate wallet connection since we don't have real wallet integration
        console.log(`Connecting to ${provider} wallet...`);
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockWalletConnection: WalletConnection = {
          provider,
          address: 'MOCK7WALLET8ADDRESS9FOR0TESTING1PURPOSES2ONLY3ABCDEFGHIJKLMNOP',
          isConnected: true,
          connectedAt: Date.now(),
          lastActivity: Date.now(),
          capabilities: {
            signTransactions: true,
            signArbitraryData: false,
            multisig: false,
            atomicTransactions: true,
          },
          network: get().network,
          nodeUrl: DEFAULT_NETWORK_CONFIG[get().network].server,
          indexerUrl: DEFAULT_NETWORK_CONFIG[get().network].indexer,
        };
        
        const mockAccount: AlgorandAccount = {
          address: mockWalletConnection.address,
          balance: 5000000, // 5 ALGO in microAlgos
          minBalance: 100000, // 0.1 ALGO
          assets: [],
          createdAssets: [],
          status: 'online',
          rewardsBase: 0,
        };
        
        set({
          isConnected: true,
          walletConnection: mockWalletConnection,
          account: mockAccount,
          isLoading: false,
        });
        
        console.log(`Connected to ${provider} wallet: ${mockWalletConnection.address}`);
        
      } catch (error) {
        console.error('Wallet connection failed:', error);
        get().setError({
          code: 'WALLET_NOT_CONNECTED',
          message: 'Failed to connect wallet',
          timestamp: Date.now(),
          recoverable: true,
          suggestedAction: 'Try connecting again or use app-managed wallet',
          context: {
            network: get().network,
            operation: 'connect_wallet',
          },
        });
        set({ isLoading: false });
      }
    },

    disconnectWallet: () => {
      set({
        isConnected: false,
        walletConnection: null,
        account: null,
        nftCollection: [],
        collectionStats: null,
      });
      console.log('Wallet disconnected');
    },

    createAppManagedWallet: async () => {
      try {
        // Generate a mock app-managed wallet
        const mockAddress = 'APPMGD7WALLET8FOR9CHILD0USERS1ONLY2TESTING3ABCDEFGHIJKLMNOP';
        
        const appWallet = {
          enabled: true,
          address: mockAddress,
          balance: 1000000, // 1 ALGO for testing
        };
        
        const mockWalletConnection: WalletConnection = {
          provider: 'app_managed',
          address: mockAddress,
          isConnected: true,
          connectedAt: Date.now(),
          lastActivity: Date.now(),
          capabilities: {
            signTransactions: true,
            signArbitraryData: false,
            multisig: false,
            atomicTransactions: true,
          },
          network: get().network,
          nodeUrl: DEFAULT_NETWORK_CONFIG[get().network].server,
          indexerUrl: DEFAULT_NETWORK_CONFIG[get().network].indexer,
        };
        
        const mockAccount: AlgorandAccount = {
          address: mockAddress,
          balance: appWallet.balance,
          minBalance: 100000,
          assets: [],
          createdAssets: [],
          status: 'online',
          rewardsBase: 0,
        };
        
        set({
          appManagedWallet: appWallet,
          isConnected: true,
          walletConnection: mockWalletConnection,
          account: mockAccount,
          isLoading: false,
        });
        
        console.log('App-managed wallet created:', mockAddress);
        
      } catch (error) {
        console.error('Failed to create app-managed wallet:', error);
        get().setError({
          code: 'WALLET_NOT_CONNECTED',
          message: 'Failed to create app-managed wallet',
          timestamp: Date.now(),
          recoverable: true,
          suggestedAction: 'Try again',
          context: {
            network: get().network,
            operation: 'create_app_wallet',
          },
        });
      }
    },

    refreshAccount: async () => {
      const { walletConnection } = get();
      if (!walletConnection) return;
      
      try {
        // In a real implementation, this would fetch from Algorand API
        console.log('Refreshing account data...');
        
        // For now, just update the last activity
        set(state => ({
          walletConnection: state.walletConnection ? {
            ...state.walletConnection,
            lastActivity: Date.now(),
          } : null,
        }));
        
      } catch (error) {
        console.error('Failed to refresh account:', error);
      }
    },

    getBalance: async () => {
      const { account } = get();
      return account?.balance || 0;
    },

    mintStoryNFT: async (request) => {
      set({ isMinting: true, error: null });
      
      try {
        const { walletConnection } = get();
        if (!walletConnection) {
          throw new Error('No wallet connected');
        }
        
        console.log('Minting story NFT:', request.storyId);
        
        // Simulate minting process
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const mockAssetId = Math.floor(Math.random() * 1000000) + 100000;
        const mockTxId = `MOCK${Date.now()}TRANSACTION${mockAssetId}`;
        
        const mintResult: MintingResult = {
          success: true,
          assetId: mockAssetId,
          txId: mockTxId,
          ipfsHash: `QmMockIPFSHash${mockAssetId}`,
          details: {
            mintedAt: Date.now(),
            gasUsed: 1000, // microAlgos
            totalCost: 1000,
            metadata: {
              name: `Story: ${request.storyId}`,
              description: `Curmunchkins story completion NFT`,
              image: `https://ipfs.io/ipfs/QmMockIPFSHash${mockAssetId}`,
              properties: {
                character: request.characterId,
                attachment: request.attachmentType,
                storyId: request.storyId,
                rarity: 'common',
                sensoryStrategies: ['proprioceptive_input'],
                therapeuticGoals: ['self_regulation'],
                ageRange: '4-12',
                difficultyLevel: 'beginner',
                series: 'curmunchkins-v1',
                edition: 1,
                totalSupply: 1,
                unlockDate: request.completionData.completedAt,
                completionTime: request.completionData.duration,
                achievements: request.completionData.achievements,
                accessibilityFeatures: request.completionData.accessibilityUsed,
                languageSupport: ['en-US'],
              },
              attributes: [
                { trait_type: 'Character', value: request.characterId },
                { trait_type: 'Attachment', value: request.attachmentType },
                { trait_type: 'Rarity', value: 'common' },
                { trait_type: 'Completion Time', value: request.completionData.duration, display_type: 'number' },
              ],
              creator: {
                name: 'Curmunchkins Team',
                description: 'Therapeutic storytelling for neurodivergent children',
                image: 'https://curmunchkins.com/logo.png',
                external_url: 'https://curmunchkins.com',
              },
              collection: {
                name: 'Curmunchkins Story Collection',
                family: 'curmunchkins',
                description: 'NFTs representing completed therapeutic stories',
                image: 'https://curmunchkins.com/collection.png',
                external_url: 'https://curmunchkins.com/collection',
              },
            },
            recipient: walletConnection.address,
          },
        };
        
        // Add to collection
        const newNFT: NFTAsset = {
          assetId: mockAssetId,
          metadata: mintResult.details.metadata,
          owner: walletConnection.address,
          creator: 'CURMUNCHKINS_CREATOR_ADDRESS',
          mintedAt: Date.now(),
          onChain: {
            name: mintResult.details.metadata.name,
            unitName: 'CMBE',
            total: 1,
            decimals: 0,
            url: `https://ipfs.io/ipfs/${mintResult.ipfsHash}`,
            metadataHash: mintResult.ipfsHash || '',
            manager: 'CURMUNCHKINS_MANAGER_ADDRESS',
            reserve: 'CURMUNCHKINS_RESERVE_ADDRESS',
            freeze: 'CURMUNCHKINS_FREEZE_ADDRESS',
            clawback: 'CURMUNCHKINS_CLAWBACK_ADDRESS',
          },
          ipfs: {
            metadataHash: mintResult.ipfsHash || '',
            imageHash: `QmMockImageHash${mockAssetId}`,
            metadataUrl: `https://ipfs.io/ipfs/${mintResult.ipfsHash}`,
            imageUrl: mintResult.details.metadata.image,
          },
          verification: {
            verified: true,
            verifiedBy: 'curmunchkins-official',
            verificationDate: Date.now(),
            authenticity: 'genuine',
          },
        };
        
        set(state => ({
          nftCollection: [...state.nftCollection, newNFT],
          lastMintResult: mintResult,
          isMinting: false,
        }));
        
        console.log('NFT minted successfully:', mintResult);
        
        // Refresh collection stats
        await get().refreshCollectionStats();
        
        return mintResult;
        
      } catch (error) {
        console.error('NFT minting failed:', error);
        
        const failedResult: MintingResult = {
          success: false,
          error: error instanceof Error ? error.message : 'Minting failed',
          details: {
            mintedAt: Date.now(),
            gasUsed: 0,
            totalCost: 0,
            metadata: {
              name: '',
              description: '',
              image: '',
              properties: {
                character: request.characterId,
                attachment: request.attachmentType,
                storyId: request.storyId,
                rarity: 'common',
                sensoryStrategies: [],
                therapeuticGoals: [],
                ageRange: '',
                difficultyLevel: '',
                series: '',
                edition: 0,
                totalSupply: 0,
                unlockDate: 0,
                accessibilityFeatures: [],
                languageSupport: [],
              },
              attributes: [],
              creator: {
                name: '',
                description: '',
                image: '',
                external_url: '',
              },
              collection: {
                name: '',
                family: '',
                description: '',
                image: '',
                external_url: '',
              },
            },
            recipient: '',
          },
        };
        
        get().setError({
          code: 'MINTING_FAILED',
          message: 'Failed to mint NFT',
          timestamp: Date.now(),
          recoverable: true,
          suggestedAction: 'Try minting again',
          context: {
            walletAddress: get().walletConnection?.address,
            network: get().network,
            operation: 'mint_nft',
          },
        });
        
        set({ isMinting: false, lastMintResult: failedResult });
        return failedResult;
      }
    },

    loadNFTCollection: async () => {
      const { walletConnection } = get();
      if (!walletConnection) return;
      
      try {
        set({ isLoading: true });
        
        // In a real implementation, this would fetch from Algorand indexer
        console.log('Loading NFT collection...');
        
        // For now, keep existing collection
        set({ isLoading: false });
        
      } catch (error) {
        console.error('Failed to load NFT collection:', error);
        set({ isLoading: false });
      }
    },

    refreshCollectionStats: async () => {
      const { nftCollection, walletConnection } = get();
      if (!walletConnection) return;
      
      try {
        const stats: CollectionStats = {
          userId: walletConnection.address,
          totalNFTs: nftCollection.length,
          uniqueCharacters: [...new Set(nftCollection.map(nft => nft.metadata.properties.character))],
          uniqueAttachments: [...new Set(nftCollection.map(nft => nft.metadata.properties.attachment))],
          rarityDistribution: nftCollection.reduce((acc, nft) => {
            const rarity = nft.metadata.properties.rarity;
            acc[rarity] = (acc[rarity] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          milestones: {
            firstNFT: nftCollection.length > 0 ? nftCollection[0].mintedAt : 0,
            tenthNFT: nftCollection.length >= 10 ? nftCollection[9].mintedAt : 0,
            firstRare: 0,
            firstEpic: 0,
            firstLegendary: 0,
            completeCharacterSet: 0,
            completeAttachmentSet: 0,
          },
          estimatedValue: nftCollection.length * 0.1, // Mock value
          rarityScore: nftCollection.length * 10,
          collectionRank: Math.max(1, 1000 - nftCollection.length * 10),
          lastUpdated: Date.now(),
        };
        
        set({ collectionStats: stats });
        
      } catch (error) {
        console.error('Failed to refresh collection stats:', error);
      }
    },

    submitTransaction: async (transaction) => {
      const { walletConnection } = get();
      if (!walletConnection) {
        throw new Error('No wallet connected');
      }
      
      try {
        // Simulate transaction submission
        const txId = `MOCK${Date.now()}TX${Math.random().toString(36).substr(2, 9)}`;
        
        const result: TransactionResult = {
          txId,
          status: 'pending',
          fee: 1000,
          timestamp: Date.now(),
          details: {
            sender: walletConnection.address,
            type: 'asset_create',
          },
        };
        
        // Add to pending transactions
        set(state => {
          const newPending = new Map(state.pendingTransactions);
          newPending.set(txId, result);
          return { pendingTransactions: newPending };
        });
        
        // Simulate confirmation after 5 seconds
        setTimeout(() => {
          const confirmedResult: TransactionResult = {
            ...result,
            status: 'confirmed',
            confirmedRound: 12345678,
          };
          
          set(state => {
            const newPending = new Map(state.pendingTransactions);
            newPending.delete(txId);
            return {
              pendingTransactions: newPending,
              transactionHistory: [...state.transactionHistory, confirmedResult],
            };
          });
        }, 5000);
        
        return result;
        
      } catch (error) {
        console.error('Transaction submission failed:', error);
        throw error;
      }
    },

    checkTransactionStatus: async (txId) => {
      const { pendingTransactions, transactionHistory } = get();
      
      // Check pending transactions
      const pending = pendingTransactions.get(txId);
      if (pending) {
        return pending.status;
      }
      
      // Check transaction history
      const historical = transactionHistory.find(tx => tx.txId === txId);
      if (historical) {
        return historical.status;
      }
      
      return 'failed';
    },

    getNFTsByCharacter: (characterId) => {
      return get().nftCollection.filter(nft => 
        nft.metadata.properties.character === characterId
      );
    },

    getNFTsByRarity: (rarity) => {
      return get().nftCollection.filter(nft => 
        nft.metadata.properties.rarity === rarity
      );
    },

    exportCollection: () => {
      const { nftCollection, collectionStats, walletConnection } = get();
      
      return {
        wallet: walletConnection?.address,
        network: get().network,
        collection: nftCollection,
        stats: collectionStats,
        exportedAt: Date.now(),
      };
    },

    setError: (error) => {
      set({ error });
    },

    clearError: () => {
      set({ error: null });
    },

    formatAlgoAmount: (microAlgos) => {
      const algos = microAlgos / 1000000;
      return `${algos.toFixed(6)} ALGO`;
    },

    validateAddress: (address) => {
      // Basic Algorand address validation
      return address.length === 58 && /^[A-Z2-7]+$/.test(address);
    },
  }))
);

// Auto-refresh account data periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    const { isConnected, refreshAccount } = useBlockchainStore.getState();
    if (isConnected) {
      refreshAccount();
    }
  }, 30000); // Every 30 seconds
}