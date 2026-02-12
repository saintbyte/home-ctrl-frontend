class AuthService {
    constructor() {
        this.tokenKey = 'authToken';
        this.usernameKey = 'username';
    }

    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    setUsername(username) {
        localStorage.setItem(this.usernameKey, username);
    }

    getUsername() {
        return localStorage.getItem(this.usernameKey);
    }

    isLoggedIn() {
        return !!this.getToken();
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.usernameKey);
    }

    getAuthHeaders() {
        const token = this.getToken();
        return token ? {
            'Authorization': `Bearer ${token}`
        } : {};
    }

    async login(username, password) {
        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                this.setToken(data.token);
                this.setUsername(data.username);
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.message || 'Неверные учетные данные'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Ошибка соединения с сервером'
            };
        }
    }
}

export const authService = new AuthService();