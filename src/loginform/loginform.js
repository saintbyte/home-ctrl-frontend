import './style.css'
import { authService } from '../auth/auth.js'
export class LoginForm {

    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
      <div class="auth-form">
        <h1>Авторизация</h1>
        <form id="loginForm">
          <div class="form-group">
            <label for="login">Имя пользователя:</label>
            <input type="text" id="login" name="login" required autocomplete="true">
          </div>
          <div class="form-group">
            <label for="password">Пароль:</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit">Войти</button>
        </form>
      </div>
    `;
    }

    setupEventListeners() {
        this.container.querySelector('#loginForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const login = this.container.querySelector('#login').value;
            const password = this.container.querySelector('#password').value;

            if (!login || !password) {
                alert('Пожалуйста, заполните все поля!');
                return;
            }

            this.handleSubmit(login, password);
        });
    }

    async handleSubmit(login, password) {
        const result = await authService.login(login, password);

        if (result.success) {
            alert(`Авторизация пользователя ${result.data.username} прошла успешно!`);
            console.log('Token:', result.data.token);
        } else {
            alert('Ошибка авторизации: ' + result.error);
        }
    }
}