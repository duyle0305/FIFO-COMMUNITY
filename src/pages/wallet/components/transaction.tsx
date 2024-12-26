import type { FilterTransactionParams } from '@/hooks/query/transaction/use-transactions-current-account';
import type { RootState } from '@/stores';
import type { FC } from 'react';

import { css } from '@emotion/react';
import { DatePicker, Flex, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { DATE_FORMAT, FULL_TIME_FORMAT } from '@/consts/common';
import { useRedeemHistory } from '@/hooks/query/redeem/use-redeem-documents';
import { useTransactionsCurrentAccount } from '@/hooks/query/transaction/use-transactions-current-account';

import TransactionItem from './transaction-item';

export const TransactionType = {
    bonus: 'Bonus Point',
    daily: 'Daily Point',
    transaction: 'Transaction',
    order: 'Order Point',
} as const;

export const TransactionStatus = {
    success: 'Success',
    failed: 'Failed',
} as const;

type FormatTransaction = {
    status: string;
    id: string;
    title: string;
    type: string;
    amount: number;
    createdDate: string;
    transactionType?: string;
    transactionStatus?: string;
};

const Transactions: FC = () => {
    const [params, setParams] = useState<FilterTransactionParams>({
        viewTransaction: false,
        dailyPoint: false,
        bonusPoint: false,
        orderPoint: false,
    });

    const { accountInfo } = useSelector((state: RootState) => state.account);
    const { data } = useTransactionsCurrentAccount({ params });

    const bonusPointsTransactions: FormatTransaction[] =
        (data?.bonusPoint || []).map(bonusPoint => ({
            id: bonusPoint?.dailyPointId,
            title: bonusPoint?.post?.title || '',
            type: 'Bonus Point',
            amount: bonusPoint.pointEarned,
            createdDate: bonusPoint.createdDate,
            status: bonusPoint?.post?.status,
        })) || [];

    const dailyPointsTransactions: FormatTransaction[] =
        (data?.dailyPointList || []).map(dailyPoint => ({
            id: dailyPoint?.dailyPointId,
            title: dailyPoint?.post?.title || '',
            type: 'Daily Point',
            amount: dailyPoint.pointEarned,
            createdDate: dailyPoint.createdDate,
            status: dailyPoint?.post?.status,
        })) || [];

    const transactionList: FormatTransaction[] =
        (data?.transactionList || []).map(transaction => ({
            id: transaction?.transactionId,
            title: transaction?.reward?.name,
            type: transaction.type,
            amount: transaction.amount,
            createdDate: transaction.createdDate,
            transactionType: transaction?.transactionType,
            status: transaction?.reward?.status,
        })) || [];

    const orderPointTransactions: FormatTransaction[] = (data?.orderPointList || []) // Use an empty array if data is nullish
        .filter(orderPoint => !params.status || orderPoint.status.toLowerCase() === params.status.toLowerCase()) // handle case sensitivity if necessary
        .map(orderPoint => ({
            id: orderPoint?.orderId,
            title: '',
            type: 'Order Point',
            amount: orderPoint?.monkeyCoinPack?.point,
            createdDate: orderPoint.orderDate,
            status: orderPoint?.status, // Make sure status is included
        }));

    const allTransactions = [
        ...bonusPointsTransactions,
        ...dailyPointsTransactions,
        ...transactionList,
        ...orderPointTransactions,
    ];

    const handleChangeType = (value: string) => {
        console.log(value);

        if (value === 'Bonus Point') {
            setParams(prev => ({
                ...prev,
                dailyPoint: false,
                viewTransaction: false,
                bonusPoint: true,
                orderPoint: false,
            }));
        } else if (value === 'Daily Point') {
            setParams(prev => ({
                ...prev,
                bonusPoint: false,
                viewTransaction: false,
                dailyPoint: true,
                orderPoint: false,
            }));
        } else if (value === 'Transaction') {
            setParams(prev => ({
                ...params,
                bonusPoint: false,
                dailyPoint: false,
                viewTransaction: true,
                orderPoint: false,
            }));
        } else if (value === 'Order Point') {
            setParams(prev => ({
                ...params,
                bonusPoint: false,
                dailyPoint: false,
                viewTransaction: false,
                orderPoint: true,
            }));
        } else {
            setParams({
                ...params,
                bonusPoint: false,
                dailyPoint: false,
                viewTransaction: false,
                orderPoint: false,
            });
        }
    };

    const handleChangeStatus = (value: string) => {
        setParams(prev => ({
            ...prev,
            status: value, // Directly set the status value
        }));
    };

    return (
        <div css={styles}>
            <Typography.Text
                style={{
                    fontSize: 20,
                    fontWeight: 500,
                }}
            >
                Last Transaction
            </Typography.Text>
            <Flex justify="space-between" className="transaction-header">
                <p></p>
                <Flex gap={16}>
                    <Space>
                        <Typography.Text>Type:</Typography.Text>
                        <Select
                            allowClear
                            style={{
                                minWidth: 120,
                            }}
                            options={Object.keys(TransactionType).map(k => ({
                                label: TransactionType[k as keyof typeof TransactionType],
                                value: TransactionType[k as keyof typeof TransactionType],
                            }))}
                            onChange={value => handleChangeType(value)}
                        />
                    </Space>
                    <Space>
                        <Typography.Text>Status:</Typography.Text>
                        <Select
                            allowClear
                            style={{
                                minWidth: 120,
                            }}
                            options={Object.keys(TransactionStatus).map(k => ({
                                label: TransactionStatus[k as keyof typeof TransactionStatus],
                                value: TransactionStatus[k as keyof typeof TransactionStatus],
                            }))}
                            onChange={value => handleChangeStatus(value)}
                        />
                    </Space>

                    <Space>
                        <Typography.Text>Date:</Typography.Text>
                        <DatePicker.RangePicker
                            format={DATE_FORMAT}
                            onChange={e => {
                                setParams({
                                    ...params,
                                    startDate: e?.[0] ? dayjs(e?.[0]).format('YYYY-MM-DD') : undefined,
                                    endDate: e?.[1] ? dayjs(e?.[1]).format('YYYY-MM-DD') : undefined,
                                });
                            }}
                        />
                    </Space>
                </Flex>
            </Flex>
            <Flex className="transaction-items" vertical gap={20}>
                {allTransactions?.map(transaction => (
                    <TransactionItem
                        key={transaction?.id}
                        image={accountInfo?.avatar || ''}
                        amount={transaction?.amount}
                        description={transaction?.type}
                        title={transaction?.title}
                        createdDate={transaction?.createdDate}
                        status={transaction?.status || ''}
                    />
                ))}
            </Flex>
        </div>
    );
};

const styles = css(`
    .transaction-header {
        margin-bottom: 30px;    
    }
`);

export default Transactions;
