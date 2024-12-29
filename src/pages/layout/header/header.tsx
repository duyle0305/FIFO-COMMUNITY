import type { RootState } from '@/stores';

import '../index.less';

import {
    CaretDownFilled,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoneyCollectOutlined,
    UserOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, Badge, Dropdown, Flex, Layout, notification, theme as antTheme, Typography } from 'antd';
import React, { type FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import BackgroundPlaceholder from '/public/background-placeholder.svg';
import Logo from '/public/ftech-logo.svg';
import BaseInput from '@/components/core/input';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, SOCKET_EVENT } from '@/consts/common';
import { bookmarkKeys } from '@/consts/factory/bookmark';
import { commentKeys } from '@/consts/factory/comment';
import { postKeys } from '@/consts/factory/post';
import { upvoteKeys } from '@/consts/factory/upvote';
import { useGetAllComments } from '@/hooks/query/comment/use-comment-by-post';
import { useNotifications } from '@/hooks/query/notification/use-notifications';
import { usePostsListing } from '@/hooks/query/post/use-posts-listing';
import { useUpvoteListing } from '@/hooks/query/upvote/use-upvote-listing';
import { useDebounce } from '@/hooks/use-debounce';
import { loggout } from '@/stores/account';
import { PATHS } from '@/utils/paths';
import { useWebSocket } from '@/utils/socket';

import NotificationIcon from './components/notification';

const { Header } = Layout;

interface HeaderProps {
    collapsed: boolean;
    toggle: () => void;
}

const HeaderComponent: FC<HeaderProps> = ({ collapsed, toggle }) => {
    const { logged, device, accountInfo } = useSelector((state: RootState) => state.account);
    const navigate = useNavigate();
    const token = antTheme.useToken();
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState('  ');
    const [openSearch, setOpenSearch] = useState(false);
    const socket = useWebSocket();
    const queryClient = useQueryClient();

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (title: string, description: string) => {
        api.open({
            message: title,
            description,
        });
    };

    const searchKeyword = useDebounce(keyword, 500);

    // const { data: searchData } = useCategorySearch({
    //     params: {
    //         keyword: searchKeyword || '  ',
    //     },
    // });

    const { data: notifications } = useNotifications();

    const resetKeyword = () => {
        setKeyword('  ');
    };

    const onLogout = async () => {
        localStorage.clear();
        dispatch(loggout());
        navigate(PATHS.SIGNIN);
    };

    const toLogin = () => {
        navigate(PATHS.SIGNIN);
    };

    const toProfile = () => {
        navigate(PATHS.PROFILE);
    };

    const toHome = () => {
        navigate(PATHS.HOME);
    };

    const toWallet = () => {
        navigate(PATHS.WALLET);
    };

    const toDeposit = () => {
        navigate(PATHS.DEPOSIT);
    };

    const handleNavigateWithParams = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            navigate(`${PATHS.SEARCH}?keyword=${keyword}`);
        }
    };

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on(SOCKET_EVENT.COMMENT, () => {
            queryClient.invalidateQueries({
                queryKey: postKeys.listing(),
            });
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.listing(),
            });
        });

        socket.on(SOCKET_EVENT.UPDATE_DELETE_COMMENT, () => {
            queryClient.invalidateQueries({
                queryKey: postKeys.listing(),
            });
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.listing(),
            });
        });

        socket.on(SOCKET_EVENT.LIKE, () => {
            queryClient.invalidateQueries({
                queryKey: upvoteKeys.listing(),
            });
            queryClient.invalidateQueries({
                queryKey: postKeys.listing(),
            });
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.listing(),
            });
        });

        socket.on(SOCKET_EVENT.DISLIKE, () => {
            queryClient.invalidateQueries({
                queryKey: upvoteKeys.listing(),
            });
            queryClient.invalidateQueries({
                queryKey: postKeys.listing(),
            });
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.listing(),
            });
        });

        socket.on(SOCKET_EVENT.NOTIFICATION, data => {
            console.log('notification', data);
        });

        socket.on('disconnect', () => {
            console.log('disconnected');
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    return (
        <Header className="layout-page-header bg-2" style={{ backgroundColor: token.token.colorBgContainer }}>
            {contextHolder}
            {device !== 'MOBILE' && (
                <div className="logo" style={{ width: collapsed ? 80 : 200, cursor: 'pointer' }} onClick={toHome}>
                    <img src={Logo} alt="logo.svg" style={{ marginRight: collapsed ? '2px' : '20px' }} />
                </div>
            )}

            <div className="layout-page-header-main">
                <div onClick={toggle}>
                    {/* <span id="sidebar-trigger">{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span> */}
                </div>

                <div className="search-container">
                    {/* <Dropdown
                        open={false}
                        menu={{
                            items: searchDropdownItems,
                        }}
                    > */}
                    <BaseInput.Search
                        placeholder="Type here to search..."
                        className="search"
                        onChange={e => setKeyword(encodeURIComponent(e.target.value))}
                        // onBlur={() => setOpenSearch(false)}
                        // onFocus={() => setOpenSearch(true)}
                        onKeyDown={handleNavigateWithParams}
                    />
                    {/* </Dropdown> */}
                </div>

                <div className="actions">
                    {logged && accountInfo ? (
                        <Flex gap={20} align="center">
                            <Badge count={notifications?.length}>
                                <NotificationIcon />
                            </Badge>
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: '0',
                                            icon: <WalletOutlined />,
                                            label: <span onClick={toWallet}>Wallet</span>,
                                        },
                                        {
                                            key: '1',
                                            icon: <MoneyCollectOutlined />,
                                            label: <span onClick={toDeposit}>Deposit</span>,
                                        },
                                        {
                                            key: '2',
                                            icon: <UserOutlined />,
                                            label: <span onClick={toProfile}>Profile</span>,
                                        },
                                        {
                                            key: '3',
                                            icon: <LogoutOutlined />,
                                            label: <span onClick={onLogout}>Logout</span>,
                                        },
                                    ],
                                }}
                            >
                                <span className="user-action">
                                    <Flex align="center" gap={5}>
                                        <Avatar
                                            size={42}
                                            src={accountInfo?.avatar || BackgroundPlaceholder}
                                            className="user-avator"
                                            alt="avator"
                                        />
                                        <Typography.Text style={{ fontWeight: 500 }}>
                                            {accountInfo.username}
                                        </Typography.Text>
                                        <CaretDownFilled />
                                    </Flex>
                                </span>
                            </Dropdown>
                        </Flex>
                    ) : (
                        <span style={{ cursor: 'pointer' }} onClick={toLogin}>
                            Login
                        </span>
                    )}
                </div>
            </div>
        </Header>
    );
};

export default HeaderComponent;
