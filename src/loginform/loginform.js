import './style.css'
export class Loginform {

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
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
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
            const email = this.container.querySelector('#email').value;
            const password = this.container.querySelector('#password').value;

            if (!email || !password) {
                alert('Пожалуйста, заполните все поля!');
                return;
            }

            this.handleSubmit(email, password);
        });
    }

    handleSubmit(email, password) {
        // Здесь можно добавить логику отправки данных на сервер
        console.log('Email:', email);
        console.log('Password:', password);
        alert(`Авторизация для ${email} прошла успешно!`);
    }
}