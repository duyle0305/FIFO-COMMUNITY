import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useMutation } from '@tanstack/react-query';

import axiosInstance from '@/apis/request';

export const useDeleteAccount = (options: UseMutationOptions<unknown, AxiosError<unknown>, any> = {}) => {
    const deleteAccount = async (id: string) => {
        return axiosInstance.delete(`/account/delete/${id}`);
    };

    return useMutation<unknown, AxiosError<unknown>, string>({
        mutationKey: ['account', 'delete'],
        mutationFn: id => deleteAccount(id),
        ...options,
    });
};
