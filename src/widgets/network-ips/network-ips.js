import { authService } from '../../auth/auth.js';

export async function render(data, mode) {
    if (mode === 'preview') {
        return `
            <div class="widget-network-preview">
                <span class="network-icon">🌐</span>
                <span>IP адреса</span>
            </div>
        `;
    }

    let ipsContent = '<div class="loading">Загрузка...</div>';
    
    try {
        const headers = authService.getAuthHeaders();
        const response = await fetch('/api/v1/widgets/network_ips', {
            headers,
            credentials: 'same-origin'
        });
        
        if (response.ok) {
            const ips = await response.json();
            ipsContent = `
                <div class="network-ips-list">
                    ${ips.map(ip => `
                        <div class="ip-item">
                            <span class="ip-label">${ip.interface || 'Unknown'}</span>
                            <span class="ip-value">${ip.address}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            ipsContent = '<p class="error">Не удалось загрузить IP адреса</p>';
        }
    } catch (error) {
        ipsContent = '<p class="error">Ошибка загрузки данных</p>';
    }

    return `
        <div class="widget-detail widget-network-detail">
            <h3>Сетевые интерфейсы</h3>
            ${ipsContent}
            <button class="btn-refresh" onclick="location.reload()">Обновить</button>
        </div>
    `;
}
