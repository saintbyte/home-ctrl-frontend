import './style.css'
import { LoginForm } from "./loginform/loginform.js";
import { MainView } from "./mainview/mainview.js";
import { authService } from "./auth/auth.js";

function logout() {
    authService.logout();
    location.reload();
}

if (authService.isLoggedIn()) {
    new MainView('app', logout);
} else {
    new LoginForm('app');
}
