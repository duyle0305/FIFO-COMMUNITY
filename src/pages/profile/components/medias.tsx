import { Empty, Flex, Image } from 'antd';
import BackgroundPlaceholder from '/public/background-placeholder.svg';
import { useImagesCurrentUser } from '@/hooks/query/image/use-images';

export const Medias = () => {
    const { data } = useImagesCurrentUser();

    return (
        <Flex gap={10} wrap justify="space-between">
            {data && data.length ? (
                data.map((item, index) => (
                    <Image
                        key={index}
                        src={item?.url || BackgroundPlaceholder}
                        alt="placeholder"
                        width={246}
                        height={160}
                        style={{ objectFit: 'cover' }}
                    />
                ))
            ) : (
                <Empty />
            )}
        </Flex>
    );
};
