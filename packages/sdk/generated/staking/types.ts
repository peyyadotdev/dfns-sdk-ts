export type CreateStakeBody = {
    kind: "Native";
    amount: string;
    priority?: ("Slow" | "Standard" | "Fast") | undefined;
    createDestinationAccount?: boolean | undefined;
    externalId?: string | undefined;
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
        status: "Active";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            kind: "Native";
            amount: string;
            priority?: ("Slow" | "Standard" | "Fast") | undefined;
            createDestinationAccount?: boolean | undefined;
            externalId?: string | undefined;
            walletId: string;
            provider: "Figment";
            protocol: "Babylon";
            duration: number;
        };
        dateCreated: string;
    };
    stakeTransaction: {
        id: string;
        stakeId: string;
        transactionId?: string | undefined;
        kind: "Stake" | "Unbond" | "UnbondWithdrawal" | "Withdraw";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            kind: "Native";
            amount: string;
            priority?: ("Slow" | "Standard" | "Fast") | undefined;
            createDestinationAccount?: boolean | undefined;
            externalId?: string | undefined;
            walletId: string;
            provider: "Figment";
            protocol: "Babylon";
            duration: number;
        };
        dateCreated: string;
    };
};

export type CreateStakeRequest = { body: CreateStakeBody }

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
        status: "Active";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            kind: "Native";
            amount: string;
            priority?: ("Slow" | "Standard" | "Fast") | undefined;
            createDestinationAccount?: boolean | undefined;
            externalId?: string | undefined;
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

