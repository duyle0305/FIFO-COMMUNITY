import { Card, Divider, Empty, Flex, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

import PageBreadcrumbs from '@/components/core/page-breadcrumbs';
import { useGetFollows, useGetOtherFollow } from '@/hooks/query/follow/use-follow-listing';

import { EventsWrapper } from '../home/layout/events-wrapper';
import { FollowItem } from './component/follow-item';

const FollowPage = () => {
    const location = useLocation();
    const state = location.state as { id?: string };
    const { data: follows } = state?.id ? useGetOtherFollow(state.id) : useGetFollows();

    return (
        <Card>
            <PageBreadcrumbs />
            <Divider />
            <Flex vertical gap={20}>
                <Typography.Title level={4}>Following</Typography.Title>
                <EventsWrapper>
                    {follows?.length ? (
                        follows?.map(account => (
                            <FollowItem key={account?.accountId} account={account} isFollow={true} />
                        ))
                    ) : (
                        <Empty description="No recommendation" />
                    )}
                </EventsWrapper>
            </Flex>
        </Card>
    );
};

export default FollowPage;
