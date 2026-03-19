export async function render(data, mode) {
    const format = data?.Params?.format || '24h';
    const timezone = data?.Params?.timezone || 'local';

    if (mode === 'preview') {
        return `
            <div class="widget-clock-preview">
                <span class="clock-icon">🕐</span>
                <span>${format === '12h' ? '12-часовой' : '24-часовой'}</span>
            </div>
        `;
    }

    return `
        <div class="widget-detail widget-clock-detail">
            <div class="clock-display" id="clockDisplay">--:--:--</div>
            <div class="clock-info">
                <span>Формат: ${format === '12h' ? '12 часов' : '24 часа'}</span>
                <span>Часовой пояс: ${timezone}</span>
            </div>
        </div>
        <script>
            (function() {
                function updateClock() {
                    const now = new Date();
                    let hours = now.getHours();
                    const is12h = '${format}' === '12h';
                    
                    if (is12h) {
                        const ampm = hours >= 12 ? ' PM' : ' AM';
                        hours = hours % 12 || 12;
                        document.getElementById('clockDisplay').textContent = 
                            hours + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + 
                            String(now.getSeconds()).padStart(2, '0') + ampm;
                    } else {
                        document.getElementById('clockDisplay').textContent = 
                            String(hours).padStart(2, '0') + ':' + 
                            String(now.getMinutes()).padStart(2, '0') + ':' + 
                            String(now.getSeconds()).padStart(2, '0');
                    }
                }
                updateClock();
                setInterval(updateClock, 1000);
            })();
        </script>
    `;
}
