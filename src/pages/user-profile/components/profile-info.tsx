import type { RootState } from '@/stores';

import {
    CheckCircleOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    PlusCircleFilled,
    StopOutlined,
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Dropdown, Flex, Image, Modal, Space, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import AvatarPlaceholder from '/public/avatar-placeholder.svg';
import BackgroundPlaceholder from '/public/background-placeholder.svg';
import { blockKeys } from '@/consts/factory/block';
import { followKeys } from '@/consts/factory/follow';
import { useToggleBlock } from '@/hooks/mutate/block/use-toggle-block';
import { useToggleFollow } from '@/hooks/mutate/follow/use-toggle-follow';
import { useProfileById } from '@/hooks/query/auth/use-profile';
import { useBlocksListing } from '@/hooks/query/block/use-block-listing';
import { useGetFollows, useGetOtherFollow, useGetOtherFollower } from '@/hooks/query/follow/use-follow-listing';
import { useMessage } from '@/hooks/use-message';
import { PATHS } from '@/utils/paths';

const { confirm } = Modal;

interface ProfileInfoProps {
    setIsShowReportReasons: (value: boolean) => void;
}

export const ProfileInfo = ({ setIsShowReportReasons }: ProfileInfoProps) => {
    const { accountInfo } = useSelector((state: RootState) => state.account);
    const navigate = useNavigate();

    const { id } = useParams();

    const { data: userInfo } = useProfileById(id);

    const { success, error } = useMessage();
    const queryClient = useQueryClient();

    // const { data: follows } = useGetFollows();
    const { data: blocks } = useBlocksListing();
    const { mutate: toggleBlock } = useToggleBlock();
    const { mutate: toggleFollow } = useToggleFollow();

    const isBlocked = blocks?.find(block => block?.accountId === userInfo?.accountId);

    // const isFollowed = follows?.find(follow => follow?.followee?.accountId === userInfo?.accountId);

    const { data: currentFollow } = useGetFollows();
    const { data: follows } = useGetOtherFollow(id as string);
    const { data: followers } = useGetOtherFollower(id as string);

    const handleToggleBlock = () => {
        confirm({
            title: isBlocked
                ? `Do you want to unblock ${userInfo?.username}?`
                : `Do you want to block ${userInfo?.username}?`,
            onOk() {
                toggleBlock(
                    { accountID: userInfo?.accountId as string },
                    {
                        onSuccess: () => {
                            queryClient.invalidateQueries({
                                queryKey: blockKeys.listing(),
                            });
                            success(isBlocked ? 'Unblocked successfully' : 'Blocked successfully');
                        },
                        onError: err => {
                            error(err.message);
                        },
                    },
                );
            },
        });
    };

    const handleToggleFollow = () => {
        toggleFollow(userInfo?.accountId as string, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: followKeys.listing(),
                });
            },
        });
    };

    return (
        <Flex vertical gap={92}>
            <div style={{ position: 'relative' }}>
                <Image
                    src={userInfo?.coverImage || accountInfo?.coverImage || BackgroundPlaceholder}
                    alt="logo"
                    width="100%"
                    height={260}
                    style={{ objectFit: 'cover' }}
                />
                <Avatar
                    shape="circle"
                    size={136}
                    src={userInfo?.avatar || accountInfo?.avatar || AvatarPlaceholder}
                    style={{ position: 'absolute', top: 200, left: 20 }}
                />

                <Flex gap={20}>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: '1',
                                    icon: <ExclamationCircleOutlined />,
                                    label: 'Report',
                                    onClick: () => setIsShowReportReasons(true),
                                },
                                {
                                    key: '2',
                                    icon: isBlocked ? <CheckCircleOutlined /> : <StopOutlined />,
                                    label: isBlocked ? 'Unblock' : 'Block',
                                    onClick: handleToggleBlock,
                                },
                            ],
                        }}
                    >
                        <Button
                            icon={<EllipsisOutlined />}
                            variant="outlined"
                            style={{ position: 'absolute', top: 280, right: 120 }}
                        />
                    </Dropdown>

                    <Button onClick={handleToggleFollow} style={{ position: 'absolute', top: 280, right: 20 }}>
                        {currentFollow?.find(f => f.accountId === userInfo?.accountId) ? 'UnFollow' : 'Follow'}
                    </Button>
                </Flex>
            </div>
            <Flex vertical gap={8}>
                <Typography.Title level={4}>{userInfo?.username}</Typography.Title>
                <Typography.Text type="secondary">{userInfo?.handle}</Typography.Text>
                <Typography.Text>{userInfo?.bio}</Typography.Text>
                <Flex gap={24}>
                    <Space size="small" onClick={() => navigate(PATHS.FOLLOWING, { state: { id: id } })}>
                        <Typography.Text>{follows?.length}</Typography.Text>
                        <Typography.Text type="secondary">Followings</Typography.Text>
                    </Space>

                    <Space onClick={() => navigate(PATHS.FOLLOWER, { state: { id: id } })}>
                        <Typography.Text>{followers?.length}</Typography.Text>
                        <Typography.Text type="secondary">Followers</Typography.Text>
                    </Space>
                </Flex>
            </Flex>
        </Flex>
    );
};
