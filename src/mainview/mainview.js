import './style.css';
import { authService } from '../auth/auth.js';

export class MainView {
    constructor(containerId, onLogout) {
        this.container = document.getElementById(containerId);
        this.onLogout = onLogout;
        this.isEditMode = false;
        this.devices = [];
        this.sensors = [];
        this.render();
        this.loadData();
    }

    async loadData() {
        try {
            const headers = authService.getAuthHeaders();
            const response = await fetch('/api/v1/main', {
                headers,
                credentials: 'same-origin'
            });
            
            if (response.status === 401) {
                this.onLogout();
                return;
            }
            
            const data = await response.json();
            this.devices = data.devices || [];
            this.sensors = data.sensors || [];
            this.renderData();
        } catch (error) {
            console.error('Failed to load data:', error);
            this.container.querySelector('.main-content').innerHTML = 
                '<p class="error">Ошибка загрузки данных</p>';
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="main-view">
                <header class="main-header">
                    <h1>Панель управления</h1>
                    <div class="header-actions">
                        <button id="editModeBtn" class="btn-secondary">Редактировать</button>
                        <button id="logoutBtn" class="btn-danger">Выйти</button>
                    </div>
                </header>
                <div class="main-content">
                    <section class="sensors-section">
                        <h2>Датчики</h2>
                        <div class="sensors-list"></div>
                    </section>
                    <section class="devices-section">
                        <h2>Устройства</h2>
                        <div class="devices-list"></div>
                    </section>
                </div>
            </div>
        `;
        
        this.setupEventListeners();
    }

    renderData() {
        const sensorsList = this.container.querySelector('.sensors-list');
        const devicesList = this.container.querySelector('.devices-list');
        
        sensorsList.innerHTML = this.sensors.map(sensor => `
            <div class="sensor-item ${this.isEditMode ? 'edit-mode' : ''}" data-id="${sensor.id}">
                <span class="sensor-name">${sensor.name}</span>
                <span class="sensor-value">${sensor.value} ${sensor.unit || ''}</span>
                ${this.isEditMode ? `<button class="btn-edit" data-type="sensor" data-id="${sensor.id}">Изменить</button>` : ''}
            </div>
        `).join('') || '<p>Нет данных с датчиков</p>';

        devicesList.innerHTML = this.devices.map(device => `
            <div class="device-item ${this.isEditMode ? 'edit-mode' : ''}" data-id="${device.id}">
                <span class="device-name">${device.name}</span>
                <span class="device-state ${device.state ? 'on' : 'off'}">
                    ${device.state ? 'Включено' : 'Выключено'}
                </span>
                ${!this.isEditMode ? `
                    <button class="btn-toggle" data-id="${device.id}">
                        ${device.state ? 'Выключить' : 'Включить'}
                    </button>
                ` : `
                    <button class="btn-edit" data-type="device" data-id="${device.id}">Изменить</button>
                `}
            </div>
        `).join('') || '<p>Нет устройств</p>';
    }

    setupEventListeners() {
        this.container.querySelector('#logoutBtn').addEventListener('click', () => {
            this.onLogout();
        });

        this.container.querySelector('#editModeBtn').addEventListener('click', () => {
            this.isEditMode = !this.isEditMode;
            this.renderData();
            this.setupEventListeners();
        });

        this.container.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const deviceId = e.target.dataset.id;
                this.toggleDevice(deviceId);
            });
        });

        this.container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                const id = e.target.dataset.id;
                this.openEditModal(type, id);
            });
        });
    }

    async toggleDevice(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        try {
            const headers = {
                ...authService.getAuthHeaders(),
                'Content-Type': 'application/json'
            };
            
            await fetch(`/api/v1/devices/${deviceId}/toggle`, {
                method: 'POST',
                headers,
                credentials: 'same-origin'
            });
            
            device.state = !device.state;
            this.renderData();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to toggle device:', error);
        }
    }

    openEditModal(type, id) {
        const item = type === 'sensor' 
            ? this.sensors.find(s => s.id === id)
            : this.devices.find(d => d.id === id);
        
        if (!item) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <h3>Редактирование ${type === 'sensor' ? 'датчика' : 'устройства'}</h3>
                <form id="editForm">
                    <div class="form-group">
                        <label>Название:</label>
                        <input type="text" name="name" value="${item.name}" required>
                    </div>
                    ${type === 'sensor' ? `
                        <div class="form-group">
                            <label>Значение:</label>
                            <input type="number" name="value" value="${item.value}" required>
                        </div>
                    ` : `
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="state" ${item.state ? 'checked' : ''}>
                                Включено
                            </label>
                        </div>
                    `}
                    <div class="modal-actions">
                        <button type="submit" class="btn-primary">Сохранить</button>
                        <button type="button" class="btn-secondary" id="cancelBtn">Отмена</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#cancelBtn').addEventListener('click', () => modal.remove());
        
        modal.querySelector('#editForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const updates = { name: formData.get('name') };
            if (type === 'sensor') {
                updates.value = parseFloat(formData.get('value'));
            } else {
                updates.state = formData.has('state');
            }

            await this.saveItem(type, id, updates);
            modal.remove();
        });
    }

    async saveItem(type, id, updates) {
        try {
            const endpoint = type === 'sensor' 
                ? `/api/v1/sensors/${id}` 
                : `/api/v1/devices/${id}`;
            
            const headers = {
                ...authService.getAuthHeaders(),
                'Content-Type': 'application/json'
            };

            await fetch(endpoint, {
                method: 'PUT',
                headers,
                credentials: 'same-origin',
                body: JSON.stringify(updates)
            });

            await this.loadData();
        } catch (error) {
            console.error('Failed to save:', error);
        }
    }
}
