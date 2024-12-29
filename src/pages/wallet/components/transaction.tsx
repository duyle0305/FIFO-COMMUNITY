import type { FilterTransactionParams } from '@/hooks/query/transaction/use-transactions-current-account';
import type { RootState } from '@/stores';
import type { FilterTransaction, Transaction } from '@/types/transaction/transaction';
import type { FC } from 'react';

import { css } from '@emotion/react';
import { Avatar, Col, DatePicker, Flex, Select, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { DATE_FORMAT, FULL_TIME_FORMAT } from '@/consts/common';
import { useRedeemHistory } from '@/hooks/query/redeem/use-redeem-documents';
import { useTransactionsCurrentAccount } from '@/hooks/query/transaction/use-transactions-current-account';
import { formatSignedNumber } from '@/utils/number';

import TransactionItem from './transaction-item';

export const TransactionType = {
    bonus: 'Bonus Point',
    daily: 'Daily Point',
    transaction: 'Transaction',
    order: 'Order Point',
} as const;

export const StatusType = {
    active: 'Success',
    inactive: 'Failed',
} as const;

export const PointType = {
    Newest: 'Newest On Top',
    Most: 'Most Points',
    Least: 'Least Points',
} as const;

type FormatTransaction = {
    id: string;
    title: string;
    image?: string;
    type: string;
    amount: number;
    createdDate: string;
    transactionType?: string;
};

const Transactions: FC = () => {
    const [params, setParams] = useState<FilterTransactionParams>({
        viewTransaction: false,
        dailyPoint: false,
        bonusPoint: false,
        orderPoint: false,
        orderPointStatus: 'SUCCESS',
    });

    const { accountInfo } = useSelector((state: RootState) => state.account);
    const { data } = useTransactionsCurrentAccount({ params });

    const bonusPointsTransactions: FormatTransaction[] =
        data?.bonusPoint?.map(bonusPoint => ({
            id: bonusPoint?.dailyPointId,
            title: bonusPoint?.post?.title || '',
            type: 'Bonus Point',
            amount: bonusPoint.pointEarned,
            createdDate: bonusPoint.createdDate,
        })) || [];

    const dailyPointsTransactions: FormatTransaction[] =
        data?.dailyPointList?.map(dailyPoint => ({
            id: dailyPoint?.dailyPointId,
            title: dailyPoint?.post?.title || '',
            image: accountInfo?.avatar || '',
            type: 'Daily Point',
            amount: dailyPoint.pointEarned,
            createdDate: dailyPoint.createdDate,
        })) || [];

    const transactionList: FormatTransaction[] =
        data?.transactionList?.map(transaction => ({
            id: transaction?.transactionId,
            title: transaction?.reward?.name,
            image: accountInfo?.avatar || '',
            type: transaction.type,
            amount: transaction.amount,
            createdDate: transaction.createdDate,
            transactionType: transaction?.transactionType,
        })) || [];

    const orderPointTransactions: FormatTransaction[] =
        data?.orderPointList?.map(orderPoint => ({
            id: orderPoint?.orderId,
            title: '',
            type: 'Order Point',
            image: accountInfo?.avatar || '',
            amount: orderPoint?.monkeyCoinPack?.point,
            createdDate: orderPoint.orderDate,
            status: orderPoint.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
        })) || [];

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
        console.log(value);

        if (value === 'Success') {
            setParams(prev => ({
                ...prev,
                orderPointStatus: 'SUCCESS',
            }));
        } else if (value === 'Failed') {
            setParams(prev => ({
                ...prev,
                orderPointStatus: 'FAILED',
            }));
        } else {
            setParams(prev => ({
                ...params,
                orderPointStatus: 'SUCCESS',
            }));
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text: string) => <Avatar src={text} size={50} />,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (text: string) => dayjs(text).format(FULL_TIME_FORMAT),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text: number) => (
                <div style={{ color: text >= 0 ? '#18C07A' : '#FF0000' }}>{formatSignedNumber(text)} MC</div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
    ];

    return (
        <div css={styles}>
            <Col className="transaction-header">
                <p>
                    <Typography.Text
                        style={{
                            fontSize: 20,
                            fontWeight: 500,
                        }}
                    >
                        Last Transaction
                    </Typography.Text>
                </p>
                <Flex gap={16}>
                    <div>
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
                    </div>
                    <div>
                        <Typography.Text>Status:</Typography.Text>
                        <Select
                            allowClear
                            style={{
                                minWidth: 120,
                            }}
                            options={Object.keys(StatusType).map(k => ({
                                label: StatusType[k as keyof typeof StatusType],
                                value: StatusType[k as keyof typeof StatusType],
                            }))}
                            onChange={value => handleChangeStatus(value)}
                        />
                    </div>

                    <div>
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
                    </div>
                </Flex>
            </Col>
            <Flex className="transaction-items" vertical gap={20}>
                {/* {allTransactions?.map(transaction => (
                    <TransactionItem
                        key={transaction?.id}
                        image={accountInfo?.avatar || ''}
                        amount={transaction?.amount}
                        description={transaction?.type}
                        title={transaction?.title}
                        createdDate={transaction?.createdDate}
                    />
                ))} */}
                <Table columns={columns} dataSource={allTransactions} pagination={false} />
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
