import './style.css'
import { LoginForm } from "./loginform/loginform.js";
import { MainView } from "./mainview/mainview.js";
import { authService } from "./auth/auth.js";

function logout() {
    authService.logout();
    location.reload();
}

function showMainView() {
    new MainView('app', logout);
}

if (authService.isLoggedIn()) {
    showMainView();
} else {
    new LoginForm('app', showMainView);
}
