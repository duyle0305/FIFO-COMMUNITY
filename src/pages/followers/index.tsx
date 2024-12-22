import { Card, Divider, Empty, Flex, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

import PageBreadcrumbs from '@/components/core/page-breadcrumbs';
import { useGetFollowers, useGetOtherFollower } from '@/hooks/query/follow/use-follow-listing';

import { FollowItem } from '../followings/component/follow-item';
import { EventsWrapper } from '../home/layout/events-wrapper';

const FollowerPage = () => {
    const location = useLocation();
    const state = location.state as { id?: string };
    const { data: followers } = state?.id ? useGetOtherFollower(state.id) : useGetFollowers();

    return (
        <Card>
            <PageBreadcrumbs />
            <Divider />
            <Flex vertical gap={20}>
                <Typography.Title level={4}>Followers</Typography.Title>
                <EventsWrapper>
                    {followers?.length ? (
                        followers?.map(account => (
                            <FollowItem key={account?.accountId} account={account} isFollow={false} />
                        ))
                    ) : (
                        <Empty description="No followers" />
                    )}
                </EventsWrapper>
            </Flex>
        </Card>
    );
};

export default FollowerPage;
