const video = document.getElementById('miVideo');
const videoContainer = document.querySelector('.video-container'); // Usaremos el contenedor si es más fácil para el rectángulo

let videoDuration = 0;
let isMetadataLoaded = false;

// 1. Esperar a que los metadatos del video (como la duración) estén cargados
video.addEventListener('loadedmetadata', () => {
    videoDuration = video.duration; // Obtenemos la duración total del video
    isMetadataLoaded = true;
    video.pause(); // Asegurarnos de que el video esté pausado inicialmente
    console.log("Metadatos cargados. Duración:", videoDuration);
});

// 2. Escuchar el movimiento del mouse SOBRE el contenedor del video
videoContainer.addEventListener('mousemove', (event) => {
    // Solo proceder si los metadatos están cargados y tenemos duración
    if (!isMetadataLoaded || videoDuration <= 0) {
        return;
    }

    // Calcular la posición X del mouse relativa al borde izquierdo del CONTENEDOR
    const rect = videoContainer.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    // Obtener el ancho del contenedor
    const containerWidth = rect.width;

    // Calcular la proporción de la posición (0 a 1)
    // Asegurarse de que no sea menor que 0 ni mayor que 1
    let positionFraction = mouseX / containerWidth;
    positionFraction = Math.max(0, Math.min(1, positionFraction)); // Limitar entre 0 y 1

    // Calcular el tiempo correspondiente en el video
    const targetTime = positionFraction * videoDuration;

    // Actualizar el tiempo actual del video
    // Usamos video.fastSeek si está disponible (más rápido), si no, currentTime
    if (video.fastSeek) {
        video.fastSeek(targetTime);
    } else {
        video.currentTime = targetTime;
    }

    // Opcional: Mostrar tiempo actual para depuración
    // console.log(`MouseX: ${mouseX.toFixed(2)}, Fracción: ${positionFraction.toFixed(3)}, Tiempo: ${targetTime.toFixed(2)}s`);
});

// Opcional: Pausar cuando el mouse sale del contenedor
videoContainer.addEventListener('mouseleave', () => {
     // Podrías querer pausarlo o dejarlo donde está.
     // video.pause(); // Descomenta si quieres que se pause al salir
});

// Manejo de errores si el video no carga
video.addEventListener('error', (e) => {
    console.error("Error al cargar el video:", e);
    alert("Hubo un error al cargar el video. Verifica la ruta del archivo.");
});