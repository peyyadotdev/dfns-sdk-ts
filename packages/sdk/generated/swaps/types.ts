export type CreateSwapBody = {
    sourceWalletId: string;
    quoteId: string;
    reference?: string | undefined;
};

export type CreateSwapResponse = {
    id: string;
    quoteId: string;
    reference: string | null;
    sourceWalletId: string;
    targetWalletId: string;
    status: "PendingPolicyApproval" | "InProgress" | "Completed" | "Failed" | "Rejected";
    provider: "UniswapX" | "UniswapClassic";
    quotedSourceAsset: ({
        kind: "Native";
        amount: string;
    } | {
        kind: "Erc20";
        contract: string;
        amount: string;
    }) & {
        metadata: {
            network: "Algorand" | "AlgorandTestnet" | "Aptos" | "AptosTestnet" | "ArbitrumOne" | "ArbitrumGoerli" | "ArbitrumSepolia" | "AvalancheC" | "AvalancheCFuji" | "Adi" | "AdiTestnet" | "BabylonGenesis" | "BabylonTestnet5" | "Base" | "BaseGoerli" | "BaseSepolia" | "Berachain" | "BerachainBArtio" | "BerachainBepolia" | "Bitcoin" | "BitcoinSignet" | "BitcoinTestnet3" | "BitcoinCash" | "BitcoinCashTestnet" | "Bob" | "BobSepolia" | "Bsc" | "BscTestnet" | "Canton" | "CantonDevnet" | "CantonTestnet" | "Cardano" | "CardanoPreprod" | "Celo" | "CeloAlfajores" | "Codex" | "CodexSepolia" | "CosmosHub4" | "CosmosIcsTestnet" | "Dogecoin" | "DogecoinTestnet" | "Ethereum" | "EthereumGoerli" | "EthereumSepolia" | "EthereumHolesky" | "EthereumHoodi" | "FantomOpera" | "FantomTestnet" | "FlareC" | "FlareCCoston2" | "Hedera" | "HederaTestnet" | "InternetComputer" | "Ion" | "IonTestnet" | "Iota" | "IotaTestnet" | "IotaZodianet" | "Kaspa" | "KaspaTestnet11" | "Kusama" | "Litecoin" | "LitecoinTestnet" | "Near" | "NearTestnet" | "Optimism" | "OptimismGoerli" | "OptimismSepolia" | "Origyn" | "Plume" | "PlumeSepolia" | "Polkadot" | "Polygon" | "PolygonAmoy" | "PolygonMumbai" | "Polymesh" | "PolymeshTestnet" | "Race" | "RaceSepolia" | "SeiAtlantic2" | "SeiPacific1" | "Solana" | "SolanaDevnet" | "Stellar" | "StellarTestnet" | "Sui" | "SuiTestnet" | "Tezos" | "TezosGhostnet" | "Ton" | "TonTestnet" | "Tron" | "TronNile" | "Westend" | "XrpLedger" | "XrpLedgerTestnet";
            name: string;
            symbol: string;
            decimals: number;
            tid?: string | undefined;
        };
    };
    quotedTargetAsset: ({
        kind: "Native";
        amount: string;
    } | {
        kind: "Erc20";
        contract: string;
        amount: string;
    }) & {
        metadata: {
            network: "Algorand" | "AlgorandTestnet" | "Aptos" | "AptosTestnet" | "ArbitrumOne" | "ArbitrumGoerli" | "ArbitrumSepolia" | "AvalancheC" | "AvalancheCFuji" | "Adi" | "AdiTestnet" | "BabylonGenesis" | "BabylonTestnet5" | "Base" | "BaseGoerli" | "BaseSepolia" | "Berachain" | "BerachainBArtio" | "BerachainBepolia" | "Bitcoin" | "BitcoinSignet" | "BitcoinTestnet3" | "BitcoinCash" | "BitcoinCashTestnet" | "Bob" | "BobSepolia" | "Bsc" | "BscTestnet" | "Canton" | "CantonDevnet" | "CantonTestnet" | "Cardano" | "CardanoPreprod" | "Celo" | "CeloAlfajores" | "Codex" | "CodexSepolia" | "CosmosHub4" | "CosmosIcsTestnet" | "Dogecoin" | "DogecoinTestnet" | "Ethereum" | "EthereumGoerli" | "EthereumSepolia" | "EthereumHolesky" | "EthereumHoodi" | "FantomOpera" | "FantomTestnet" | "FlareC" | "FlareCCoston2" | "Hedera" | "HederaTestnet" | "InternetComputer" | "Ion" | "IonTestnet" | "Iota" | "IotaTestnet" | "IotaZodianet" | "Kaspa" | "KaspaTestnet11" | "Kusama" | "Litecoin" | "LitecoinTestnet" | "Near" | "NearTestnet" | "Optimism" | "OptimismGoerli" | "OptimismSepolia" | "Origyn" | "Plume" | "PlumeSepolia" | "Polkadot" | "Polygon" | "PolygonAmoy" | "PolygonMumbai" | "Polymesh" | "PolymeshTestnet" | "Race" | "RaceSepolia" | "SeiAtlantic2" | "SeiPacific1" | "Solana" | "SolanaDevnet" | "Stellar" | "StellarTestnet" | "Sui" | "SuiTestnet" | "Tezos" | "TezosGhostnet" | "Ton" | "TonTestnet" | "Tron" | "TronNile" | "Westend" | "XrpLedger" | "XrpLedgerTestnet";
            name: string;
            symbol: string;
            decimals: number;
            tid?: string | undefined;
        };
    };
    slippageToleranceInBps: number;
    dateCreated: string;
    requestBody: {
        sourceWalletId: string;
        quoteId: string;
        reference?: string | undefined;
    };
    requester: {
        userId: string;
        tokenId?: string | undefined;
    };
};

export type CreateSwapRequest = { body: CreateSwapBody }

export type CreateSwapQuoteBody = {
    provider: "UniswapX" | "UniswapClassic";
    sourceWalletId: string;
    targetWalletId: string;
    sourceAsset: {
        kind: "Native";
        amount: string;
    } | {
        kind: "Erc20";
        contract: string;
        amount: string;
    };
    targetAsset: {
        kind: "Native";
    } | {
        kind: "Erc20";
        contract: string;
    };
    slippageToleranceInBps: number;
};

export type CreateSwapQuoteResponse = {
    id: string;
    sourceWalletId: string;
    targetWalletId: string;
    provider: "UniswapX" | "UniswapClassic";
    sourceAsset: ({
        kind: "Native";
        amount: string;
    } | {
        kind: "Erc20";
        contract: string;
        amount: string;
    }) & {
        metadata: {
            network: "Algorand" | "AlgorandTestnet" | "Aptos" | "AptosTestnet" | "ArbitrumOne" | "ArbitrumGoerli" | "ArbitrumSepolia" | "AvalancheC" | "AvalancheCFuji" | "Adi" | "AdiTestnet" | "BabylonGenesis" | "BabylonTestnet5" | "Base" | "BaseGoerli" | "BaseSepolia" | "Berachain" | "BerachainBArtio" | "BerachainBepolia" | "Bitcoin" | "BitcoinSignet" | "BitcoinTestnet3" | "BitcoinCash" | "BitcoinCashTestnet" | "Bob" | "BobSepolia" | "Bsc" | "BscTestnet" | "Canton" | "CantonDevnet" | "CantonTestnet" | "Cardano" | "CardanoPreprod" | "Celo" | "CeloAlfajores" | "Codex" | "CodexSepolia" | "CosmosHub4" | "CosmosIcsTestnet" | "Dogecoin" | "DogecoinTestnet" | "Ethereum" | "EthereumGoerli" | "EthereumSepolia" | "EthereumHolesky" | "EthereumHoodi" | "FantomOpera" | "FantomTestnet" | "FlareC" | "FlareCCoston2" | "Hedera" | "HederaTestnet" | "InternetComputer" | "Ion" | "IonTestnet" | "Iota" | "IotaTestnet" | "IotaZodianet" | "Kaspa" | "KaspaTestnet11" | "Kusama" | "Litecoin" | "LitecoinTestnet" | "Near" | "NearTestnet" | "Optimism" | "OptimismGoerli" | "OptimismSepolia" | "Origyn" | "Plume" | "PlumeSepolia" | "Polkadot" | "Polygon" | "PolygonAmoy" | "PolygonMumbai" | "Polymesh" | "PolymeshTestnet" | "Race" | "RaceSepolia" | "SeiAtlantic2" | "SeiPacific1" | "Solana" | "SolanaDevnet" | "Stellar" | "StellarTestnet" | "Sui" | "SuiTestnet" | "Tezos" | "TezosGhostnet" | "Ton" | "TonTestnet" | "Tron" | "TronNile" | "Westend" | "XrpLedger" | "XrpLedgerTestnet";
            name: string;
            symbol: string;
            decimals: number;
            tid?: string | undefined;
        };
    };
    targetAsset: ({
        kind: "Native";
        amount: string;
    } | {
        kind: "Erc20";
        contract: string;
        amount: string;
    }) & {
        metadata: {
            network: "Algorand" | "AlgorandTestnet" | "Aptos" | "AptosTestnet" | "ArbitrumOne" | "ArbitrumGoerli" | "ArbitrumSepolia" | "AvalancheC" | "AvalancheCFuji" | "Adi" | "AdiTestnet" | "BabylonGenesis" | "BabylonTestnet5" | "Base" | "BaseGoerli" | "BaseSepolia" | "Berachain" | "BerachainBArtio" | "BerachainBepolia" | "Bitcoin" | "BitcoinSignet" | "BitcoinTestnet3" | "BitcoinCash" | "BitcoinCashTestnet" | "Bob" | "BobSepolia" | "Bsc" | "BscTestnet" | "Canton" | "CantonDevnet" | "CantonTestnet" | "Cardano" | "CardanoPreprod" | "Celo" | "CeloAlfajores" | "Codex" | "CodexSepolia" | "CosmosHub4" | "CosmosIcsTestnet" | "Dogecoin" | "DogecoinTestnet" | "Ethereum" | "EthereumGoerli" | "EthereumSepolia" | "EthereumHolesky" | "EthereumHoodi" | "FantomOpera" | "FantomTestnet" | "FlareC" | "FlareCCoston2" | "Hedera" | "HederaTestnet" | "InternetComputer" | "Ion" | "IonTestnet" | "Iota" | "IotaTestnet" | "IotaZodianet" | "Kaspa" | "KaspaTestnet11" | "Kusama" | "Litecoin" | "LitecoinTestnet" | "Near" | "NearTestnet" | "Optimism" | "OptimismGoerli" | "OptimismSepolia" | "Origyn" | "Plume" | "PlumeSepolia" | "Polkadot" | "Polygon" | "PolygonAmoy" | "PolygonMumbai" | "Polymesh" | "PolymeshTestnet" | "Race" | "RaceSepolia" | "SeiAtlantic2" | "SeiPacific1" | "Solana" | "SolanaDevnet" | "Stellar" | "StellarTestnet" | "Sui" | "SuiTestnet" | "Tezos" | "TezosGhostnet" | "Ton" | "TonTestnet" | "Tron" | "TronNile" | "Westend" | "XrpLedger" | "XrpLedgerTestnet";
            name: string;
            symbol: string;
            decimals: number;
            tid?: string | undefined;
        };
    };
    slippageToleranceInBps: number;
    dateCreated: string;
    requestBody: {
        provider: "UniswapX" | "UniswapClassic";
        sourceWalletId: string;
        targetWalletId: string;
        sourceAsset: {
            kind: "Native";
            amount: string;
        } | {
            kind: "Erc20";
            contract: string;
            amount: string;
        };
        targetAsset: {
            kind: "Native";
        } | {
            kind: "Erc20";
            contract: string;
        };
        slippageToleranceInBps: number;
    };
    requester: {
        userId: string;
        tokenId?: string | undefined;
    };
};

export type CreateSwapQuoteRequest = { body: CreateSwapQuoteBody }

export type GetSwapParams = {
    swapId: string;
};

export type GetSwapResponse = {
    id: string;
    quoteId: string;
    reference: string | null;
    sourceWalletId: string;
    targetWalletId: string;
    status: "PendingPolicyApproval" | "InProgress" | "Completed" | "Failed" | "Rejected";
    provider: "UniswapX" | "UniswapClassic";
    quotedSourceAsset: ({
        kind: "Native";
        amount: string;
    } | {
        kind: "Erc20";
        contract: string;
        amount: string;
    }) & {
        metadata: {
            network: "Algorand" | "AlgorandTestnet" | "Aptos" | "AptosTestnet" | "ArbitrumOne" | "ArbitrumGoerli" | "ArbitrumSepolia" | "AvalancheC" | "AvalancheCFuji" | "Adi" | "AdiTestnet" | "BabylonGenesis" | "BabylonTestnet5" | "Base" | "BaseGoerli" | "BaseSepolia" | "Berachain" | "BerachainBArtio" | "BerachainBepolia" | "Bitcoin" | "BitcoinSignet" | "BitcoinTestnet3" | "BitcoinCash" | "BitcoinCashTestnet" | "Bob" | "BobSepolia" | "Bsc" | "BscTestnet" | "Canton" | "CantonDevnet" | "CantonTestnet" | "Cardano" | "CardanoPreprod" | "Celo" | "CeloAlfajores" | "Codex" | "CodexSepolia" | "CosmosHub4" | "CosmosIcsTestnet" | "Dogecoin" | "DogecoinTestnet" | "Ethereum" | "EthereumGoerli" | "EthereumSepolia" | "EthereumHolesky" | "EthereumHoodi" | "FantomOpera" | "FantomTestnet" | "FlareC" | "FlareCCoston2" | "Hedera" | "HederaTestnet" | "InternetComputer" | "Ion" | "IonTestnet" | "Iota" | "IotaTestnet" | "IotaZodianet" | "Kaspa" | "KaspaTestnet11" | "Kusama" | "Litecoin" | "LitecoinTestnet" | "Near" | "NearTestnet" | "Optimism" | "OptimismGoerli" | "OptimismSepolia" | "Origyn" | "Plume" | "PlumeSepolia" | "Polkadot" | "Polygon" | "PolygonAmoy" | "PolygonMumbai" | "Polymesh" | "PolymeshTestnet" | "Race" | "RaceSepolia" | "SeiAtlantic2" | "SeiPacific1" | "Solana" | "SolanaDevnet" | "Stellar" | "StellarTestnet" | "Sui" | "SuiTestnet" | "Tezos" | "TezosGhostnet" | "Ton" | "TonTestnet" | "Tron" | "TronNile" | "Westend" | "XrpLedger" | "XrpLedgerTestnet";
            name: string;
            symbol: string;
            decimals: number;
            tid?: string | undefined;
        };
    };
    quotedTargetAsset: ({
        kind: "Native";
        amount: string;
    } | {
        kind: "Erc20";
        contract: string;
        amount: string;
    }) & {
        metadata: {
            network: "Algorand" | "AlgorandTestnet" | "Aptos" | "AptosTestnet" | "ArbitrumOne" | "ArbitrumGoerli" | "ArbitrumSepolia" | "AvalancheC" | "AvalancheCFuji" | "Adi" | "AdiTestnet" | "BabylonGenesis" | "BabylonTestnet5" | "Base" | "BaseGoerli" | "BaseSepolia" | "Berachain" | "BerachainBArtio" | "BerachainBepolia" | "Bitcoin" | "BitcoinSignet" | "BitcoinTestnet3" | "BitcoinCash" | "BitcoinCashTestnet" | "Bob" | "BobSepolia" | "Bsc" | "BscTestnet" | "Canton" | "CantonDevnet" | "CantonTestnet" | "Cardano" | "CardanoPreprod" | "Celo" | "CeloAlfajores" | "Codex" | "CodexSepolia" | "CosmosHub4" | "CosmosIcsTestnet" | "Dogecoin" | "DogecoinTestnet" | "Ethereum" | "EthereumGoerli" | "EthereumSepolia" | "EthereumHolesky" | "EthereumHoodi" | "FantomOpera" | "FantomTestnet" | "FlareC" | "FlareCCoston2" | "Hedera" | "HederaTestnet" | "InternetComputer" | "Ion" | "IonTestnet" | "Iota" | "IotaTestnet" | "IotaZodianet" | "Kaspa" | "KaspaTestnet11" | "Kusama" | "Litecoin" | "LitecoinTestnet" | "Near" | "NearTestnet" | "Optimism" | "OptimismGoerli" | "OptimismSepolia" | "Origyn" | "Plume" | "PlumeSepolia" | "Polkadot" | "Polygon" | "PolygonAmoy" | "PolygonMumbai" | "Polymesh" | "PolymeshTestnet" | "Race" | "RaceSepolia" | "SeiAtlantic2" | "SeiPacific1" | "Solana" | "SolanaDevnet" | "Stellar" | "StellarTestnet" | "Sui" | "SuiTestnet" | "Tezos" | "TezosGhostnet" | "Ton" | "TonTestnet" | "Tron" | "TronNile" | "Westend" | "XrpLedger" | "XrpLedgerTestnet";
            name: string;
            symbol: string;
            decimals: number;
            tid?: string | undefined;
        };
    };
    slippageToleranceInBps: number;
    dateCreated: string;
    requestBody: {
        sourceWalletId: string;
        quoteId: string;
        reference?: string | undefined;
    };
    requester: {
        userId: string;
        tokenId?: string | undefined;
    };
};

export type GetSwapRequest = GetSwapParams

export type GetSwapQuoteParams = {
    quoteId: string;
};

export type GetSwapQuoteResponse = {
    id: string;
    sourceWalletId: string;
    targetWalletId: string;
    provider: "UniswapX" | "UniswapClassic";
    sourceAsset: ({
        kind: "Native";
        amount: string;
    } | {
        kind: "Erc20";
        contract: string;
        amount: string;
    }) & {
        metadata: {
            network: "Algorand" | "AlgorandTestnet" | "Aptos" | "AptosTestnet" | "ArbitrumOne" | "ArbitrumGoerli" | "ArbitrumSepolia" | "AvalancheC" | "AvalancheCFuji" | "Adi" | "AdiTestnet" | "BabylonGenesis" | "BabylonTestnet5" | "Base" | "BaseGoerli" | "BaseSepolia" | "Berachain" | "BerachainBArtio" | "BerachainBepolia" | "Bitcoin" | "BitcoinSignet" | "BitcoinTestnet3" | "BitcoinCash" | "BitcoinCashTestnet" | "Bob" | "BobSepolia" | "Bsc" | "BscTestnet" | "Canton" | "CantonDevnet" | "CantonTestnet" | "Cardano" | "CardanoPreprod" | "Celo" | "CeloAlfajores" | "Codex" | "CodexSepolia" | "CosmosHub4" | "CosmosIcsTestnet" | "Dogecoin" | "DogecoinTestnet" | "Ethereum" | "EthereumGoerli" | "EthereumSepolia" | "EthereumHolesky" | "EthereumHoodi" | "FantomOpera" | "FantomTestnet" | "FlareC" | "FlareCCoston2" | "Hedera" | "HederaTestnet" | "InternetComputer" | "Ion" | "IonTestnet" | "Iota" | "IotaTestnet" | "IotaZodianet" | "Kaspa" | "KaspaTestnet11" | "Kusama" | "Litecoin" | "LitecoinTestnet" | "Near" | "NearTestnet" | "Optimism" | "OptimismGoerli" | "OptimismSepolia" | "Origyn" | "Plume" | "PlumeSepolia" | "Polkadot" | "Polygon" | "PolygonAmoy" | "PolygonMumbai" | "Polymesh" | "PolymeshTestnet" | "Race" | "RaceSepolia" | "SeiAtlantic2" | "SeiPacific1" | "Solana" | "SolanaDevnet" | "Stellar" | "StellarTestnet" | "Sui" | "SuiTestnet" | "Tezos" | "TezosGhostnet" | "Ton" | "TonTestnet" | "Tron" | "TronNile" | "Westend" | "XrpLedger" | "XrpLedgerTestnet";
            name: string;
            symbol: string;
            decimals: number;
            tid?: string | undefined;
        };
    };
    targetAsset: ({
        kind: "Native";
        amount: string;
    } | {
        kind: "Erc20";
        contract: string;
        amount: string;
    }) & {
        metadata: {
            network: "Algorand" | "AlgorandTestnet" | "Aptos" | "AptosTestnet" | "ArbitrumOne" | "ArbitrumGoerli" | "ArbitrumSepolia" | "AvalancheC" | "AvalancheCFuji" | "Adi" | "AdiTestnet" | "BabylonGenesis" | "BabylonTestnet5" | "Base" | "BaseGoerli" | "BaseSepolia" | "Berachain" | "BerachainBArtio" | "BerachainBepolia" | "Bitcoin" | "BitcoinSignet" | "BitcoinTestnet3" | "BitcoinCash" | "BitcoinCashTestnet" | "Bob" | "BobSepolia" | "Bsc" | "BscTestnet" | "Canton" | "CantonDevnet" | "CantonTestnet" | "Cardano" | "CardanoPreprod" | "Celo" | "CeloAlfajores" | "Codex" | "CodexSepolia" | "CosmosHub4" | "CosmosIcsTestnet" | "Dogecoin" | "DogecoinTestnet" | "Ethereum" | "EthereumGoerli" | "EthereumSepolia" | "EthereumHolesky" | "EthereumHoodi" | "FantomOpera" | "FantomTestnet" | "FlareC" | "FlareCCoston2" | "Hedera" | "HederaTestnet" | "InternetComputer" | "Ion" | "IonTestnet" | "Iota" | "IotaTestnet" | "IotaZodianet" | "Kaspa" | "KaspaTestnet11" | "Kusama" | "Litecoin" | "LitecoinTestnet" | "Near" | "NearTestnet" | "Optimism" | "OptimismGoerli" | "OptimismSepolia" | "Origyn" | "Plume" | "PlumeSepolia" | "Polkadot" | "Polygon" | "PolygonAmoy" | "PolygonMumbai" | "Polymesh" | "PolymeshTestnet" | "Race" | "RaceSepolia" | "SeiAtlantic2" | "SeiPacific1" | "Solana" | "SolanaDevnet" | "Stellar" | "StellarTestnet" | "Sui" | "SuiTestnet" | "Tezos" | "TezosGhostnet" | "Ton" | "TonTestnet" | "Tron" | "TronNile" | "Westend" | "XrpLedger" | "XrpLedgerTestnet";
            name: string;
            symbol: string;
            decimals: number;
            tid?: string | undefined;
        };
    };
    slippageToleranceInBps: number;
    dateCreated: string;
    requestBody: {
        provider: "UniswapX" | "UniswapClassic";
        sourceWalletId: string;
        targetWalletId: string;
        sourceAsset: {
            kind: "Native";
            amount: string;
        } | {
            kind: "Erc20";
            contract: string;
            amount: string;
        };
        targetAsset: {
            kind: "Native";
        } | {
            kind: "Erc20";
            contract: string;
        };
        slippageToleranceInBps: number;
    };
    requester: {
        userId: string;
        tokenId?: string | undefined;
    };
};

export type GetSwapQuoteRequest = GetSwapQuoteParams

export type ListSwapsQuery = {
    limit?: number | undefined;
    paginationToken?: string | undefined;
};

export type ListSwapsResponse = {
    items: {
        id: string;
        quoteId: string;
        reference: string | null;
        sourceWalletId: string;
        targetWalletId: string;
        status: "PendingPolicyApproval" | "InProgress" | "Completed" | "Failed" | "Rejected";
        provider: "UniswapX" | "UniswapClassic";
        quotedSourceAsset: ({
            kind: "Native";
            amount: string;
        } | {
            kind: "Erc20";
            contract: string;
            amount: string;
        }) & {
            metadata: {
                network: "Algorand" | "AlgorandTestnet" | "Aptos" | "AptosTestnet" | "ArbitrumOne" | "ArbitrumGoerli" | "ArbitrumSepolia" | "AvalancheC" | "AvalancheCFuji" | "Adi" | "AdiTestnet" | "BabylonGenesis" | "BabylonTestnet5" | "Base" | "BaseGoerli" | "BaseSepolia" | "Berachain" | "BerachainBArtio" | "BerachainBepolia" | "Bitcoin" | "BitcoinSignet" | "BitcoinTestnet3" | "BitcoinCash" | "BitcoinCashTestnet" | "Bob" | "BobSepolia" | "Bsc" | "BscTestnet" | "Canton" | "CantonDevnet" | "CantonTestnet" | "Cardano" | "CardanoPreprod" | "Celo" | "CeloAlfajores" | "Codex" | "CodexSepolia" | "CosmosHub4" | "CosmosIcsTestnet" | "Dogecoin" | "DogecoinTestnet" | "Ethereum" | "EthereumGoerli" | "EthereumSepolia" | "EthereumHolesky" | "EthereumHoodi" | "FantomOpera" | "FantomTestnet" | "FlareC" | "FlareCCoston2" | "Hedera" | "HederaTestnet" | "InternetComputer" | "Ion" | "IonTestnet" | "Iota" | "IotaTestnet" | "IotaZodianet" | "Kaspa" | "KaspaTestnet11" | "Kusama" | "Litecoin" | "LitecoinTestnet" | "Near" | "NearTestnet" | "Optimism" | "OptimismGoerli" | "OptimismSepolia" | "Origyn" | "Plume" | "PlumeSepolia" | "Polkadot" | "Polygon" | "PolygonAmoy" | "PolygonMumbai" | "Polymesh" | "PolymeshTestnet" | "Race" | "RaceSepolia" | "SeiAtlantic2" | "SeiPacific1" | "Solana" | "SolanaDevnet" | "Stellar" | "StellarTestnet" | "Sui" | "SuiTestnet" | "Tezos" | "TezosGhostnet" | "Ton" | "TonTestnet" | "Tron" | "TronNile" | "Westend" | "XrpLedger" | "XrpLedgerTestnet";
                name: string;
                symbol: string;
                decimals: number;
                tid?: string | undefined;
            };
        };
        quotedTargetAsset: ({
            kind: "Native";
            amount: string;
        } | {
            kind: "Erc20";
            contract: string;
            amount: string;
        }) & {
            metadata: {
                network: "Algorand" | "AlgorandTestnet" | "Aptos" | "AptosTestnet" | "ArbitrumOne" | "ArbitrumGoerli" | "ArbitrumSepolia" | "AvalancheC" | "AvalancheCFuji" | "Adi" | "AdiTestnet" | "BabylonGenesis" | "BabylonTestnet5" | "Base" | "BaseGoerli" | "BaseSepolia" | "Berachain" | "BerachainBArtio" | "BerachainBepolia" | "Bitcoin" | "BitcoinSignet" | "BitcoinTestnet3" | "BitcoinCash" | "BitcoinCashTestnet" | "Bob" | "BobSepolia" | "Bsc" | "BscTestnet" | "Canton" | "CantonDevnet" | "CantonTestnet" | "Cardano" | "CardanoPreprod" | "Celo" | "CeloAlfajores" | "Codex" | "CodexSepolia" | "CosmosHub4" | "CosmosIcsTestnet" | "Dogecoin" | "DogecoinTestnet" | "Ethereum" | "EthereumGoerli" | "EthereumSepolia" | "EthereumHolesky" | "EthereumHoodi" | "FantomOpera" | "FantomTestnet" | "FlareC" | "FlareCCoston2" | "Hedera" | "HederaTestnet" | "InternetComputer" | "Ion" | "IonTestnet" | "Iota" | "IotaTestnet" | "IotaZodianet" | "Kaspa" | "KaspaTestnet11" | "Kusama" | "Litecoin" | "LitecoinTestnet" | "Near" | "NearTestnet" | "Optimism" | "OptimismGoerli" | "OptimismSepolia" | "Origyn" | "Plume" | "PlumeSepolia" | "Polkadot" | "Polygon" | "PolygonAmoy" | "PolygonMumbai" | "Polymesh" | "PolymeshTestnet" | "Race" | "RaceSepolia" | "SeiAtlantic2" | "SeiPacific1" | "Solana" | "SolanaDevnet" | "Stellar" | "StellarTestnet" | "Sui" | "SuiTestnet" | "Tezos" | "TezosGhostnet" | "Ton" | "TonTestnet" | "Tron" | "TronNile" | "Westend" | "XrpLedger" | "XrpLedgerTestnet";
                name: string;
                symbol: string;
                decimals: number;
                tid?: string | undefined;
            };
        };
        slippageToleranceInBps: number;
        dateCreated: string;
        requestBody: {
            sourceWalletId: string;
            quoteId: string;
            reference?: string | undefined;
        };
        requester: {
            userId: string;
            tokenId?: string | undefined;
        };
    }[];
    nextPageToken?: string | undefined;
};

export type ListSwapsRequest = { query?: ListSwapsQuery }

