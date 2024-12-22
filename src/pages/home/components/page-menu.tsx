import type { RootState } from '@/stores';
import type { GetProp, MenuProps } from 'antd';

import Icon from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import BookMarkSvg from '/public/bookmark.svg';
import HomeSvg from '/public/home.svg';
import ExploreSvg from '/public/source-code.svg';
import BaseMenu from '@/components/core/menu';
import { setAccountState } from '@/stores/account';
import { PATHS } from '@/utils/paths';

type MenuItem = GetProp<MenuProps, 'items'>[number];

export const PageMenu = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedKeys = useSelector((state: RootState) => state.account.selectedKeys);
    const location = useLocation();

    useEffect(() => {
        const selectedItems = document.getElementsByClassName('ant-menu-item-selected');

        Array.from(selectedItems).forEach(item => {
            if (item.getAttribute('title') !== location.pathname) {
                item.classList.remove('ant-menu-item-selected');
            }
        });
    }, [location]);

    const items: MenuItem[] = [
        {
            key: PATHS.HOME,
            icon: <Icon component={() => <img src={HomeSvg} alt="home" />} />,
            label: 'Home',
            title: PATHS.HOME,
            onClick: () => navigate(PATHS.HOME),
        },
        {
            key: PATHS.BOOKMARKS,
            icon: <Icon component={() => <img src={BookMarkSvg} alt="bookmark" />} />,
            label: 'Bookmark',
            onClick: () => navigate(PATHS.BOOKMARKS),
        },
        {
            key: 'explore',
            icon: <Icon component={() => <img src={ExploreSvg} alt="explore" />} />,
            label: 'Source Code & Download',
        },
    ];

    const onChangeSelectedKey = (path: string) => {
        dispatch(setAccountState({ selectedKeys: [path] }));
    };

    const onMenuClick = (path: string) => {
        onChangeSelectedKey(path);
        navigate(path);
    };

    return (
        <>
            <BaseMenu items={items} selectedKeys={selectedKeys} onSelect={k => onMenuClick(k.key)} />
        </>
    );
};
