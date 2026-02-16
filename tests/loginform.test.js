import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginForm } from '../src/loginform/loginform.js';

describe('LoginForm', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app');
    global.alert = vi.fn();
  });

  it('should render login form', () => {
    new LoginForm('app');
    
    expect(container.querySelector('#loginForm')).toBeTruthy();
    expect(container.querySelector('#login')).toBeTruthy();
    expect(container.querySelector('#password')).toBeTruthy();
    expect(container.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should show alert when fields are empty', () => {
    const form = new LoginForm('app');
    const submitEvent = new Event('submit');
    form.container.querySelector('#loginForm').dispatchEvent(submitEvent);

    expect(global.alert).toHaveBeenCalledWith('Пожалуйста, заполните все поля!');
  });
});
