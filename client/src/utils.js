export const AUTH_TOKEN = 'auth-token';
export const USER_ID = 'user-id';
export const TIMESTAMP = 'timestamp';

export const saveToken = (token) => {
    return localStorage.setItem(AUTH_TOKEN, token);
}

export const saveUserId = (id) => {
    return localStorage.setItem(USER_ID, id);
}

export const saveTimestamp = () => {
    return localStorage.setItem(TIMESTAMP, new Date());
}

export const removeToken = () => {
    return localStorage.removeItem(AUTH_TOKEN);
}

export const removeUserId = () => {
    return localStorage.removeItem(USER_ID);
}

export const removeTimestamp = () => {
    return localStorage.removeItem(TIMESTAMP);
}

export const handleEnter = (e, fn) => {
    if (e.key === 'Enter') {
        fn();
    }
}