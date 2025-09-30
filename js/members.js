function togglePassword() {
    const passwordInput = document.querySelector('input[type="password"]');
    const eyeIcon = document.querySelector('.toggle-password i');
    
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
    const loginForm = document.querySelector('form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.querySelector('input[type="email"]').value;
            const password = document.querySelector('input[type="password"]').value;
            
            if (email && password) {
                localStorage.setItem('user_email', email);
                localStorage.setItem('user_subscription', 'basic');
                window.location.href = 'members-dashboard.html';
            }
        });
    }
});
