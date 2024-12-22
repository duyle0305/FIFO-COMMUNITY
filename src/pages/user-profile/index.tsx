import type { RootState } from '@/stores';
import type { PaginationParams } from '@/types';
import type { ReportAccountReasons } from '@/types/report/report';
import type { TabsProps } from 'antd';

import { Button, Empty, Flex, Modal } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { BaseTab } from '@/components/core/tab';
import { PostItem } from '@/components/post/post-item';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/consts/common';
import { useCreateReport } from '@/hooks/mutate/report/use-create-report';
import { useOtherUserCommentListing } from '@/hooks/query/comment/use-comment-listing';
import { usePostsAnotherAccountListing } from '@/hooks/query/post/use-posts-listing';
import { useMessage } from '@/hooks/use-message';
import { reportAccountReasons } from '@/types/report/report';

import { PostWrapper } from '../post/layout/post-wrapper';
import { Medias } from './components/medias';
import { ProfileInfo } from './components/profile-info';
import ReportReason from './components/report-reason';

const UserProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedReason, setSelectedReason] = useState<ReportAccountReasons>();
    const [isShowReportReasons, setIsShowReportReasons] = useState(false);

    const { accountInfo } = useSelector((state: RootState) => state.account);
    const { success, error } = useMessage();

    const initialParams: PaginationParams = {
        page: DEFAULT_PAGE,
        perPage: DEFAULT_PAGE_SIZE,
    };

    const { data } = usePostsAnotherAccountListing(id as string);

    if (!accountInfo) {
        return null;
    }

    const { data: comments } = useOtherUserCommentListing(id as string);

    const { mutate: createReport, isPending: isPendingCreateReport } = useCreateReport(id as string);

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

    const handleReportAccount = () => {
        if (!selectedReason) {
            return;
        }

        createReport(selectedReason, {
            onSuccess: () => {
                success('Reported successfully!');
                setIsShowReportReasons(false);
            },
            onError: err => {
                error(err.message);
            },
        });
    };

    return (
        <div>
            <ProfileInfo setIsShowReportReasons={setIsShowReportReasons} />
            <BaseTab items={items} defaultActiveKey="1" />

            <Modal
                title="Report"
                open={isShowReportReasons}
                onCancel={() => setIsShowReportReasons(false)}
                footer={null}
            >
                {reportAccountReasons.map((reason, index) => (
                    <ReportReason
                        key={index}
                        reason={reason}
                        selectedReason={selectedReason}
                        setSelectedReason={setSelectedReason}
                    />
                ))}

                <Flex justify="center">
                    <Button
                        type="primary"
                        onClick={handleReportAccount}
                        loading={isPendingCreateReport}
                        disabled={!selectedReason}
                    >
                        Submit
                    </Button>
                </Flex>
            </Modal>
        </div>
    );
};

export default UserProfilePage;
