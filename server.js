const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const { exec } = require('child_process');
const path = require('path');

// Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Configuración de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Asegúrate de que este puerto sea el correcto para tu frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public')); // Asegúrate de que tus archivos HTML y JS estén en la carpeta 'public'

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto según tu proveedor de correo
    auth: {
        user: 'tu_correo@gmail.com', // Reemplaza con tu correo
        pass: 'tu_contraseña_de_aplicacion' // Reemplaza con tu contraseña de aplicación
    }
});

// Modelos de datos (lotes, insumos, herramientas, etc.)
let lotes = []; // Almacenamiento temporal de lotes

// Rutas API para Lotes
app.get('/api/lotes', (req, res) => {
    res.json(lotes);
});

app.post('/api/lotes', (req, res) => {
    console.log('Recibiendo petición POST /api/lotes');
    console.log('Datos recibidos:', req.body);
    
    try {
        const nuevoLote = {
            id: Date.now(),
            numero: parseInt(req.body.numero),  // Asegurar que sea número
            area: parseFloat(req.body.area),    // Asegurar que sea número
            fechaSiembra: req.body.fechaSiembra,
            cantidadPlantas: parseInt(req.body.cantidadPlantas),
            estado: req.body.estado,
            ultimaFertilizacion: null,
            proximaFertilizacion: null,
            historialPlagas: []
        };

        // Validar que el número de lote no esté duplicado
        if (lotes.some(lote => lote.numero === nuevoLote.numero)) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un lote con ese número'
            });
        }

        lotes.push(nuevoLote);
        res.status(201).json({
            success: true,
            data: nuevoLote
        });
    } catch (error) {
        console.error('Error al crear lote:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el lote: ' + error.message
        });
    }
});

// Rutas para obtener información de insumos, herramientas y cosechas
app.post('/api/insumos', (req, res) => {
    // Registrar nuevo insumo
});

app.get('/api/insumos', (req, res) => {
    // Obtener lista de insumos
});

app.post('/api/herramientas', (req, res) => {
    // Registrar nueva herramienta
});

app.get('/api/herramientas', (req, res) => {
    // Obtener lista de herramientas
});

app.post('/api/cosechas', (req, res) => {
    // Registrar nueva cosecha
});

app.get('/api/cosechas', (req, res) => {
    // Obtener historial de cosechas
});

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Asegúrate de que este archivo exista en el servidor
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`URL base: http://localhost:${PORT}`);
});
