import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import axios from 'axios';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

const baseUrl = '/api/users';

export type ParsedUserRecord = {
    uid: string;
    email: string;
    admin: boolean;
    superAdmin: boolean;
}

const fetchUserCountHook = (user: User) => {
    const [count, setCount] = useState<number>(-1);
    if (user)
    {
        useEffect(() => {
            user.getIdToken(false).then((token) => {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                axios.get(`${baseUrl}/count`, config).then((response) => {
                    setCount(response.data);
                }).catch((err) => {
                    console.error(err);
                });
            });        
        }, []);
    }
    return count;
}

const fetchUsersHook = (user: User): [Array<UserRecord>, React.Dispatch<React.SetStateAction<Array<UserRecord>>>] => {
    const [users, setUsers] = useState<Array<UserRecord>>([]);
    if (user)
    {
        useEffect(() => {
            user.getIdToken(false).then((token) => {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                axios.get(`${baseUrl}`, config).then((response) => {
                    setUsers(response.data);
                }).catch((err) => {
                    console.error(err);
                });
            });        
        }, []);
    }
    else
    {
        console.error('No logged in user');
    }
    return [users, setUsers];
}

const updateUserClaims = (user: User, updatedUser: ParsedUserRecord): Promise<ParsedUserRecord | null> => {
    return new Promise<ParsedUserRecord | null>((resolve, reject) => {
        if (user) {
            user.getIdToken(false).then((token) => {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const superAdmin = updatedUser.superAdmin === true || `${updatedUser.superAdmin}`.toLowerCase() === 'true';
                const admin = updatedUser.admin === true || `${updatedUser.admin}`.toLowerCase() === 'true';
                axios.put(`${baseUrl}/${updatedUser.uid}`, { SuperAdmin: superAdmin, Admin: admin }, config).then((response) => {
                    resolve({uid: response.data.uid, email: response.data.email, superAdmin: response.data.customClaims.SuperAdmin, admin: response.data.customClaims.Admin});
                }).catch((err) => {
                    reject(err);
                });
            })
        }
        else
        {
            reject('No logged in user');
        }
    });
}

export {
    fetchUserCountHook,
    fetchUsersHook,
    updateUserClaims
}