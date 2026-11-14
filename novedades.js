
const archivos = [
    "novedades/clases-apoyo-aysic.html",
    "novedades/aviso-estruch-noviembre.html",
    "novedades/nuevas-clases-de-apoyo-de-quimica.html"
];

// Crear tarjeta a partir de un HTML
async function cargarNovedad(ruta) {
    try {
        const respuesta = await fetch(ruta);

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar " + ruta);
        }

        const html = await respuesta.text();
        const documento = new DOMParser().parseFromString(html, "text/html");

        const detalle = documento.querySelector(".detalle");

        if (!detalle) return null;

        const titulo = detalle.querySelector("h1")?.textContent.trim() || "";
        const fecha = detalle.querySelector(".fecha")?.textContent.trim() || "";

        const imagen = detalle.querySelector("img");
        const descripcion = [...detalle.querySelectorAll("p")]
            .find(p => !p.classList.contains("fecha"))?.textContent.trim() || "";

        return {
            titulo,
            fecha,
            descripcion,
            imagen: imagen ? imagen.getAttribute("src") : "",
            url: ruta
        };

    } catch (error) {
        console.error(error);
        return null;
    }
}

// Crear tarjeta visual
function tarjeta(n) {
    const a = document.createElement("article");
    a.className = "novedad";

    if (n.imagen) {
        const i = document.createElement("img");
        i.src = new URL(n.imagen, n.url).href;
        i.alt = "Imagen de la novedad";
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

// Mostrar novedades
async function mostrarNovedades() {
    const cont = document.getElementById("novedades");

    if (!cont) return;

    cont.replaceChildren();

    const novedades = (await Promise.all(
        archivos.map(cargarNovedad)
    )).filter(n => n !== null);

    // Ordenar por fecha
    novedades.sort((a, b) => {
        const convertir = f => {
            const [dia, mes, anio] = f.split("/");
            return new Date(anio, mes - 1, dia);
        };

        return convertir(b.fecha) - convertir(a.fecha);
    });

    if (novedades.length === 0) {
        cont.textContent = "Todavía no hay novedades publicadas.";
        return;
    }

    novedades.forEach(n => {
        cont.append(tarjeta(n));
    });
}

mostrarNovedades();
