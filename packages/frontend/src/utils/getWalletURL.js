import { IS_MAINNET, SHOW_PRERELEASE_WARNING, NEAR_WALLET_ENV } from '../config';
import { isWhitelabel } from '../config/whitelabel';

const getNearOrgWalletUrl = (https = true) => {
    let networkName = '';

    if (SHOW_PRERELEASE_WARNING) {
        networkName = 'staging.';
    } else if (!IS_MAINNET) {
        networkName = 'testnet.';
    }

    return `${https ? 'https://' : ''}wallet.${networkName}near.org`;
};

const getMyNearWalletUrl = (https = true) => {
    const prefix = {
        'testnet': 'testnet.',
        'mainnet': 'app.',
        'development': 'testnet.',
        'mainnet_STAGING': 'staging.'
    }[NEAR_WALLET_ENV];

    return `${https ? 'https://' : ''}${prefix || ''}mynearwallet.com`;
};

export default isWhitelabel() ? getMyNearWalletUrl : getNearOrgWalletUrl;
