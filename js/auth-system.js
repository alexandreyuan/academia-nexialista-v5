window.NexialistaAuth = {
    isLoggedIn: function() {
        return localStorage.getItem('user_email') !== null;
    },
    
    isAdmin: function() {
        const email = localStorage.getItem('user_email');
        const adminEmails = ['admin@nexialista.com', 'yuan@apxconsultoria.com'];
        return adminEmails.includes(email);
    },
    
    getUserSubscription: function() {
        return localStorage.getItem('user_subscription') || 'basic';
    },
    
    logout: function() {
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_subscription');
        window.location.href = 'members.html';
    }
};
