import type { Account } from '@/types/account';
import type { Follow } from '@/types/follow';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { request } from '@/apis/request';
import { followKeys } from '@/consts/factory/follow';

export const useGetFollowTopAccounts = () => {
    const fetchPostTopAccounts = async (): Promise<Account[]> => {
        const { entity } = await request<Account[]>('get', `/follow/get-follows`);

        return entity;
    };

    return useQuery({
        queryKey: followKeys.topAccounts(),
        queryFn: fetchPostTopAccounts,
        placeholderData: keepPreviousData,
    });
};

export const useGetFollows = () => {
    const fetchFollows = async (): Promise<Account[]> => {
        const { entity } = await request<Account[]>('get', `/follow/get-follows`);

        return entity;
    };

    return useQuery({
        queryKey: followKeys.listing(),
        queryFn: fetchFollows,
        placeholderData: keepPreviousData,
    });
};

export const useGetOtherFollow = (id: string) => {
    const fetchOtherFollow = async (): Promise<Account[]> => {
        const { entity } = await request<Account[]>('get', `/follow/get-another-follows/${id}`);

        return entity;
    };

    return useQuery({
        queryKey: followKeys.getFollow(id),
        queryFn: fetchOtherFollow,
        placeholderData: keepPreviousData,
        enabled: !!id,
    });
};

export const useGetOtherFollower = (id: string) => {
    const fetchOtherFollower = async (): Promise<Account[]> => {
        const { entity } = await request<Account[]>('get', `/follow/get-another-followers/${id}`);

        return entity;
    };

    return useQuery({
        queryKey: followKeys.getFollower(id),
        queryFn: fetchOtherFollower,
        placeholderData: keepPreviousData,
        enabled: !!id,
    });
};

export const useGetFollowers = () => {
    const fetchFollowers = async (): Promise<Account[]> => {
        const { entity } = await request<Account[]>('get', `/follow/get-followers`);

        return entity;
    };

    return useQuery({
        queryKey: followKeys.listingFollower(),
        queryFn: fetchFollowers,
        placeholderData: keepPreviousData,
    });
};
