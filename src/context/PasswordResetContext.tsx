import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

interface PasswordResetState {
    email: string | null
    challengeId: string | null;
    resetToken: string | null;
    expiresAt: string | null;
    resendAvailableAt: string | null;
    otpSuccessMessage: string
}

interface PasswordResetContextValue extends PasswordResetState {
    setChallenge: (
        email: string,
        challengeId: string,
        expiresAt: string,
        resendAvailableAt: string
    ) => void;
    setResetToken: (resetToken: string) => void;
    setOtpSuccessMessage: (message: string) => void;
    clearResetFlow: () => void;
}

const PasswordResetContext =
    createContext<PasswordResetContextValue | undefined>(undefined);

const initialState: PasswordResetState = {
    email: null,
    challengeId: null,
    resetToken: null,
    expiresAt: null,
    resendAvailableAt: null,
    otpSuccessMessage: ""
};

export const PasswordResetProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [state, setState] =
        useState<PasswordResetState>(initialState);

    const setChallenge = useCallback(
        (
            email: string,
            challengeId: string,
            expiresAt: string,
            resendAvailableAt: string
        ) => {
            setState({
                email,
                challengeId,
                resetToken: null,
                expiresAt,
                resendAvailableAt,
                otpSuccessMessage: "",
            });
        },
        []
    );

    const setResetToken = useCallback((resetToken: string) => {
        setState((previous) => ({
            ...previous,
            resetToken,
        }));
    }, []);


    const setOtpSuccessMessage = useCallback((message: string) => {
        setState((previous) => ({
            ...previous,
            otpSuccessMessage: message
        }))
    }, [])


    const clearResetFlow = useCallback(() => {
        setState(initialState);
    }, []);

    const value = useMemo(
        () => ({
            ...state,
            setChallenge,
            setResetToken,
            setOtpSuccessMessage,
            clearResetFlow,
        }),
        [state, setChallenge, setResetToken, clearResetFlow, setOtpSuccessMessage]
    );

    return (
        <PasswordResetContext.Provider value={value}>
            {children}
        </PasswordResetContext.Provider>
    );
};

export const usePasswordReset = () => {
    const context = useContext(PasswordResetContext);

    if (!context) {
        throw new Error(
            "usePasswordReset must be used within PasswordResetProvider"
        );
    }

    return context;
};