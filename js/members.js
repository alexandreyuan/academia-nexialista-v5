function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const button = event.target.closest('button');
    const eyeIcon = button ? button.querySelector('i') : null;
    
    if (passwordInput && eyeIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('member-login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Entrando...</span>';
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('user_email', data.email);
                    localStorage.setItem('user_name', data.name);
                    localStorage.setItem('user_subscription', data.subscription_level);
                    localStorage.setItem('user_role', data.role);
                    
                    // Salvar currentUser para compatibilidade com dashboard
                    const currentUser = {
                        email: data.email,
                        name: data.name,
                        subscription: data.subscription_level,
                        role: data.role
                    };
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    window.location.href = 'members-dashboard.html';
                } else {
                    alert(data.error || 'Email ou senha incorretos');
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert('Erro ao conectar com o servidor. Tente novamente.');
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }
});
