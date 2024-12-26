import type { FC } from 'react';

import { css } from '@emotion/react';
import { Flex, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { SuccessfulIcon } from '@/utils/asset';

import BaseButton from '../core/button';
import AuthFormDescription from './form-desciption';
import AuthFormTitle from './form-title';

interface AuthResultPageProps {
    title?: string;
    description?: string;
    btnNavigateTo?: string;
    btnText?: string;
    icon?: string;
}

const AuthResultPage: FC<AuthResultPageProps> = ({ title, description, btnNavigateTo, btnText, icon }) => {
    return (
        <div css={styles}>
            <Flex vertical align="center" style={{ width: '100%' }}>
                {icon && <img className="result-success-icon" src={icon} alt="Success Icon" />}

                {title && (
                    <div className="result-title">
                        <AuthFormTitle title={title} />
                    </div>
                )}

                {description && (
                    <div className="result-description">
                        <AuthFormDescription description={description} />
                    </div>
                )}

                {btnNavigateTo && btnText && (
                    <Link className="result-btn" to={btnNavigateTo}>
                        <BaseButton
                            size="large"
                            variant="outlined"
                            shape="round"
                            type="primary"
                            style={{ width: '250px' }}
                        >
                            {btnText}
                        </BaseButton>
                    </Link>
                )}
            </Flex>
        </div>
    );
};

const styles = css(`
    .result-success-icon {
        margin-bottom: 40px;
    }

    .result-btn-wrapper {  /* <-- Style the wrapper */
        width: fit-content;      /* <-- Allow button to shrink to text content */
        margin: 40px auto 0; /* <-- Center the button */
    }

    .result-title {
        display: block;
        margin-bottom: 10px !important;
        width: fit-content; /* <-- Make title take only necessary width */
        margin: 0 auto 10px; /* <-- Center the title */
    }

    .result-btn {
        margin-top: 40px;
        width: fit-content;
    
    }
    
`);

export default AuthResultPage;
