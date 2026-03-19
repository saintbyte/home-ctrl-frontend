import './style.css';
import { authService } from '../auth/auth.js';

export class MainView {
    constructor(containerId, onLogout) {
        this.container = document.getElementById(containerId);
        this.onLogout = onLogout;
        this.currentView = 'list';
        this.currentWidget = null;
        this.widgets = [];
        this.render();
        this.loadData();
    }

    async loadData() {
        try {
            const headers = authService.getAuthHeaders();
            const response = await fetch('/api/v1/mainview', {
                headers,
                credentials: 'same-origin'
            });
            
            if (response.status === 401) {
                this.onLogout();
                return;
            }
            
            const data = await response.json();
            this.widgets = data.widgets || [];
            this.renderWidgetsList();
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
                        <button id="backBtn" class="btn-secondary" style="display: none;">← Назад</button>
                        <button id="logoutBtn" class="btn-danger">Выйти</button>
                    </div>
                </header>
                <div class="main-content"></div>
            </div>
        `;
        
        this.setupEventListeners();
    }

    renderWidgetsList() {
        const content = this.container.querySelector('.main-content');
        const backBtn = this.container.querySelector('#backBtn');
        
        backBtn.style.display = 'none';
        this.currentView = 'list';
        
        if (this.widgets.length === 0) {
            content.innerHTML = '<p class="empty-state">Нет доступных виджетов</p>';
            return;
        }

        content.innerHTML = `
            <section class="widgets-section">
                <h2>Виджеты</h2>
                <div class="widgets-grid">
                    ${this.widgets.map(widget => `
                        <div class="widget-card" data-widget="${widget.Name}">
                            <h3 class="widget-title">${this.getWidgetDisplayName(widget.Name)}</h3>
                            <div class="widget-preview" data-widget="${widget.Name}"></div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;

        this.setupWidgetPreview();
    }

    getWidgetDisplayName(name) {
        const names = {
            'clock': 'Часы',
            'network_ips': 'Сетевые IP',
            'weather': 'Погода',
            'calendar': 'Календарь'
        };
        return names[name] || name;
    }

    async setupWidgetPreview() {
        const previews = this.container.querySelectorAll('.widget-preview');
        
        for (const preview of previews) {
            const widgetName = preview.dataset.widget;
            const widgetData = this.widgets.find(w => w.Name === widgetName);
            const widgetComponent = await this.loadWidget(widgetName, 'preview', widgetData);
            if (widgetComponent) {
                preview.innerHTML = widgetComponent;
            }
        }
    }

    async loadWidget(widgetName, mode, data) {
        const widgetMap = {
            'clock': () => import('../widgets/clock/clock.js').then(m => m.render(data, mode)),
            'network_ips': () => import('../widgets/network-ips/network-ips.js').then(m => m.render(data, mode))
        };

        const loader = widgetMap[widgetName];
        if (loader) {
            return await loader();
        }
        return `<p class="widget-unavailable">Виджет "${widgetName}" не найден</p>`;
    }

    async openWidgetDetail(widgetName) {
        const content = this.container.querySelector('.main-content');
        const backBtn = this.container.querySelector('#backBtn');
        const header = this.container.querySelector('.main-header h1');
        
        backBtn.style.display = 'block';
        header.textContent = this.getWidgetDisplayName(widgetName);
        this.currentView = 'detail';
        this.currentWidget = widgetName;

        content.innerHTML = '<div class="widget-detail-loading">Загрузка...</div>';

        const widgetData = this.widgets.find(w => w.Name === widgetName);
        const widgetHtml = await this.loadWidget(widgetName, 'detail', widgetData);
        content.innerHTML = widgetHtml;
    }

    setupEventListeners() {
        this.container.querySelector('#logoutBtn').addEventListener('click', () => {
            this.onLogout();
        });

        this.container.querySelector('#backBtn').addEventListener('click', () => {
            this.renderWidgetsList();
            this.container.querySelector('.main-header h1').textContent = 'Панель управления';
        });

        this.container.querySelectorAll('.widget-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const widgetName = e.currentTarget.dataset.widget;
                this.openWidgetDetail(widgetName);
            });
        });
    }
}
