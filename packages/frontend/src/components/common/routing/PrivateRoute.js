import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Route, withRouter, Redirect } from 'react-router-dom';

import { selectAccountSlice } from '../../../redux/slices/account';
import { selectDerivedPassword } from '../../../redux/slices/passwordEncryption/passwordEncryptionSlice';
import { selectStatusLocalAlert } from '../../../redux/slices/status';
import { getEncryptedData } from '../../../utils/localStorage';
import { KEY_ACTIVE_ACCOUNT_ID } from '../../../utils/wallet';
import { SetPasswordPage } from '../../accounts/password_encryption/SetPasswordPage';
import { UnlockWalletPage } from '../../accounts/password_encryption/UnlockWalletPage';
import NoIndexMetaTag from '../NoIndexMetaTag';

// PrivateRoute is for logged-in users only and will redirect to the guest landing page if there's no active account

const PrivateRoute = ({
    component: Component,
    render,
    account,
    indexBySearchEngines,
    ...rest
}) => {
    const hasAnyAccount = !!localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID);
    const [isAccountEncrypted, setIsAccountEncrypted] = useState(!!getEncryptedData());
    const isAccountUnlocked = !!useSelector(selectDerivedPassword);
    return (
        <>
            {!indexBySearchEngines && <NoIndexMetaTag />}
            <Route
                {...rest}
                render={(props) => {
                    // Step 1: Check if there's any account created/imported at all
                    if (!localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID)) {
                        return (
                            <Redirect
                                to={{
                                    pathname: '/',
                                }}
                            />
                        );
                    }

                    // Step 1: This is a totally new account, redirect them to Setup Password
                    if (!hasAnyAccount && !isAccountEncrypted) {
                        return (
                            <SetPasswordPage
                                uponSetPassword={() => {
                                    setIsAccountEncrypted(true);
                                }}
                            />
                        );

                        // Step 2: Account exists and opted password encryption but not unlocked yet, need to prompt user to insert password
                    } else if (isAccountEncrypted && !isAccountUnlocked) {
                        return <UnlockWalletPage uponUnlock={() => {}} />;
                    }

                    // Step 3: <Route component> takes precedence over <Route render></Route>
                    if (Component) {
                        return <Component {...props} />;
                    }

                    // Step 4: Render prop comes the last
                    if (render) {
                        return render(props);
                    }

                    return <></>;
                }}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    account: selectAccountSlice(state),
    localAlert: selectStatusLocalAlert(state),
});

export default withRouter(connect(mapStateToProps)(PrivateRoute));
