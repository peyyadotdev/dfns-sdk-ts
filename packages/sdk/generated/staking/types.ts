export type CreateStakeBody = {
    kind: "Native";
    amount: string;
    walletId: string;
    provider: "Figment";
    protocol: "Babylon";
    duration: number;
};

export type CreateStakeResponse = {
    stake: {
        id: string;
        provider: "Figment";
        providerStakeId: string;
        walletId: string;
        protocol: "Babylon";
        status: "Active" | "Withdrawn";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            kind: "Native";
            amount: string;
            walletId: string;
            provider: "Figment";
            protocol: "Babylon";
            duration: number;
        };
        dateCreated: string;
    };
    stakeAction: {
        id: string;
        stakeId: string;
        transactionId?: string | undefined;
        kind: "Stake" | "Unbond" | "UnbondWithdrawal" | "StakeWithdrawal";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: ({
            kind: "Native";
            amount: string;
            walletId: string;
            provider: "Figment";
            protocol: "Babylon";
            duration: number;
        }) | {
            protocol: "Babylon";
            kind: "StakeWithdrawal";
        };
        dateCreated: string;
    };
};

export type CreateStakeRequest = { body: CreateStakeBody }

export type CreateStakeActionBody = {
    protocol: "Babylon";
    kind: "StakeWithdrawal";
};

export type CreateStakeActionResponse = {
    stake: {
        id: string;
        provider: "Figment";
        providerStakeId: string;
        walletId: string;
        protocol: "Babylon";
        status: "Active" | "Withdrawn";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            kind: "Native";
            amount: string;
            walletId: string;
            provider: "Figment";
            protocol: "Babylon";
            duration: number;
        };
        dateCreated: string;
    };
    stakeAction: {
        id: string;
        stakeId: string;
        transactionId?: string | undefined;
        kind: "Stake" | "Unbond" | "UnbondWithdrawal" | "StakeWithdrawal";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: ({
            kind: "Native";
            amount: string;
            walletId: string;
            provider: "Figment";
            protocol: "Babylon";
            duration: number;
        }) | {
            protocol: "Babylon";
            kind: "StakeWithdrawal";
        };
        dateCreated: string;
    };
};

export type CreateStakeActionRequest = { body: CreateStakeActionBody }

export type ListStakeActionsQuery = {
    limit?: number | undefined;
    paginationToken?: string | undefined;
};

export type ListStakeActionsResponse = {
    items: {
        id: string;
        stakeId: string;
        transactionId?: string | undefined;
        kind: "Stake" | "Unbond" | "UnbondWithdrawal" | "StakeWithdrawal";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: ({
            kind: "Native";
            amount: string;
            walletId: string;
            provider: "Figment";
            protocol: "Babylon";
            duration: number;
        }) | {
            protocol: "Babylon";
            kind: "StakeWithdrawal";
        };
        dateCreated: string;
    }[];
    nextPageToken?: string | undefined;
};

export type ListStakeActionsRequest = { query?: ListStakeActionsQuery }

export type ListStakesQuery = {
    limit?: number | undefined;
    paginationToken?: string | undefined;
};

export type ListStakesResponse = {
    items: {
        id: string;
        provider: "Figment";
        providerStakeId: string;
        walletId: string;
        protocol: "Babylon";
        status: "Active" | "Withdrawn";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            kind: "Native";
            amount: string;
            walletId: string;
            provider: "Figment";
            protocol: "Babylon";
            duration: number;
        };
        dateCreated: string;
    }[];
    nextPageToken?: string | undefined;
};

export type ListStakesRequest = { query?: ListStakesQuery }

