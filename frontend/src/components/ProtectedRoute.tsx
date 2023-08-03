import * as React from 'react';
import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { User, IdTokenResult } from 'firebase/auth';

interface ProtectedRouteProps {
    user: User;
    token: IdTokenResult;
    claim: string;
    children: ReactElement;
}

export function ProtectedRoute(props: ProtectedRouteProps) {
    if (!props.user || !props.token.claims || props.token.claims[props.claim] !== true)
    {
        return (
            <Navigate to='/' replace/>
        );
    }
    return props.children ;
};