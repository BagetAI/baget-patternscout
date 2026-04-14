document.addEventListener('DOMContentLoaded', () => {
    // 1. LEAD CAPTURE
    const form = document.getElementById('waitlist-form');
    const messageDiv = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            submitBtn.disabled = true;
            submitBtn.textContent = 'WAITING...';

            try {
                // Primary Lead Storage
                await fetch('https://baget.ai/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        companyId: '6e941a19-a18c-44e2-8bb2-ab5cf06f7f16',
                        email: email
                    }),
                });

                messageDiv.textContent = 'WELCOME TO THE INTEGRITY LAYER.';
                messageDiv.style.color = 'var(--black)';
                form.reset();
            } catch (error) {
                messageDiv.textContent = 'SYSTEM ERROR. PLEASE TRY AGAIN.';
                messageDiv.style.color = 'var(--accent)';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ACCESS BETA';
            }
        });
    }

    // 2. DYNAMIC DATABASE FEED
    const fetchDetections = async () => {
        const dbId = '1d2babb7-b15e-4417-b1d0-bed78766cfa9';
        const feedContainer = document.getElementById('patterns-database');
        
        try {
            const response = await fetch(`https://baget.ai/api/public/databases/${dbId}/rows`);
            if (!response.ok) throw new Error('Database fetch failed');
            const data = await response.json();
            
            if (data && data.length > 0) {
                feedContainer.innerHTML = '';
                data.forEach(row => {
                    const card = document.createElement('div');
                    card.className = 'pattern-card';
                    card.innerHTML = `
                        <div class="card-type">${row.pattern_type || 'UNKNOWN PATTERN'}</div>
                        <div class="card-site">${row.site_name || 'N/A'}</div>
                        <p class="card-desc">${row.description || 'Deceptive UI pattern detected.'}</p>
                        <div class="card-severity">${row.severity || 'MEDIUM'} SEVERITY</div>
                    `;
                    feedContainer.appendChild(card);
                });
            } else {
                // Fallback / Seed Data if DB is empty
                seedFallbackData(feedContainer);
            }
        } catch (error) {
            console.error('Error fetching patterns:', error);
            seedFallbackData(feedContainer);
        }
    };

    const seedFallbackData = (container) => {
        const fallbacks = [
            { type: 'ROACH MOTEL', site: 'NYTimes.com', desc: 'Hidden subscription cancellation path buried 4 layers deep.', severity: 'HIGH' },
            { type: 'DRIP PRICING', site: 'Airbnb.com', desc: 'Final price increased by 40% at the last stage of checkout.', severity: 'MEDIUM' },
            { type: 'FALSE URGENCY', site: 'Shein.com', desc: 'Fake countdown timer detected on product detail page.', severity: 'HIGH' }
        ];
        
        container.innerHTML = '';
        fallbacks.forEach(item => {
            const card = document.createElement('div');
            card.className = 'pattern-card';
            card.innerHTML = `
                <div class="card-type">${item.type}</div>
                <div class="card-site">${item.site}</div>
                <p class="card-desc">${item.desc}</p>
                <div class="card-severity">${item.severity} SEVERITY</div>
            `;
            container.appendChild(card);
        });
    };

    fetchDetections();

    // 3. SCROLL ANIMATIONS
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-title h2, .feed-header h2').forEach(h2 => {
        h2.style.opacity = '0';
        h2.style.transform = 'translateY(30px)';
        h2.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(h2);
    });
});