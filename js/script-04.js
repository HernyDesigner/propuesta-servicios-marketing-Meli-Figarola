window.addEventListener('DOMContentLoaded', () => { // Asegura que el HTML está cargado

    const video = document.getElementById('myVideo');
    let intervalId = null; // Para controlar el intervalo de reversa
    let setupComplete = false; // Flag para asegurar que la configuración inicial se haga una vez

    // --- Lógica de Fade-in ---
    // Usaremos el evento 'canplay' o 'playing' para iniciar el fade
    // 'playing' es a menudo más preciso para cuando realmente se muestra algo
    video.addEventListener('playing', () => {
        // Aplicar la clase para iniciar la transición CSS del fade-in
        video.classList.add('loaded');

        // --- Inicio de la lógica de Reversa ---
        // Solo configurar la reversa la primera vez que el video intenta reproducirse
        if (!setupComplete && video.duration) {
            setupReversePlayback();
            setupComplete = true;
        }
    });

    // Asegurarse de tener la duración antes de intentar configurar la reversa
    // 'loadedmetadata' es un buen evento para esto.
    video.addEventListener('loadedmetadata', () => {
        console.log("Metadatos cargados, duración:", video.duration);
        // Si el video ya está intentando reproducirse (autoplay),
        // y la configuración no se ha hecho, hacerla ahora.
        // Esto es un respaldo por si 'playing' se dispara antes que 'loadedmetadata'
        // o si la duración no estaba lista en el primer 'playing'.
        if (!setupComplete && video.duration && !video.paused) {
             setupReversePlayback();
             setupComplete = true;
        }
    });

    function setupReversePlayback() {
        console.log("Configurando reproducción inversa...");
        // 1. Pausar la reproducción automática hacia adelante
        video.pause();

        // 2. Ir al final del video
        //    Usamos un pequeño margen por si hay problemas de precisión al final
        video.currentTime = video.duration - 0.01;

        // 3. Iniciar el intervalo para retroceder
        //    Ajusta el segundo parámetro (milisegundos) para controlar la velocidad/fluidez
        //    Valores más bajos = más fluido pero más carga de CPU. 30-50ms es un buen punto de partida.
        const frameRate = 30; // FPS deseados (aproximado)
        const intervalDuration = 1000 / frameRate; // ms por frame

        // Limpiar intervalo anterior si existiera (por si acaso)
        if (intervalId) {
            clearInterval(intervalId);
        }

        intervalId = setInterval(() => {
            // Retroceder el tiempo (ej: 1/30 de segundo)
            video.currentTime -= (1 / frameRate);

            // Si llega al principio
            if (video.currentTime <= 0) {
                // Si el video tiene el atributo loop
                if (video.loop) {
                    // Volver al final para repetir en reversa
                    video.currentTime = video.duration - 0.01;
                } else {
                    // Si no hay loop, detener el intervalo
                    video.currentTime = 0; // Asegurar que quede en 0
                    video.pause(); // Asegurar que esté pausado
                    clearInterval(intervalId);
                    console.log("Reproducción inversa finalizada.");
                }
            }
        }, intervalDuration); // Ejecutar cada X milisegundos
    }

    // Manejo de errores (opcional pero recomendado)
    video.addEventListener('error', (e) => {
        console.error("Error al cargar o reproducir el video:", e);
        if (intervalId) {
            clearInterval(intervalId); // Detener el intervalo si hay error
        }
    });

    // Intento inicial de reproducir para disparar los eventos (necesario por autoplay)
    // A veces los navegadores bloquean autoplay si no hay interacción,
    // pero `muted` ayuda a que funcione.
    video.play().catch(error => {
        console.warn("Autoplay falló inicialmente (puede requerir interacción del usuario):", error);
        // Podrías mostrar un botón de play aquí si falla el autoplay
    });
});