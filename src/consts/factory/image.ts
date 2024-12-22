export const imageKeys = {
    all: ['images'] as const,
    currentUser: (params: object = {}) => [...imageKeys.all, 'current-user', params] as const,
    otherUser: (params: object = {}) => [...imageKeys.all, 'other-user', params] as const,
};