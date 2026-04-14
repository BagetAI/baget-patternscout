document.addEventListener('DOMContentLoaded', () => {
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
                const response = await fetch('https://baget.ai/api/leads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        companyId: '6e941a19-a18c-44e2-8bb2-ab5cf06f7f16',
                        email: email
                    }),
                });

                if (response.ok) {
                    messageDiv.textContent = 'WELCOME TO THE INTEGRITY LAYER.';
                    messageDiv.style.color = 'var(--black)';
                    form.reset();
                } else {
                    throw new Error('Failed to submit');
                }
            } catch (error) {
                messageDiv.textContent = 'SYSTEM ERROR. PLEASE TRY AGAIN.';
                messageDiv.style.color = 'var(--accent)';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ACCESS BETA';
            }
        });
    }

    // Simple scroll animation for headers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-title h2').forEach(h2 => {
        h2.style.opacity = '0';
        h2.style.transform = 'translateY(20px)';
        h2.style.transition = 'all 0.6s ease-out';
        observer.observe(h2);
    });
});