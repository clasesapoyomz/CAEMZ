
document.addEventListener("DOMContentLoaded", () => {

    const configuraciones = [
        {
            input: "buscar-materia",
            contenedor: "catalogo-materias",
            mensaje: "sin-resultados"
        },
        {
            input: "buscar-profesor",
            contenedor: "catalogo-profesores",
            mensaje: "sin-resultados-profesores"
        }
    ];

    function normalizar(texto) {
        return texto
            .toLocaleLowerCase("es")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    configuraciones.forEach(({ input, contenedor, mensaje }) => {

        const campo = document.getElementById(input);
        const lista = document.getElementById(contenedor);
        const aviso = document.getElementById(mensaje);

        if (!campo || !lista) return;

        const tarjetas = Array.from(
            lista.querySelectorAll(".item-card")
        );

        campo.addEventListener("input", () => {

            const consulta = normalizar(campo.value);
            let visibles = 0;

            tarjetas.forEach(tarjeta => {

                const texto = normalizar(
                    (tarjeta.dataset.busqueda || "") +
                    " " + tarjeta.textContent
                );

                const coincide = texto.includes(consulta);

                tarjeta.hidden = !coincide;

                if (coincide) visibles++;
            });

            if (aviso) {
                aviso.hidden = visibles !== 0;
            }

        });

    });

});
