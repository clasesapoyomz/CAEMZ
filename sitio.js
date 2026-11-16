document.addEventListener("DOMContentLoaded", () => {

    const configuraciones = [
        {
            input: "buscar-materia",
            boton: "boton-buscar-materia",
            contenedor: "catalogo-materias",
            mensaje: "sin-resultados"
        },
        {
            input: "buscar-profesor",
            boton: "boton-buscar-profesor",
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

    configuraciones.forEach(({ input, boton, contenedor, mensaje }) => {

        const campo = document.getElementById(input);
        const lupa = document.getElementById(boton);
        const lista = document.getElementById(contenedor);
        const aviso = document.getElementById(mensaje);

        if (!campo || !lupa || !lista) return;

        const tarjetas = Array.from(
            lista.querySelectorAll(".item-card")
        );

        function buscar() {

            const consulta = normalizar(campo.value);
            let visibles = 0;

            tarjetas.forEach(tarjeta => {

                const texto = normalizar(
                    (tarjeta.dataset.busqueda || "") +
                    " " + tarjeta.textContent
                );

                const coincide = consulta === "" || texto.includes(consulta);

                tarjeta.hidden = !coincide;

                if (coincide) visibles++;
            });

            if (aviso) {
                aviso.hidden = visibles !== 0;
            }
        }

        // Buscar al tocar la lupa.
        lupa.addEventListener("click", buscar);

        // También permite buscar presionando Enter.
        campo.addEventListener("keydown", evento => {
            if (evento.key === "Enter") {
                evento.preventDefault();
                buscar();
            }
        });

    });

});
