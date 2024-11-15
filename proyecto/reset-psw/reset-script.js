// reset-script.js

// Manejar envío del formulario de restablecimiento (reset-password.html)
const resetForm = document.getElementById('reset-form');
const resetEmailInput = document.getElementById('reset-email');
const resetMessage = document.getElementById('reset-message');

if (resetForm) { 
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = resetEmailInput.value;
        const user = JSON.parse(localStorage.getItem(email));

        if (user) {
            // Generar un token aleatorio
            const token = Math.random().toString(36).substring(2, 15);

            // Guardar el token en el usuario (temporalmente)
            user.resetToken = token;
            localStorage.setItem(email, JSON.stringify(user));

            // Mostrar el token al usuario (en un escenario real, se enviaría por correo electrónico)
            alert(`Tu token de restablecimiento es: ${token}`);

            // Guardar el email en localStorage antes de redirigir
            localStorage.setItem('resetEmail', email); 

            // Redirigir a la página para ingresar el token
            window.location.href = "token.html"; 
        } else {
            resetMessage.textContent = 'El correo electrónico no está registrado.';
        }
    });
}

// Manejar envío del formulario de token (token.html)
const tokenForm = document.getElementById('token-form');
const tokenInput = document.getElementById('token-input');
const tokenMessage = document.getElementById('token-message');

if (tokenForm) {
    tokenForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const token = tokenInput.value;
        const email = localStorage.getItem('resetEmail');
        const user = JSON.parse(localStorage.getItem(email));

        if (user && user.resetToken === token) {
            // Redirigir a la página para ingresar la nueva contraseña
            localStorage.setItem('resetEmail', email); // Pasar el email a la siguiente página
            window.location.href = "reset-psw2.html"; 
        } else {
            tokenMessage.textContent = 'Token inválido.';
        }
    });
}

// Manejar envío del formulario de nueva contraseña (reset-psw2.html)
const newPasswordForm = document.getElementById('new-password-form');
const newPassword1Input = document.getElementById('new-password1');
const newPassword2Input = document.getElementById('new-password2');
const newPasswordMessage = document.getElementById('new-password-message');

if (newPasswordForm) {
    newPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newPassword1 = newPassword1Input.value;
        const newPassword2 = newPassword2Input.value;
        
        const email = localStorage.getItem('resetEmail');
        const user = JSON.parse(localStorage.getItem(email));

        if (newPassword1 === newPassword2) {
            // Actualizar la contraseña del usuario
            user.password = newPassword1;
            delete user.resetToken; // Eliminar el token de restablecimiento
            localStorage.setItem(email, JSON.stringify(user));

            // Mostrar mensaje de éxito y redirigir al login
            newPasswordMessage.textContent = 'Contraseña actualizada correctamente.';
            setTimeout(() => {
                window.location.href = "../login/login.html"; 
            }, 3000);
        } else {
            newPasswordMessage.textContent = 'Las contraseñas no coinciden.';
        }
    });
}