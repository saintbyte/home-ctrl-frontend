class AuthService {
    constructor() {
        this.tokenKey = 'authToken';
        this.usernameKey = 'username';
        this.csrfToken = null;
    }

    async initCsrf() {
        try {
            const response = await fetch('/api/v1/auth/csrf', { credentials: 'same-origin' });
            const data = await response.json();
            this.csrfToken = data.csrfToken;
        } catch (error) {
            console.warn('CSRF token fetch failed:', error);
        }
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
        await this.initCsrf();
        
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (this.csrfToken) {
                headers['X-CSRF-Token'] = this.csrfToken;
            }
            
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: headers,
                credentials: 'same-origin',
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