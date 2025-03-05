'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '@/lib/keycloak';
import { ReactNode } from 'react';

interface KeycloakContextType {
    keycloak: typeof keycloak;
    authenticated: boolean;
}

const KeycloakContext = createContext<KeycloakContextType>({
    keycloak,
    authenticated: false,
});

export const useKeycloak = () => useContext(KeycloakContext);

interface KeycloakProviderProps {
    children: ReactNode;
}

export default function KeycloakProvider({ children }: KeycloakProviderProps) {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        keycloak
            .init({
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            })
            .then((auth) => {
                setAuthenticated(auth);
            })
            .catch((error) => {
                console.error('Failed to initialize Keycloak:', error);
            });
    }, []);

    return (
        <KeycloakContext.Provider value={{ keycloak, authenticated }}>
            {children}
        </KeycloakContext.Provider>
    );
} 