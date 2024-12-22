import type { RootState } from '@/stores';
import type { PaginationParams } from '@/types';
import type { TabsProps } from 'antd';

import { Empty } from 'antd';
import { useSelector } from 'react-redux';

import { BaseTab } from '@/components/core/tab';
import { PostItem } from '@/components/post/post-item';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/consts/common';
import { useCurrentUserCommentListing } from '@/hooks/query/comment/use-comment-listing';
import { useCurrentUserPostListing, usePostsListing } from '@/hooks/query/post/use-posts-listing';

import { PostWrapper } from '../post/layout/post-wrapper';
import { Medias } from './components/medias';
import { ProfileInfo } from './components/profile-info';

const ProfilePage = () => {
    const { accountInfo } = useSelector((state: RootState) => state.account);

    const initialParams: PaginationParams = {
        page: DEFAULT_PAGE,
        perPage: DEFAULT_PAGE_SIZE,
    };

    const { data } = useCurrentUserPostListing({
        ...initialParams,
        accountId: accountInfo?.accountId,
    });

    const { data: comments } = useCurrentUserCommentListing({
        ...initialParams,
    });

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Posts',
            children: (
                <PostWrapper showHeader={false}>
                    {!data || !data.length ? <Empty /> : data.map(post => <PostItem data={post} key={post.postId} />)}
                </PostWrapper>
            ),
        },
        {
            key: '2',
            label: 'Replies',
            children: (
                <PostWrapper showHeader={false}>
                    {!comments || !comments.length ? (
                        <Empty />
                    ) : (
                        comments.map(c => <PostItem data={c} key={c.postId} showComment={true} />)
                    )}
                </PostWrapper>
            ),
        },
        {
            key: '3',
            label: 'Media',
            children: <Medias />,
        },
    ];

    return (
        <div>
            <ProfileInfo />
            <BaseTab items={items} defaultActiveKey="1" />
        </div>
    );
};

export default ProfilePage;
