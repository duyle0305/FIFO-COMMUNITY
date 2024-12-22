export const followKeys = {
    all: ['follows'] as const,
    listing: (params: object = {}) => [...followKeys.all, 'listing', params] as const,
    listingFollower: (params: object = {}) => [...followKeys.all, 'listing-follower', params] as const,
    topAccounts: () => [...followKeys.all, 'top-accounts'] as const,
    recommendations: () => [...followKeys.all, 'recommendations'] as const,
    getFollow: (id: string) => [...followKeys.all, 'get-follow', id] as const,
    getFollower: (id: string) => [...followKeys.all, 'get-follower', id] as const,
};
