export class GastoCombustible {
    constructor(vehicleType, date, kilometers, precioViaje) {
        this.vehicleType = vehicleType;
        this.date = date;
        this.kilometers = kilometers;
        this.precioViaje = precioViaje;
    }

    convertToJSON() {
        const gastoJSON = {
            vehicleType: this.vehicleType,
            date: this.date.toISOString().split('T')[0], // Formatear la fecha a formato YYYY-MM-DD
            kilometers: this.kilometers,
            precioViaje: this.precioViaje
        };

        // Mostrar el nuevo gasto en "Gastos recientes"
        const listaGastos = document.getElementById('expense-list');
        listaGastos.innerHTML = '';
        const nuevoElemento = document.createElement('li');
        nuevoElemento.textContent = 'Vehículo: ' + gastoJSON.vehicleType + ', Fecha: ' + gastoJSON.date + ', Kilómetros: ' + gastoJSON.kilometers + ', Precio: ' + gastoJSON.precioViaje.toFixed(2);
        listaGastos.appendChild(nuevoElemento);

        // Devolver el objeto JSON (esto sigue siendo útil si necesitas acceder al JSON desde fuera)
        return gastoJSON;
    }
}
