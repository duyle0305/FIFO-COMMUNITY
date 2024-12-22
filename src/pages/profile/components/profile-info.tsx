import type { RootState } from '@/stores';

import { CameraOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Flex, Image, Input, Space, Typography, Upload } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AvatarPlaceholder from '/public/avatar-placeholder.svg';
import BackgroundPlaceholder from '/public/background-placeholder.svg';
import { authKeys } from '@/consts/factory/auth';
import { useUpdateProfile } from '@/hooks/mutate/profile/use-update-profile';
import { useGetFollowers, useGetFollows } from '@/hooks/query/follow/use-follow-listing';
import { useMessage } from '@/hooks/use-message';
import { useUploadFile } from '@/hooks/use-upload-file';
import { PATHS } from '@/utils/paths';

export const ProfileInfo = () => {
    const dispatch = useDispatch();
    const { accountInfo } = useSelector((state: RootState) => state.account);
    const [isEdit, setIsEdit] = useState(false);
    const [bio, setBio] = useState(accountInfo?.bio);

    const { imgUrl: coverImage, uploadFile: uploadCoverImage } = useUploadFile();
    const { imgUrl: avatar, uploadFile: uploadAvatar } = useUploadFile();

    const queryClient = useQueryClient();
    const { success, error } = useMessage();
    const navigate = useNavigate();

    const { mutate: updateProfile } = useUpdateProfile();

    const { data: follows } = useGetFollows();
    const { data: followers } = useGetFollowers();

    const update = () => {
        updateProfile(
            {
                ...(avatar && { avatar }),
                ...(coverImage && { coverImage }),
                bio,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: authKeys.profile(),
                    });
                    success('Profile updated successfully');
                    setIsEdit(false);
                },
                onError: err => {
                    error(err.message);
                },
            },
        );
    };

    return (
        <Flex vertical gap={92}>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                {isEdit ? (
                    <Upload
                        accept="image/*"
                        customRequest={uploadCoverImage}
                        style={{ position: 'relative', cursor: 'pointer' }}
                        showUploadList={false}
                    >
                        <Image
                            src={coverImage || accountInfo?.coverImage || BackgroundPlaceholder}
                            alt="logo"
                            width="100%"
                            height={260}
                            style={{ objectFit: 'cover', cursor: 'pointer' }}
                            preview={false}
                        />
                        <CameraOutlined
                            style={{
                                position: 'absolute',
                                top: 120,
                                left: '55%',
                                cursor: 'pointer',
                                color: '#fff',
                                scale: 5,
                            }}
                        />
                    </Upload>
                ) : (
                    <Image
                        src={coverImage || accountInfo?.coverImage || BackgroundPlaceholder}
                        alt="logo"
                        width="100%"
                        height={260}
                        style={{ objectFit: 'cover' }}
                    />
                )}
                <div style={{ position: 'absolute', top: 200, left: 20 }}>
                    {!isEdit ? (
                        <Avatar shape="circle" size={136} src={avatar || accountInfo?.avatar || AvatarPlaceholder} />
                    ) : (
                        <Upload showUploadList={false} accept="image/*" customRequest={uploadAvatar}>
                            <Avatar
                                shape="circle"
                                size={136}
                                src={avatar || accountInfo?.avatar || AvatarPlaceholder}
                                style={{
                                    cursor: 'pointer',
                                }}
                            />
                            <CameraOutlined style={{ position: 'absolute', top: 100, left: 100, cursor: 'pointer' }} />
                        </Upload>
                    )}
                </div>

                {isEdit ? (
                    <Button
                        htmlType="button"
                        variant="outlined"
                        style={{ position: 'absolute', top: 280, right: 20 }}
                        onClick={update}
                    >
                        Save
                    </Button>
                ) : (
                    <Button
                        htmlType="button"
                        variant="outlined"
                        style={{ position: 'absolute', top: 280, right: 20 }}
                        onClick={() => setIsEdit(true)}
                    >
                        Edit Profile
                    </Button>
                )}
            </div>
            <Flex vertical gap={8}>
                <Typography.Title level={4}>{accountInfo?.username}</Typography.Title>
                <Typography.Text type="secondary">{accountInfo?.handle}</Typography.Text>
                {isEdit ? (
                    <Input.TextArea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={4}
                        placeholder="Enter bio here..."
                    />
                ) : (
                    <Typography.Text>{bio || accountInfo?.bio}</Typography.Text>
                )}
                <Flex gap={24}>
                    <Space size="small" onClick={() => navigate(PATHS.FOLLOWING)}>
                        <Typography.Text>{follows?.length}</Typography.Text>
                        <Typography.Text type="secondary">Followings</Typography.Text>
                    </Space>

                    <Space onClick={() => navigate(PATHS.FOLLOWER)}>
                        <Typography.Text>{followers?.length}</Typography.Text>
                        <Typography.Text type="secondary">Followers</Typography.Text>
                    </Space>
                </Flex>
            </Flex>
        </Flex>
    );
};
