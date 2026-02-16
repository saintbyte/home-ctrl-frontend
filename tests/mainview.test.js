import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MainView } from '../src/mainview/mainview.js';

describe('MainView', () => {
  let container;
  let onLogout;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app');
    onLogout = vi.fn();
    
    global.fetch = vi.fn();
  });

  it('should render main view structure', () => {
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ sensors: [], devices: [] })
    });

    new MainView('app', onLogout);

    expect(container.querySelector('.main-view')).toBeTruthy();
    expect(container.querySelector('h1').textContent).toBe('Панель управления');
    expect(container.querySelector('#logoutBtn')).toBeTruthy();
    expect(container.querySelector('#editModeBtn')).toBeTruthy();
  });

  it('should call onLogout when logout button clicked', () => {
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ sensors: [], devices: [] })
    });

    new MainView('app', onLogout);
    container.querySelector('#logoutBtn').click();

    expect(onLogout).toHaveBeenCalled();
  });

  it('should load and display sensors and devices', async () => {
    const mockData = {
      sensors: [
        { id: 1, name: 'Температура', value: 22, unit: '°C' },
        { id: 2, name: 'Влажность', value: 45, unit: '%' }
      ],
      devices: [
        { id: 1, name: 'Свет в гостиной', state: true },
        { id: 2, name: 'Кондиционер', state: false }
      ]
    };

    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockData
    });

    new MainView('app', onLogout);
    await new Promise(r => setTimeout(r, 0));

    const sensorsList = container.querySelector('.sensors-list');
    const devicesList = container.querySelector('.devices-list');

    expect(sensorsList.querySelector('.sensor-name').textContent).toBe('Температура');
    expect(sensorsList.querySelector('.sensor-value').textContent).toBe('22 °C');
    expect(devicesList.querySelector('.device-name').textContent).toBe('Свет в гостиной');
  });

  it('should show device state correctly', async () => {
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ 
        sensors: [], 
        devices: [{ id: 1, name: 'Test', state: true }] 
      })
    });

    new MainView('app', onLogout);
    await new Promise(r => setTimeout(r, 0));

    const stateEl = container.querySelector('.device-state');
    expect(stateEl.classList.contains('on')).toBe(true);
    expect(stateEl.textContent.trim()).toBe('Включено');
  });

  it('should redirect to logout on 401', async () => {
    fetch.mockResolvedValueOnce({
      status: 401,
      json: async () => ({})
    });

    new MainView('app', onLogout);
    await new Promise(r => setTimeout(r, 0));

    expect(onLogout).toHaveBeenCalled();
  });
});
