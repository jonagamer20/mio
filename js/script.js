document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterBtn = document.getElementById('showRegister');
    
    // Función para validar contraseña
    function validatePassword(password) {
        const minLength = password.length >= 12;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        
        return minLength && hasUpperCase && hasNumber && hasSpecialChar;
    }

    // Mostrar modal de registro
    showRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
        registerModal.show();
    });

    // Validación en tiempo real de la contraseña
    const passwordInput = document.getElementById('regPassword');
    passwordInput.addEventListener('input', function(e) {
        const isValid = validatePassword(this.value);
        this.classList.toggle('is-invalid', !isValid);
        this.classList.toggle('is-valid', isValid);
    });

    // Manejar el inicio de sesión
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Aquí iría la lógica de autenticación
        console.log('Iniciando sesión:', email);
        // Simulación de inicio de sesión exitoso
        window.location.href = 'dashboard.html'; // Redirige a la página principal
    });

    // Manejar el registro
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const firstName = document.getElementById('regFirstName').value;
        const lastName = document.getElementById('regLastName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        if (!validatePassword(password)) {
            document.getElementById('passwordFeedback').style.display = 'block';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password // En una aplicación real, nunca envíes la contraseña sin encriptar
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.');
                const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                registerModal.hide();
            } else {
                alert('Error al registrar usuario: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar usuario. Por favor, intenta nuevamente.');
        }
    });

    // Reemplazar el código existente del sidebar toggle con esto:
    document.getElementById('sidebarToggle').addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const toggleButton = this;
        
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('shifted');
        toggleButton.classList.toggle('active');
    });

    // Agregar detección de clic fuera del sidebar para cerrarlo en móviles
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const toggleButton = document.getElementById('sidebarToggle');
        const mainContent = document.querySelector('.main-content');
        
        // Si el sidebar está abierto y se hace clic fuera de él y no en el botón de toggle
        if (sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            !toggleButton.contains(event.target)) {
            sidebar.classList.remove('active');
            mainContent.classList.remove('shifted');
            toggleButton.classList.remove('active');
        }
    });
}); 