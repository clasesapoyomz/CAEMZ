// Búsqueda instantánea en los listados de materias y profesores.
document.addEventListener("DOMContentLoaded", () => {
  const configuraciones = [
    { input: "buscar-materia", contenedor: "catalogo-materias" },
    { input: "buscar-profesor", contenedor: "catalogo-profesores" }
  ];
  configuraciones.forEach(({ input, contenedor }) => {
    const campo = document.getElementById(input);
    const lista = document.getElementById(contenedor);
    if (!campo || !lista) return;
    const tarjetas = Array.from(lista.querySelectorAll(".item-card"));
    const mensaje = document.getElementById("sin-resultados");
    campo.addEventListener("input", () => {
      const consulta = campo.value.trim().toLocaleLowerCase("es");
      let visibles = 0;
      tarjetas.forEach(tarjeta => {
        const texto = (tarjeta.dataset.busqueda || tarjeta.textContent).toLocaleLowerCase("es");
        const coincide = texto.includes(consulta);
        tarjeta.hidden = !coincide;
        if (coincide) visibles++;
      });
      if (mensaje) mensaje.hidden = visibles !== 0;
    });
  });
});
