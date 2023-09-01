// construye los clientes
const clientes = [];

class Cliente {
  constructor(fechaLectura, numeroMedidor, lecturaAnterior, lecturaActual, latitud, longitud) {
    this.fechaLectura = fechaLectura;
    this.numeroMedidor = numeroMedidor;
    this.lecturaAnterior = lecturaAnterior;
    this.lecturaActual = lecturaActual;
    this.latitud = latitud;
    this.longitud = longitud;
  }

  //calculos  consumo precio y define la categoria 

  calcularConsumo() {
    return this.lecturaActual - this.lecturaAnterior;
  }

  calcularPrecio() {
    const consumo = this.calcularConsumo();
    const valorM3 = 30;
    return consumo * valorM3;
  }

  obtenerCategoria() {
    const consumo = this.calcularConsumo();
    return consumo > 40
      ? "Cambio su tipo de cliente"
      : consumo > 30
      ? "Cuide su consumo"
      : "Categoria A";
  }
}
// fin de calculos  consmo precio y categoria


function agregarCliente(fechaLectura, numeroMedidor, lecturaAnterior, lecturaActual, latitud, longitud) {
  const clienteExistente = clientes.find(cliente => cliente.numeroMedidor === numeroMedidor);
  if (clienteExistente) {
    Swal.fire("Error", "Ya existe un cliente con este número de medidor", "error");
    return;
  }

  const cliente = new Cliente(fechaLectura, numeroMedidor, lecturaAnterior, lecturaActual, latitud, longitud);
  clientes.push(cliente);
  guardarEnLocalStorage();
  mostrarTabla();
  mostrarClientesEnMapa();
  
}

function clienteExiste(numeroMedidor) {
    return clientes.some(cliente => cliente.numeroMedidor === numeroMedidor);
  } 
  

//filtro por numero de medidor 

  function filtrarPorNumeroMedidor() {
    Swal.fire({
      title: "Filtrar por Número de Medidor",
      input: "text",
      inputPlaceholder: "Ingrese el número de medidor",
      showCancelButton: true,
      confirmButtonText: "Filtrar",
      cancelButtonText: "Cancelar",
      preConfirm: (numeroMedidor) => {
        numeroMedidor = numeroMedidor.trim();
        if (numeroMedidor === "") {
          Swal.showValidationMessage("Por favor, ingrese un número de medidor válido.");
          return false;
        }
        return numeroMedidor;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const numeroMedidor = result.value;
        const clientesFiltrados = clientes.filter(cliente => cliente.numeroMedidor === numeroMedidor);
  
        if (clientesFiltrados.length === 0) {
          Swal.fire("Sin resultados", "No se encontraron clientes con ese número de medidor.", "warning");
          return;
        }
  
        mostrarClientesEnTabla(clientesFiltrados);
      }
    });
  }
  
  function mostrarClientesEnTabla(clientesFiltrados) {
  
    const tabla = document.getElementById("tablaClientes");
  

    tabla.innerHTML = "";
  
  
    const encabezado = tabla.createTHead().insertRow(0);
  
 
    const encabezadoNumeroMedidor = document.createElement("th");
    encabezadoNumeroMedidor.textContent = "Número de Medidor";
  
    const encabezadoLecturaAnterior = document.createElement("th");
    encabezadoLecturaAnterior.textContent = "Lectura Anterior";
  
    const encabezadoLecturaActual = document.createElement("th");
    encabezadoLecturaActual.textContent = "Lectura Actual";
  
    const encabezadoConsumo = document.createElement("th");
    encabezadoConsumo.textContent = "Consumo";
  
    const encabezadoPrecio = document.createElement("th");
    encabezadoPrecio.textContent = "Precio";
  
    const encabezadoCategoria = document.createElement("th");
    encabezadoCategoria.textContent = "Categoría";
  
 
    encabezado.appendChild(encabezadoNumeroMedidor);
    encabezado.appendChild(encabezadoLecturaAnterior);
    encabezado.appendChild(encabezadoLecturaActual);
    encabezado.appendChild(encabezadoConsumo);
    encabezado.appendChild(encabezadoPrecio);
    encabezado.appendChild(encabezadoCategoria);
  
    // Crear las filas de datos
    clientesFiltrados.forEach((cliente, index) => {
      const fila = tabla.insertRow(index + 1); // +1 para dejar espacio para el encabezado
  
      // Crear las celdas de datos
      const celdaNumeroMedidor = fila.insertCell(0);
      celdaNumeroMedidor.textContent = cliente.numeroMedidor;
  
      const celdaLecturaAnterior = fila.insertCell(1);
      celdaLecturaAnterior.textContent = cliente.lecturaAnterior;
  
      const celdaLecturaActual = fila.insertCell(2);
      celdaLecturaActual.textContent = cliente.lecturaActual;
  
      const celdaConsumo = fila.insertCell(3);
      celdaConsumo.textContent = cliente.calcularConsumo();
  
      const celdaPrecio = fila.insertCell(4);
      celdaPrecio.textContent = cliente.calcularPrecio();
  
      const celdaCategoria = fila.insertCell(5);
      celdaCategoria.textContent = cliente.obtenerCategoria();
    });
  }

//eliminat clientes  que aparece en el DOM cuando muestra la tabla 

function eliminarCliente(numeroMedidor) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará el registro del cliente. ¿Deseas continuar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      const indice = clientes.findIndex(cliente => cliente.numeroMedidor === numeroMedidor);
      if (indice !== -1) {
        clientes.splice(indice, 1);
        guardarEnLocalStorage();
        mostrarTabla();
        Swal.fire("Eliminado", "El registro del cliente ha sido eliminado.", "success");
      }
    }
  });
}


// Guardar en el localStorage
function guardarEnLocalStorage() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

// funcion para cargar desde el local 
function cargarDesdeLocalStorage() {
  const datosGuardados = localStorage.getItem("clientes");
  if (datosGuardados) {
    clientes.length = 0;
    const datosParseados = JSON.parse(datosGuardados);
    datosParseados.forEach(cliente => {
      agregarCliente(fechaLectura, cliente.numeroMedidor, cliente.lecturaAnterior, cliente.lecturaActual);
    });
  }
}

// funcion para agregar clientes 
function agregarClientePorMapa() {
  if (marker) {
    Swal.fire({
      title: "Ingresar Lecturas",
      html: `
        <input type="date" id="fechaLectura" placeholder="Fecha de Lectura" required>
        <input type="text" id="numeroMedidor" placeholder="Número de Medidor" required>
        <input type="number" id="lecturaAnterior" placeholder="Lectura Anterior" required>
        <input type="number" id="lecturaActual" placeholder="Lectura Actual" required>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      focusConfirm: false,
      preConfirm: () => {
        const fechaLectura = document.getElementById("fechaLectura").value;
        const numeroMedidor = document.getElementById("numeroMedidor").value;
        const lecturaAnterior = parseFloat(document.getElementById("lecturaAnterior").value);
        const lecturaActual = parseFloat(document.getElementById("lecturaActual").value);
        agregarCliente(fechaLectura, numeroMedidor, lecturaAnterior, lecturaActual, marker.getPosition().lat(), marker.getPosition().lng());
      }
    });
  } else {
    Swal.fire("Error", "Por favor, selecciona una ubicación en el mapa primero.", "error");
  }
}


//funcion para generar un Json

function generarArchivoJSON() {
  if (clientes.length === 0) {
    Swal.fire('Sin Datos', 'No hay clientes registrados para generar el archivo JSON.', 'warning');
    return;
  } 

  const contenidoJSON = JSON.stringify(clientes, null, 2);
  const blob = new Blob([contenidoJSON], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'clientes.json';
  a.textContent = 'Descargar Archivo JSON';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


// Función para cargar un archivo JSON usando SweetAlert
function cargarJSONConSweetAlert() {
  Swal.fire({
    title: 'Cargar Archivo JSON',
    input: 'file',
    inputAttributes: {
      accept: 'application/json',
      'aria-label': 'Cargar archivo JSON'
    },
    confirmButtonText: 'Cargar',
    showCancelButton: true,
    preConfirm: async (file) => {
      try {
        const contenido = await file.text();
        const jsonData = JSON.parse(contenido);
        if (!Array.isArray(jsonData)) {
          throw new Error('El archivo JSON no es valido');
        }
        mostrarJSONEnDOM(jsonData);
        Swal.fire('Cargado', 'Archivo JSON cargado exitosamente.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Ocurrió un error al cargar el archivo JSON.', 'error');
      }
    }
  });
}

// Función para mostrar datos JSON en el DOM (en forma de tabla)
function mostrarJSONEnDOM(jsonData) {
  const contenedorTabla = document.getElementById('contenedorTabla');
  const tabla = document.createElement('table');
  const encabezado = tabla.createTHead().insertRow(0);
  for (const key in jsonData[0]) {
    const th = document.createElement('th');
    th.textContent = key;
    encabezado.appendChild(th);
  }
  jsonData.forEach((objeto, index) => {
    const fila = tabla.insertRow(index + 1);
  
    for (const key in objeto) {
      const celda = fila.insertCell();
      celda.textContent = objeto[key];
    }

    // Agregar el objeto al localStorage
    const objetoString = JSON.stringify(objeto);
    localStorage.setItem(`cliente${index + 1}`, objetoString);
  });

  contenedorTabla.innerHTML = '';
  contenedorTabla.appendChild(tabla);
}




// Función para crear un GeoJSON a partir de los datos de los clientes usando ASYNC

async function generarGeoJSON() {
  if (clientes.length === 0) {
    Swal.fire("Sin Datos", "No hay clientes registrados para generar el GeoJSON.", "warning");
    return;
  }

  const features = clientes.map(cliente => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [cliente.longitud, cliente.latitud]
    },
    properties: {
      fechaLectura: cliente.fechaLectura,
      numeroMedidor: cliente.numeroMedidor,
      lecturaAnterior: cliente.lecturaAnterior,
      lecturaActual: cliente.lecturaActual,
      consumo: cliente.calcularConsumo(),
      precio: cliente.calcularPrecio(),
      categoria: cliente.obtenerCategoria()
    }
  }));

  const geojson = {
    type: "FeatureCollection",
    features: features
  };

  const contenidoJSON = JSON.stringify(geojson, null, 2);
  const blob = new Blob([contenidoJSON], { type: 'application/json' });

  try {
    const response = await fetch(URL.createObjectURL(blob));
    const blobData = await response.blob();

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blobData);
    a.download = 'clientes.geojson';
    a.textContent = 'Descargar GeoJSON';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error al generar el archivo GeoJSON:', error);
    Swal.fire("Error", "Ocurrió un error al generar el archivo GeoJSON.", "error");
  }
}

// Función para cargar archivo GeoJSON y mostrar en el mapa usando asincronia y fetch

 async function cargarGeoJSONEnMapa(file) {
  try {
    const content = await file.text();
    const geojson = JSON.parse(content);

    if (!geojson || geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) {
      Swal.fire("Error", "El archivo no es un GeoJSON válido.", "error");
      return;
    }

    geojson.features.forEach(feature => {
      if (feature.geometry && feature.geometry.type === "Point" && Array.isArray(feature.geometry.coordinates)) {
        const latLng = new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
        const marker = new google.maps.Marker({
          position: latLng,
          map: map
        });

        const contentString = `
          <h4>Cliente ${feature.properties.numeroMedidor}</h4>
          <p>Fecha de Lectura: ${feature.properties.fechaLectura}</p>
          <p>Lectura Anterior: ${feature.properties.lecturaAnterior}</p>
          <p>Lectura Actual: ${feature.properties.lecturaActual}</p>
          <p>Consumo: ${feature.properties.consumo}</p>
          <p>Precio: ${feature.properties.precio}</p>
          <p>Categoría: ${feature.properties.categoria}</p>
        `;

        const infoWindow = new google.maps.InfoWindow({
          content: contentString
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }
    });

   // llama la funcion guardarEnLocalStorage para guardar los datos en el localS 
   guardarEnLocalStorage();
   

    Swal.fire("Cargado", "Archivo de clientes cargado en el mapa.", "success");
  } catch (error) {
    console.error('Error al cargar el archivo GeoJSON:', error);
    Swal.fire("Error", "Ocurrió un error al cargar el archivo GeoJSON.", "error");
  }
}


//funcion para llmar el cuadro de dialogo y subir el archivo
async function cargarGeoJSON() {
  try {
    const result = await Swal.fire({
      title: "Cargar Archivo GeoJSON",
      input: "file",
      inputAttributes: {
        accept: "application/json",
        "aria-label": "Cargar archivo GeoJSON",
      },
      confirmButtonText: "Cargar",
      showCancelButton: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    const file = result.value;

    cargarGeoJSONEnMapa(file);
    
  } catch (error) {
    console.error('Error al mostrar el diálogo para cargar el archivo GeoJSON:', error);
  }
} 
  
//mostrar tabla es para los resultados que va dando la carga de clientes 
function mostrarTabla() {
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  if (clientes.length === 0) {
    resultadosDiv.textContent = "No hay clientes registrados.";
    return;
  }

  const tabla = document.createElement("table");
  const encabezados = ["Fecha de Lectura", "Número de Medidor", "Lectura Anterior", "Lectura Actual", "Consumo (m³)", "Precio", "Categoría", "latitud", "longitud", "Acciones"];
  const headerRow = document.createElement("tr");

  encabezados.forEach(encabezado => {
    const th = document.createElement("th");
    th.textContent = encabezado;
    headerRow.appendChild(th);
  });

  tabla.appendChild(headerRow);

  clientes.forEach((cliente, index) => {
    const consumo = cliente.calcularConsumo();
    const precio = cliente.calcularPrecio();
    const categoria = cliente.obtenerCategoria();

    const row = document.createElement("tr");
    row.innerHTML = `
    
      <td>${cliente.fechaLectura}</td>
      <td>${cliente.numeroMedidor}</td>
      <td>${cliente.lecturaAnterior}</td>
      <td>${cliente.lecturaActual}</td>
      <td>${consumo}</td>
      <td>${precio}</td>
      <td>${categoria}</td>
      <td>${cliente.latitud}</td>
      <td>${cliente.longitud}</td>
      <td><button onclick="eliminarCliente('${cliente.numeroMedidor}')">Eliminar</button></td> 
    `; // boton eliminar 

    // colorcito para filas pares e impares en el css
    if (index % 2 === 0) {
      row.classList.add("table-row-even");
    } else {
      row.classList.add("table-row-odd");
    }

    tabla.appendChild(row);
  });

  resultadosDiv.innerHTML = "";
  resultadosDiv.appendChild(tabla);
}
  
// muestra la carga en el mapa  van quedando los puntos fijos..... 

  function mostrarClientesEnMapa() {
    const infoWindow = new google.maps.InfoWindow();
  
    const dataLayer = new google.maps.Data({ map });
  
    dataLayer.forEach(feature => {
      dataLayer.remove(feature);
    });
  
    clientes.forEach(cliente => {
      const feature = new google.maps.Data.Feature({
        geometry: new google.maps.Data.Point(new google.maps.LatLng(cliente.latitud, cliente.longitud)),
        properties: {
          title: `Cliente ${cliente.numeroMedidor}`,
          numeroMedidor: cliente.numeroMedidor,
          lecturaAnterior: cliente.lecturaAnterior,
          lecturaActual: cliente.lecturaActual,
          consumo: cliente.calcularConsumo(),
          precio: cliente.calcularPrecio(),
          categoria: cliente.obtenerCategoria()
        }
      });
  
      dataLayer.add(feature);
    });
  
    dataLayer.addListener('click', event => {
      const properties = event.feature.getProperty('properties');
      const content = `
        <h3>${properties.title}</h3>
        <p>Número de Medidor: ${properties.numeroMedidor}</p>
        <p>Lectura Anterior: ${properties.lecturaAnterior}</p>
        <p>Lectura Actual: ${properties.lecturaActual}</p>
        <p>Consumo: ${properties.consumo}</p>
        <p>Precio: ${properties.precio}</p>
        <p>Categoría: ${properties.categoria}</p>
      `;
  
      infoWindow.setContent(content);
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    });
  }
   
let map, marker;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -29.412778272573263, lng: -66.85586214065552 },
    zoom: 15
  });

  map.addListener("click", (event) => {
    if (!marker) {
      marker = new google.maps.Marker({
        map,
        draggable: true,
        position: event.latLng
      });
    } else {
      marker.setPosition(event.latLng);
    }
  });
}

// Cargar datos y mostrar inicialmente
function cargarDatosIniciales() {
cargarDesdeLocalStorage();
mostrarTabla();
initMap(); 
}

window.onload = cargarDatosIniciales



