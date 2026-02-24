function convertirDosajeALetras(num) {
    const valor = parseFloat(num);
    if (isNaN(valor)) return "";

    const partes = valor.toFixed(2).split('.');
    const enteros = parseInt(partes[0]);
    const decimales = parseInt(partes[1]);

    const unidades = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    
    // Diccionario extendido para dosajes comunes
    const nombresDecimales = {
        10: "diez", 20: "veinte", 30: "treinta", 40: "cuarenta", 50: "cincuenta",
        47: "cuarenta y siete", 25: "veinticinco", 15: "quince"
    };

    let textoEnteros = enteros === 0 ? "cero" : unidades[enteros] || enteros;
    let textoDecimales = nombresDecimales[decimales] || decimales.toString();

    return `${textoEnteros} gramos con ${textoDecimales} centigramos de alcohol por litro de sangre`;
}

async function generarDocumento() {
    // Referencias a los elementos del formulario
    const resNum = document.getElementById('res_dosaje').value;
    
    // Objeto con los datos que reemplazarán las llaves en el Word
    const data = {
        NUMERO_DISPOSICION: document.getElementById('num_disp').value,
        FECHA_DISPOSICION: document.getElementById('fecha_disp').value,
        NOMBRE_IMPUTADO: document.getElementById('nombre').value.toUpperCase(),
        HECHOS: document.getElementById('hechos').value,
        FECHA_DE_HECHOS: document.getElementById('fecha_hechos').value,
        FECHA_DE_INTERVENCION_POLICIAL: document.getElementById('fecha_int').value,
        NUMER_DOSAJE: document.getElementById('num_dosaje').value,
        RESULTADO_DOSAJE: resNum + " G/L",
        RESULTADO_DOSAJE_LETRAS: convertirDosajeALetras(resNum),
        VEHICULO: document.getElementById('vehiculo').value.toUpperCase(),
        PLACA: document.getElementById('placa').value.toUpperCase()
    };

    try {
        // Busca el archivo en la raíz del repositorio de GitHub
        const response = await fetch('MODELO_3.docx');
        
        if (!response.ok) {
            throw new Error("No se pudo cargar MODELO_3.docx. Revisa el nombre del archivo.");
        }
        
        const content = await response.arrayBuffer();
        const zip = new PizZip(content);
        
        const doc = new window.docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Proceso de reemplazo
        doc.render(data);

        // Creación del archivo final
        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Descarga automática
        saveAs(out, `Libertad_${data.NOMBRE_IMPUTADO.replace(/\s+/g, '_')}.docx`);

    } catch (error) {
        console.error("Error detallado:", error);
        alert("Ocurrió un error al generar el archivo. Revisa que MODELO_3.docx esté en tu GitHub con ese nombre exacto.");
    }
}
