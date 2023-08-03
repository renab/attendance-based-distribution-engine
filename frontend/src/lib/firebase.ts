import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    IdTokenResult,
    User
} from "firebase/auth";

import {
    getFirestore,
    collection,
    addDoc
} from "firebase/firestore";

import {useState, useEffect, createContext } from 'react';

interface IAuthContext {
    user: User | null;
    token: IdTokenResult | null;
    setUser: (user: User | null) => void;
    setToken: (token: IdTokenResult | null) => void;
}

const AuthContext = createContext<IAuthContext>({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {}
});

const firebaseConfig = {
    apiKey: "AIzaSyBHzT71nwPvxiimFuhhIhfG2ILOdB1tzvk",
    authDomain: "attendance-based-distribution.firebaseapp.com",
    projectId: "attendance-based-distribution",
    storageBucket: "attendance-based-distribution.appspot.com",
    messagingSenderId: "1046625301742",
    appId: "1:1046625301742:web:2f5284605cd074dd63afff",
    measurementId: "G-JHNPKR2L5Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        // do nothing
    }
};

const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
    } catch (err) {
        console.error(err);
        alert((err as Error).message);
    }
};

const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert((err as Error).message);
    }
};

const logout = () => {
    signOut(auth);
};

const authenticatedHook = () => {
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setAuthenticated(true);
            }
        });
    }, []);
    return isAuthenticated;
};

const useFirebaseTokenResultHook = () => {
    const [token, setToken] = useState<IdTokenResult | null>(null);
    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                user.getIdTokenResult(false).then(latestToken => setToken(latestToken)).catch(err => console.error(err));
            }
        })
    }, []);
    return token;
}

export {
    app,
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    useFirebaseTokenResultHook,
    AuthContext,
    authenticatedHook
};