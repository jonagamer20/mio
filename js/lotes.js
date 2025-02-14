
document.addEventListener('DOMContentLoaded', function() {
    cargarLotes();

    // Manejar el formulario de lote
    document.getElementById('loteForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(this);
            const loteData = Object.fromEntries(formData.entries());
            
            console.log('Datos del formulario:', loteData);
            
            const resultado = await enviarLote(loteData);
            console.log('Respuesta del servidor:', resultado);
            
            if (resultado.success) {
                this.reset();
                await cargarLotes();
                mostrarNotificacion('Lote registrado exitosamente', 'success');
            }
        } catch (error) {
            mostrarNotificacion(
                `Error al crear el lote: ${error.message}. 
                Verifica que el servidor esté corriendo en http://localhost:3000`, 
                'danger'
            );
        }
    });

    // Búsqueda en tiempo real
    document.getElementById('searchLote').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#lotesTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
});

async function cargarLotes() {
    try {
        const response = await fetch('http://localhost:3000/api/lotes');
        const lotes = await response.json();
        
        const tableBody = document.getElementById('lotesTableBody');
        tableBody.innerHTML = '';

        lotes.forEach(lote => {
            tableBody.innerHTML += `
                <tr>
                    <td>Lote ${lote.numero}</td>
                    <td>${lote.area} m²</td>
                    <td>${lote.cantidadPlantas}</td>
                    <td>${new Date(lote.fechaSiembra).toLocaleDateString()}</td>
                    <td>
                        <span class="badge bg-${getEstadoColor(lote.estado)}">${lote.estado}</span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="verDetalles(${lote.id})">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success me-1" onclick="registrarActividad(${lote.id})">
                            <i class="bi bi-journal-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarLote(${lote.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        mostrarNotificacion('Error al cargar lotes: ' + error.message, 'danger');
    }
}

function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notificacion.style.zIndex = "1050";
    notificacion.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

function getEstadoColor(estado) {
    switch (estado) {
        case 'En desarrollo': return 'info';
        case 'En producción': return 'success';
        case 'En mantenimiento': return 'warning';
        default: return 'secondary';
    }
}

function verDetalles(numeroLote) {
    // Implementar vista de detalles
}

function registrarActividad(numeroLote) {
    // Implementar registro de actividad
}

async function eliminarLote(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este lote?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/lotes/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                cargarLotes();
                mostrarNotificacion('Lote eliminado correctamente', 'success');
            } else {
                throw new Error('Error al eliminar el lote');
            }
        } catch (error) {
            mostrarNotificacion(error.message, 'danger');
        }
    }
}

async function enviarLote(loteData) {
    const API_URL = 'http://localhost:3000';
    
    try {
        const response = await fetch(`${API_URL}/api/lotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(loteData),
            mode: 'cors'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error en la petición');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al enviar lote:', error);
        throw error;
    }
} 
