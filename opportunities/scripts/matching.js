import { backendURL, getToken } from '../../env.config.js';

const badgeStyle = (percent) => {
    if (percent >= 70) return 'background:#1a7f4b;color:#fff;';
    if (percent >= 40) return 'background:#d97706;color:#fff;';
    if (percent > 0) return 'background:#6b7280;color:#fff;';
    return null;
};

const injectBadge = (li, percent) => {
    const style = badgeStyle(percent);
    if (!style) return;

    const badge = document.createElement('span');
    badge.className = 'match-percent-badge';
    badge.setAttribute('style',
        `${style}font-size:0.72rem;font-weight:600;padding:2px 8px;border-radius:12px;display:inline-block;margin-bottom:6px;`
    );
    badge.textContent = `${percent}% Match`;
    li.insertBefore(badge, li.firstChild);
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(backendURL() + '/opportunities/matched', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) return;

        const data = await response.json();
        const scoredOpportunities = data.opportunities || [];
        if (scoredOpportunities.length === 0) return;

        const scoreMap = new Map(
            scoredOpportunities.map(o => [String(o._id), o.matchPercent])
        );

        const orderedIds = scoredOpportunities.map(o => String(o._id));

        const list = document.getElementById('opportunities');
        if (!list) return;

        let debounceTimer = null;

        const decorateAndReorder = () => {
            const items = Array.from(list.querySelectorAll('li'));
            if (items.length === 0) return;

            const liById = new Map();
            items.forEach(li => {
                const btn = li.querySelector('[data-id]');
                if (btn) liById.set(btn.getAttribute('data-id'), li);
            });

            liById.forEach((li, id) => {
                if (!li.querySelector('.match-percent-badge')) {
                    const percent = scoreMap.get(id) ?? 0;
                    injectBadge(li, percent);
                }
            });

            orderedIds.forEach(id => {
                const li = liById.get(id);
                if (li) list.appendChild(li);
            });
        };

        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                decorateAndReorder();
                observer.disconnect();
            }, 100);
        });

        observer.observe(list, { childList: true });
        decorateAndReorder();

    } catch {
        // matching is a progressive enhancement, fail silently
    }
});