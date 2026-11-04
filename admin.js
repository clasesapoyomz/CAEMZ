
const KEY = "caemz_novedades";

// Verificar sesión de administrador
if (sessionStorage.getItem("ecmz_admin_demo") !== "si") {
    location.replace("login.html");
}

// Obtener novedades guardadas
function datos() {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch (e) {
        return [];
    }
}

// Formatear fecha
function fechaBonita(f) {
    if (!f) return "";

    let p = f.split("-");

    return p.length === 3
        ? p[2] + "/" + p[1] + "/" + p[0]
        : f;
}

// Crear nombre de archivo
function slugify(s) {
    return s.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "novedad";
}

// Crear tarjeta
function tarjeta(n) {

    let a = document.createElement("article");
    a.className = "novedad";

    let h = document.createElement("h3");
    h.textContent = n.titulo;

    let p = document.createElement("p");
    p.textContent = n.descripcion;

    let f = document.createElement("div");
    f.className = "fecha";
    f.textContent = fechaBonita(n.fecha);

    a.append(h, p, f);

    // Mostrar imagen
    if (n.imagen) {

        let img = document.createElement("img");

        img.src = n.imagen;
        img.alt = "Imagen de la novedad";

        img.style.maxWidth = "100%";
        img.style.maxHeight = "250px";
        img.style.objectFit = "contain";

        a.append(img);
    }

    // Eliminar novedad individual
    let b = document.createElement("button");

    b.type = "button";
    b.textContent = "Eliminar novedad";

    b.onclick = () => {

        if (confirm("¿Eliminar esta novedad del listado local?")) {

            localStorage.setItem(
                KEY,
                JSON.stringify(
                    datos().filter(x => x.id !== n.id)
                )
            );

            dibujarAdmin();
        }
    };

    a.append(b);

    return a;
}

// Mostrar novedades
function dibujarAdmin() {

    let c = document.getElementById("lista");

    c.replaceChildren();

    let ns = datos();

    if (!ns.length) {

        c.textContent =
            "Todavía no creaste novedades en este navegador.";

        return;
    }

    ns.sort((a, b) => b.fecha.localeCompare(a.fecha))
        .forEach(n => c.append(tarjeta(n)));
}

// Crear HTML descargable
function makeHtml(title, desc, date, imageData = "") {

    const esc = s => s.replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));

    const imagenHTML = imageData
        ? `<img
                class="imagen-novedad-detalle"
                src="${imageData}"
                alt="Imagen de la novedad"
                style="max-width:100%;height:auto;"
           >`
        : "";

    return `<!doctype html>
<html lang="es">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} | CAEMZ</title>
<link rel="stylesheet" href="../estilos.css">
</head>

<body>

<header class="encabezado">

<a href="../index.html">
<img src="../img/logo-uncuyo-ecmz.png" alt="CAEMZ">
</a>

<nav>
<a href="../index.html">Inicio</a>
<a href="../materias.html">Materias</a>
<a href="../profesores.html">Profesores</a>
</nav>

</header>

<main class="contenido">

<article class="detalle">

<p class="fecha">${esc(fechaBonita(date))}</p>

<h1>${esc(title)}</h1>

${imagenHTML}

<p>${esc(desc).replace(/\n/g, "<br>")}</p>

<a class="boton-novedad" href="../index.html">
← Volver a novedades
</a>

</article>

</main>

<footer class="pie">
<span>© Escuela de Comercio Martín Zapata · CAEMZ</span>
</footer>

</body>
</html>`;
}

// Vista previa de imagen
document.getElementById("imagen")
    .addEventListener("change", function () {

        let file = this.files[0];

        let previa = document.getElementById("vista-previa");

        let contenedor = document.getElementById(
            "vista-previa-container"
        );

        if (!file) {

            previa.src = "";

            contenedor.style.display = "none";

            return;
        }

        if (!file.type.startsWith("image/")) {

            alert("Seleccioná una imagen válida.");

            this.value = "";

            return;
        }

        let lector = new FileReader();

        lector.onload = function (e) {

            previa.src = e.target.result;

            contenedor.style.display = "block";
        };

        lector.readAsDataURL(file);
    });

// Crear novedad
document.getElementById("form-novedad")
    .addEventListener("submit", async e => {

        e.preventDefault();

        let estado = document.getElementById("estado");

        let titulo = document.getElementById("titulo")
            .value.trim();

        let fecha = document.getElementById("fecha").value;

        let descripcion = document.getElementById("descripcion")
            .value.trim();

        let file = document.getElementById("imagen").files[0];

        let imagenData = "";

        // Leer imagen
        if (file) {

            if (!file.type.startsWith("image/")) {

                estado.textContent =
                    "El archivo seleccionado no es una imagen.";

                return;
            }

            estado.textContent = "Procesando imagen...";

            try {

                imagenData = await new Promise((resolve, reject) => {

                    let lector = new FileReader();

                    lector.onload = () => resolve(lector.result);

                    lector.onerror = () => reject(lector.error);

                    lector.readAsDataURL(file);
                });

            } catch (err) {

                estado.textContent =
                    "No se pudo leer la imagen.";

                return;
            }
        }

        let slug = slugify(titulo);

        let filename = slug + ".html";

        let id = String(Date.now());

        let n = {
            id,
            titulo,
            fecha,
            descripcion,
            imagen: imagenData,
            url: "novedades/" + filename,
            archivo: filename
        };

        try {

            let ns = datos();

            ns.push(n);

            localStorage.setItem(
                KEY,
                JSON.stringify(ns)
            );

            // Crear archivo HTML
            let html = makeHtml(
                titulo,
                descripcion,
                fecha,
                imagenData
            );

            let blob = new Blob(
                [html],
                { type: "text/html;charset=utf-8" }
            );

            let url = URL.createObjectURL(blob);

            let a = document.createElement("a");

            a.href = url;

            a.download = filename;

            document.body.append(a);

            a.click();

            a.remove();

            URL.revokeObjectURL(url);

            e.target.reset();

            document.getElementById("fecha").value =
                new Date().toISOString().slice(0, 10);

            document.getElementById(
                "vista-previa-container"
            ).style.display = "none";

            dibujarAdmin();

            estado.textContent =
                "Novedad creada. El archivo HTML incluye la imagen. " +
                "Subilo a novedades/ y agregá su enlace en novedades.js.";

        } catch (err) {

            estado.textContent =
                "No se pudo crear la novedad. " +
                "Puede que la imagen sea demasiado grande.";
        }
    });

// Borrar todas las novedades
document.getElementById("btn-borrar-novedades")
    .addEventListener("click", function () {

        if (!datos().length) {

            alert("No hay novedades para borrar.");

            return;
        }

        if (confirm(
            "¿Seguro que querés borrar todas las novedades " +
            "del listado local?"
        )) {

            localStorage.removeItem(KEY);

            dibujarAdmin();

            alert("Se eliminaron las novedades del listado local.");
        }
    });

// Fecha actual
document.getElementById("fecha").value =
    new Date().toISOString().slice(0, 10);

// Cerrar sesión
document.getElementById("salir").onclick = () => {

    sessionStorage.removeItem("ecmz_admin_demo");

    location.href = "index.html";
};

// Mostrar novedades al abrir
dibujarAdmin();
