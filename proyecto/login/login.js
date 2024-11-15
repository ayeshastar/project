import { validarCampo, emailRegex, passwordRegex, estadoValidacionCampos } from "./register.js";

const formLogin = document.querySelector(".form-login");
const inputPass = document.querySelector('.form-login input[type="password"]');
const inputEmail = document.querySelector('.form-login input[type="email"]');
const alertaErrorLogin = document.querySelector(".form-login .alerta-error");
const alertaExitoLogin = document.querySelector(".form-login .alerta-exito");

// Usuarios
const users = {
    "admin": {
        email: "admin@example.com",
        password: "admin123",
        type: "admin"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    formLogin.addEventListener("submit", (e) => {
        estadoValidacionCampos.userName = true;
        e.preventDefault();
        enviarFormulario(formLogin, alertaErrorLogin, alertaExitoLogin);
    });

    inputEmail.addEventListener("input", () => {
        validarCampo(emailRegex, inputEmail, "El correo solo puede contener letras, números, puntos, guiones y guíon bajo.");
    });

    inputPass.addEventListener("input", () => {
        validarCampo(passwordRegex, inputPass, "La contraseña tiene que ser de 4 a 12 dígitos");
    });
});

export function enviarFormulario(form, alertaError, alertaExito) {
    const email = form.userEmail.value;
    const password = form.userPassword.value;

    // Buscar al usuario en localStorage
    let user = JSON.parse(localStorage.getItem(email));

    // Si no se encuentra en localStorage, buscar en el objeto 'users'
    if (!user) {
      user = Object.values(users).find(user => user.email === email && user.password === password);
    }

    if (user) {
        // Guardar el tipo de usuario en localStorage
        localStorage.setItem('userType', user.type);

        // Mostrar alerta de éxito
        form.reset();
        alertaExito.classList.add("alertaExito");
        alertaError.classList.remove("alertaError");
        setTimeout(() => {
            alertaExito.classList.remove("alertaExito");
            // Redirigir a la página principal después de iniciar sesión
            window.location.href = "../index.html"; 
        }, 3000);
        return;
    }

    // Mostrar alerta de error si las credenciales son incorrectas
    alertaExito.classList.remove("alertaExito");
    alertaError.classList.add("alertaError");
    setTimeout(() => {
        alertaError.classList.remove("alertaError");
    }, 3000);
}

