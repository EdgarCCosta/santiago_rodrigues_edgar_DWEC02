// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = './data/tarifasCombustible.json'
let gastosJSONpath = './data/gastosCombustible.json';
import { GastoCombustible } from './gastoCombustible.js';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // Mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {
    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);
        
        console.log('Tarifas cargadas:', tarifasJSON);
        console.log('Gastos cargados:', gastosJSON);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }

    gastosJSON.forEach(gasto => {
        const fecha = new Date(gasto.date);
        const anio = fecha.getFullYear();

        // Sumar el precio de viaje al año correspondiente
        if (anio in aniosArray) {
            aniosArray[anio] += gasto.precioViaje;
        }
    });

    for (const anio in aniosArray) {
        const total = aniosArray[anio];
        const totalRedondeado = Math.round(total * 100) / 100; // Redondeo
        document.getElementById(`gasto${anio}`).innerText = totalRedondeado; // Actualiza el HTML
    }
}


// Función para guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);
    const anio = fecha.getFullYear();

    // Calcular el precio del viaje directamente
    const precioViaje = kilometros * tarifasJSON.tarifas.find(t => t.anio === anio).vehiculos[tipoVehiculo];

    // Crear una instancia de GastoCombustible
    const nuevoGasto = new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje);

    // Convertir la instancia a JSON y mostrar el nuevo gasto en la lista
    const nuevoGastoJSON = nuevoGasto.convertToJSON();

    // Actualizar el gasto total correspondiente en una sola línea
    const totalElemento = document.getElementById(`gasto`+ anio);
    const totalRedondeado = (parseFloat(totalElemento.innerText) + precioViaje).toFixed(2);
    
    // Actualizar en el HTML
    totalElemento.innerText = totalRedondeado;
    document.getElementById('fuel-form').reset();
}