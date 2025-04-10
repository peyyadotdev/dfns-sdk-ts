export type CreateStakeBody = {
    protocol: "Babylon";
    walletId: string;
    provider: "Figment";
    amount: string;
    duration: number;
} | {
    protocol: "Ethereum";
    walletId: string;
    provider: "Figment";
    amount: string;
} | {
    protocol: "Iota";
    walletId: string;
    validator: string;
    amount?: string | undefined;
    lockedIotas?: string[] | undefined;
};

export type CreateStakeResponse = ({
    id: string;
    provider?: ("Figment") | undefined;
    walletId: string;
    status: "Active" | "Creating" | "Failed" | "Unbonding" | "Unbond" | "Withdrawing" | "Withdrawn";
    requester: {
        userId: string;
        tokenId?: string | undefined;
        appId?: string | undefined;
    };
    requestBody: {
        protocol: "Babylon";
        walletId: string;
        provider: "Figment";
        amount: string;
        duration: number;
    } | {
        protocol: "Ethereum";
        walletId: string;
        provider: "Figment";
        amount: string;
    } | {
        protocol: "Iota";
        walletId: string;
        validator: string;
        amount?: string | undefined;
        lockedIotas?: string[] | undefined;
    };
    dateCreated: string;
    protocol: "Babylon";
    data: {
        finalityProviders: string[];
        covenantPubkeys: string[];
        magicBytes: string;
        covenantThreshold: number;
        minUnbondingTime: number;
        lockHeight: number;
    };
} | {
    id: string;
    provider?: ("Figment") | undefined;
    walletId: string;
    status: "Active" | "Creating" | "Failed" | "Unbonding" | "Unbond" | "Withdrawing" | "Withdrawn";
    requester: {
        userId: string;
        tokenId?: string | undefined;
        appId?: string | undefined;
    };
    requestBody: {
        protocol: "Babylon";
        walletId: string;
        provider: "Figment";
        amount: string;
        duration: number;
    } | {
        protocol: "Ethereum";
        walletId: string;
        provider: "Figment";
        amount: string;
    } | {
        protocol: "Iota";
        walletId: string;
        validator: string;
        amount?: string | undefined;
        lockedIotas?: string[] | undefined;
    };
    dateCreated: string;
    protocol: "Iota";
    data: {
        stakedObjectId?: string | undefined;
        expirationDate?: string | undefined;
        amount: string;
        validator: string;
    };
} | {
    id: string;
    provider?: ("Figment") | undefined;
    walletId: string;
    status: "Active" | "Creating" | "Failed" | "Unbonding" | "Unbond" | "Withdrawing" | "Withdrawn";
    requester: {
        userId: string;
        tokenId?: string | undefined;
        appId?: string | undefined;
    };
    requestBody: {
        protocol: "Babylon";
        walletId: string;
        provider: "Figment";
        amount: string;
        duration: number;
    } | {
        protocol: "Ethereum";
        walletId: string;
        provider: "Figment";
        amount: string;
    } | {
        protocol: "Iota";
        walletId: string;
        validator: string;
        amount?: string | undefined;
        lockedIotas?: string[] | undefined;
    };
    dateCreated: string;
    protocol: "Ethereum";
    data: {
        validators: {
            pubkey: string;
            withdrawalAddress: string;
        }[];
    };
}) & {
    actions: {
        id: string;
        stakeId: string;
        transactionId?: string | undefined;
        signatureId?: string | undefined;
        transactionHash?: string | undefined;
        kind: "Stake" | "Unbond" | "Withdraw";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: ({
            protocol: "Babylon";
            walletId: string;
            provider: "Figment";
            amount: string;
            duration: number;
        } | {
            protocol: "Ethereum";
            walletId: string;
            provider: "Figment";
            amount: string;
        } | {
            protocol: "Iota";
            walletId: string;
            validator: string;
            amount?: string | undefined;
            lockedIotas?: string[] | undefined;
        }) | ({
            protocol: "Iota";
            kind: "Withdraw";
        } | {
            protocol: "Babylon";
            kind: "Unbond" | "Withdraw";
        } | {
            protocol: "Ethereum";
            kind: "Withdraw";
        });
        dateCreated: string;
    }[];
};

export type CreateStakeRequest = { body: CreateStakeBody }

export type CreateStakeActionBody = {
    protocol: "Iota";
    kind: "Withdraw";
} | {
    protocol: "Babylon";
    kind: "Unbond" | "Withdraw";
} | {
    protocol: "Ethereum";
    kind: "Withdraw";
};

export type CreateStakeActionParams = {
    stakeId: string;
};

export type CreateStakeActionResponse = {
    stake: {
        id: string;
        provider?: ("Figment") | undefined;
        walletId: string;
        status: "Active" | "Creating" | "Failed" | "Unbonding" | "Unbond" | "Withdrawing" | "Withdrawn";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            protocol: "Babylon";
            walletId: string;
            provider: "Figment";
            amount: string;
            duration: number;
        } | {
            protocol: "Ethereum";
            walletId: string;
            provider: "Figment";
            amount: string;
        } | {
            protocol: "Iota";
            walletId: string;
            validator: string;
            amount?: string | undefined;
            lockedIotas?: string[] | undefined;
        };
        dateCreated: string;
        protocol: "Babylon";
        data: {
            finalityProviders: string[];
            covenantPubkeys: string[];
            magicBytes: string;
            covenantThreshold: number;
            minUnbondingTime: number;
            lockHeight: number;
        };
    } | {
        id: string;
        provider?: ("Figment") | undefined;
        walletId: string;
        status: "Active" | "Creating" | "Failed" | "Unbonding" | "Unbond" | "Withdrawing" | "Withdrawn";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            protocol: "Babylon";
            walletId: string;
            provider: "Figment";
            amount: string;
            duration: number;
        } | {
            protocol: "Ethereum";
            walletId: string;
            provider: "Figment";
            amount: string;
        } | {
            protocol: "Iota";
            walletId: string;
            validator: string;
            amount?: string | undefined;
            lockedIotas?: string[] | undefined;
        };
        dateCreated: string;
        protocol: "Iota";
        data: {
            stakedObjectId?: string | undefined;
            expirationDate?: string | undefined;
            amount: string;
            validator: string;
        };
    } | {
        id: string;
        provider?: ("Figment") | undefined;
        walletId: string;
        status: "Active" | "Creating" | "Failed" | "Unbonding" | "Unbond" | "Withdrawing" | "Withdrawn";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            protocol: "Babylon";
            walletId: string;
            provider: "Figment";
            amount: string;
            duration: number;
        } | {
            protocol: "Ethereum";
            walletId: string;
            provider: "Figment";
            amount: string;
        } | {
            protocol: "Iota";
            walletId: string;
            validator: string;
            amount?: string | undefined;
            lockedIotas?: string[] | undefined;
        };
        dateCreated: string;
        protocol: "Ethereum";
        data: {
            validators: {
                pubkey: string;
                withdrawalAddress: string;
            }[];
        };
    };
    stakeAction: {
        id: string;
        stakeId: string;
        transactionId?: string | undefined;
        signatureId?: string | undefined;
        transactionHash?: string | undefined;
        kind: "Stake" | "Unbond" | "Withdraw";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: ({
            protocol: "Babylon";
            walletId: string;
            provider: "Figment";
            amount: string;
            duration: number;
        } | {
            protocol: "Ethereum";
            walletId: string;
            provider: "Figment";
            amount: string;
        } | {
            protocol: "Iota";
            walletId: string;
            validator: string;
            amount?: string | undefined;
            lockedIotas?: string[] | undefined;
        }) | ({
            protocol: "Iota";
            kind: "Withdraw";
        } | {
            protocol: "Babylon";
            kind: "Unbond" | "Withdraw";
        } | {
            protocol: "Ethereum";
            kind: "Withdraw";
        });
        dateCreated: string;
    };
};

export type CreateStakeActionRequest = CreateStakeActionParams & { body: CreateStakeActionBody }

export type GetStakeRewardsParams = {
    stakeId: string;
};

export type GetStakeRewardsResponse = {
    symbol: string;
    balance: string;
} | undefined;

export type GetStakeRewardsRequest = GetStakeRewardsParams

export type ListStakeActionsQuery = {
    limit?: number | undefined;
    paginationToken?: string | undefined;
};

export type ListStakeActionsResponse = {
    items: {
        id: string;
        stakeId: string;
        transactionId?: string | undefined;
        signatureId?: string | undefined;
        transactionHash?: string | undefined;
        kind: "Stake" | "Unbond" | "Withdraw";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: ({
            protocol: "Babylon";
            walletId: string;
            provider: "Figment";
            amount: string;
            duration: number;
        } | {
            protocol: "Ethereum";
            walletId: string;
            provider: "Figment";
            amount: string;
        } | {
            protocol: "Iota";
            walletId: string;
            validator: string;
            amount?: string | undefined;
            lockedIotas?: string[] | undefined;
        }) | ({
            protocol: "Iota";
            kind: "Withdraw";
        } | {
            protocol: "Babylon";
            kind: "Unbond" | "Withdraw";
        } | {
            protocol: "Ethereum";
            kind: "Withdraw";
        });
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
    items: ({
        id: string;
        provider?: ("Figment") | undefined;
        walletId: string;
        status: "Active" | "Creating" | "Failed" | "Unbonding" | "Unbond" | "Withdrawing" | "Withdrawn";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            protocol: "Babylon";
            walletId: string;
            provider: "Figment";
            amount: string;
            duration: number;
        } | {
            protocol: "Ethereum";
            walletId: string;
            provider: "Figment";
            amount: string;
        } | {
            protocol: "Iota";
            walletId: string;
            validator: string;
            amount?: string | undefined;
            lockedIotas?: string[] | undefined;
        };
        dateCreated: string;
        protocol: "Babylon";
        data: {
            finalityProviders: string[];
            covenantPubkeys: string[];
            magicBytes: string;
            covenantThreshold: number;
            minUnbondingTime: number;
            lockHeight: number;
        };
    } | {
        id: string;
        provider?: ("Figment") | undefined;
        walletId: string;
        status: "Active" | "Creating" | "Failed" | "Unbonding" | "Unbond" | "Withdrawing" | "Withdrawn";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            protocol: "Babylon";
            walletId: string;
            provider: "Figment";
            amount: string;
            duration: number;
        } | {
            protocol: "Ethereum";
            walletId: string;
            provider: "Figment";
            amount: string;
        } | {
            protocol: "Iota";
            walletId: string;
            validator: string;
            amount?: string | undefined;
            lockedIotas?: string[] | undefined;
        };
        dateCreated: string;
        protocol: "Iota";
        data: {
            stakedObjectId?: string | undefined;
            expirationDate?: string | undefined;
            amount: string;
            validator: string;
        };
    } | {
        id: string;
        provider?: ("Figment") | undefined;
        walletId: string;
        status: "Active" | "Creating" | "Failed" | "Unbonding" | "Unbond" | "Withdrawing" | "Withdrawn";
        requester: {
            userId: string;
            tokenId?: string | undefined;
            appId?: string | undefined;
        };
        requestBody: {
            protocol: "Babylon";
            walletId: string;
            provider: "Figment";
            amount: string;
            duration: number;
        } | {
            protocol: "Ethereum";
            walletId: string;
            provider: "Figment";
            amount: string;
        } | {
            protocol: "Iota";
            walletId: string;
            validator: string;
            amount?: string | undefined;
            lockedIotas?: string[] | undefined;
        };
        dateCreated: string;
        protocol: "Ethereum";
        data: {
            validators: {
                pubkey: string;
                withdrawalAddress: string;
            }[];
        };
    })[];
    nextPageToken?: string | undefined;
};

export type ListStakesRequest = { query?: ListStakesQuery }

