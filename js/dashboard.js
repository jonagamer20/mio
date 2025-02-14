document.addEventListener('DOMContentLoaded', function() {
    // Código para el sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    // Función para cerrar el sidebar
    function closeSidebar() {
        sidebar.classList.remove('active');
        mainContent.classList.remove('shifted');
    }

    // Función para abrir el sidebar
    function openSidebar() {
        sidebar.classList.add('active');
        mainContent.classList.add('shifted');
    }

    // Toggle sidebar
    sidebarToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Cerrar sidebar al hacer clic fuera en móviles
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                closeSidebar();
            }
        }
    });

    // Cerrar sidebar al redimensionar la ventana a desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });

    // Prevenir que los clics dentro del sidebar lo cierren
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}); 