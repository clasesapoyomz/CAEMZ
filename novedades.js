
// Archivos de las novedades
const archivos = [
    "clases-apoyo-aysic.html",
    "aviso-estruch-noviembre.html",
    "nuevas-clases-de-apoyo-de-quimica.html"
];

// Cargar una novedad desde su archivo HTML
async function cargarNovedad(archivo) {
    const ruta = "novedades/" + archivo;

    try {
        const respuesta = await fetch(ruta);

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar: " + ruta);
        }

        const html = await respuesta.text();
        const documento = new DOMParser().parseFromString(html, "text/html");

        const detalle = documento.querySelector(".detalle");

        if (!detalle) {
            throw new Error("No se encontró .detalle en " + ruta);
        }

        const titulo = detalle.querySelector("h1")?.textContent.trim() || "";
        const fecha = detalle.querySelector(".fecha")?.textContent.trim() || "";

        const imagen = detalle.querySelector("img");
        const descripcion = [...detalle.querySelectorAll("p")]
            .find(p => !p.classList.contains("fecha"))?.textContent.trim() || "";

        let imagenUrl = imagen?.getAttribute("src") || "";

        // Resolver correctamente las rutas de las imágenes
        if (imagenUrl && !/^(data:|blob:|https?:)/i.test(imagenUrl)) {
            imagenUrl = new URL(imagenUrl, respuesta.url).href;
        }

        return {
            titulo,
            fecha,
            descripcion,
            imagen: imagenUrl,
            url: ruta
        };

    } catch (error) {
        console.error("Error cargando novedad:", error);
        return null;
    }
}

// Crear tarjeta visual
function tarjeta(n) {
    const a = document.createElement("article");
    a.className = "novedad";

    if (n.imagen) {
        const i = document.createElement("img");
        i.src = n.imagen;
        i.alt = "Imagen de la novedad";
        i.style.maxWidth = "100%";
        a.append(i);
    }

    const t = document.createElement("div");
    t.className = "texto";

    const h = document.createElement("h3");
    h.textContent = n.titulo;

    const p = document.createElement("p");
    p.textContent = n.descripcion;

    const f = document.createElement("div");
    f.className = "fecha";
    f.textContent = n.fecha;

    t.append(h, p, f);
    a.append(t);

    const link = document.createElement("a");
    link.className = "boton-novedad";
    link.href = n.url;
    link.textContent = "Leer novedad";

    a.append(link);

    return a;
}

// Convertir fecha DD/MM/AAAA
function convertirFecha(fecha) {
    const [dia, mes, anio] = fecha.split("/");
    return new Date(Number(anio), Number(mes) - 1, Number(dia));
}

// Mostrar novedades
async function mostrarNovedades() {
    const cont = document.getElementById("novedades");

    if (!cont) return;

    cont.textContent = "Cargando novedades...";

    const resultados = await Promise.all(
        archivos.map(cargarNovedad)
    );

    const novedades = resultados.filter(n => n !== null);

    novedades.sort((a, b) => {
        return convertirFecha(b.fecha) - convertirFecha(a.fecha);
    });

    cont.replaceChildren();

    if (novedades.length === 0) {
        cont.textContent = "Todavía no hay novedades publicadas.";
        return;
    }

    novedades.forEach(n => {
        cont.append(tarjeta(n));
    });
}

mostrarNovedades();
