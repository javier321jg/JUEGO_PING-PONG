# 🏓 Ping Pong 3D - Glass & Liquid Physics Engine

Un juego de ping pong 3D avanzado con efectos visuales realistas de vidrio y líquido, creado con Three.js y tecnologías web modernas.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-r128-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

## ✨ Características

### 🎮 Gameplay
- **Modo Jugador vs CPU** con 4 niveles de dificultad
- **Física realista** con gravedad y rebotes
- **Controles intuitivos** mediante mouse, touch y teclado
- **Sistema de puntuación** hasta 11 puntos
- **IA adaptativa** que ajusta su velocidad según la dificultad

### 🎨 Efectos Visuales Avanzados
- **Glassmorphism UI**: Interfaz moderna con efecto de vidrio esmerilado
- **Efectos de vidrio 3D**: Materiales con transmisión de luz, refracción y reflexión
- **Física líquida**: Simulación de movimiento fluido y ondas
- **Sistema de partículas**: Explosiones y efectos al golpear la pelota
- **Bloom & Glow**: Efectos de brillo y resplandor en tiempo real
- **Iluminación dinámica**: Luces puntuales, direccionales y spots
- **Sombras suaves**: Shadow mapping de alta calidad
- **Post-procesamiento**: Tone mapping cinematográfico

### 🎯 Efectos de Materiales
- **Glass Material**: Vidrio realista con:
  - Transmisión de luz (0.8-0.9)
  - IOR (Índice de refracción) de 1.45-2.0
  - Clearcoat para capa brillante
  - Roughness y metalness ajustables
- **Liquid Physics**: Simulación de comportamiento líquido
- **Neon Glow**: Bordes brillantes con efecto neón
- **Dynamic Opacity**: Transparencias animadas

## 🚀 Características Técnicas

### Arquitectura
- **Motor 3D**: Three.js r128
- **Renderer**: WebGL con antialiasing
- **Performance**: 60 FPS optimizado
- **Responsive**: Adaptable a cualquier resolución
- **Mobile-friendly**: Soporte táctil completo

### Optimizaciones
- **Particle Pooling**: Reutilización de partículas para mejor rendimiento
- **Shadow Mapping**: Mapas de sombras de 2048x2048
- **LOD System**: Geometrías optimizadas
- **Request Animation Frame**: Loop de juego optimizado
- **Event Throttling**: Control eficiente de eventos

## 🎮 Controles

### Mouse/Touch
- **Movimiento del mouse**: Controla la paleta del jugador
- **Touch**: Arrastra el dedo para mover la paleta

### Teclado
- **A / ←**: Mover paleta a la izquierda
- **D / →**: Mover paleta a la derecha

### Interfaz
- **▶ Iniciar**: Comienza el juego
- **⏸ Pausa**: Pausa/Reanuda el juego
- **↻ Reiniciar**: Reinicia el marcador
- **Dificultad**: Selector de nivel (Fácil, Media, Difícil, Extrema)

## 🎨 Efectos Configurables

Todos los efectos pueden activarse/desactivarse desde la interfaz:

1. **Efecto Vidrio**: Materiales con transmisión y refracción
2. **Física Líquida**: Simulación de movimiento fluido
3. **Partículas**: Sistema de explosiones y efectos
4. **Bloom & Glow**: Efectos de brillo y resplandor

## 📋 Niveles de Dificultad

### 🟢 Fácil
- Velocidad CPU: 0.05
- Tiempo de reacción: 0.3s
- Multiplicador de velocidad: 0.8x

### 🟡 Media (Predeterminado)
- Velocidad CPU: 0.08
- Tiempo de reacción: 0.2s
- Multiplicador de velocidad: 1.0x

### 🔴 Difícil
- Velocidad CPU: 0.12
- Tiempo de reacción: 0.1s
- Multiplicador de velocidad: 1.2x

### ⚫ Extrema
- Velocidad CPU: 0.18
- Tiempo de reacción: 0.05s
- Multiplicador de velocidad: 1.5x

## 🛠️ Instalación

### Opción 1: Servidor Local

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/JUEGO_PING-PONG.git
cd JUEGO_PING-PONG

# Inicia un servidor local (Python)
python -m http.server 8000

# O con Node.js
npx http-server
```

Abre tu navegador en `http://localhost:8000`

### Opción 2: Despliegue en la Web

Simplemente sube los archivos a cualquier servicio de hosting web:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

## 📁 Estructura del Proyecto

```
JUEGO_PING-PONG/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos con glassmorphism
├── game.js             # Motor 3D y lógica del juego
└── README.md           # Documentación
```

## 🎯 Componentes del Juego

### Escena 3D
- **Mesa**: Superficie de vidrio con bordes neón
- **Red**: Material translúcido con efecto glow
- **Paletas**: Vidrio con efectos de transmisión
- **Pelota**: Esfera de vidrio líquido con núcleo brillante

### Sistema de Física
- **Gravedad**: -0.005 unidades/frame
- **Rebotes**: Coeficiente de restitución 0.8
- **Colisiones**: Detección AABB optimizada
- **Aceleración**: Incremento del 5% por golpe

### Sistema de Partículas
- **Pool size**: 100 partículas pre-creadas
- **Vida útil**: 30-60 frames
- **Efectos**: Gravedad, fade-out, scale-down
- **Colores**: Dinámicos según evento

## 🌟 Características Visuales

### Iluminación
- **1x Ambient Light**: Luz ambiental base
- **1x Directional Light**: Luz solar con sombras
- **2x Point Lights**: Luces de acento (rosa y azul)
- **2x Spot Lights**: Focos en las paletas

### Materiales Físicos
```javascript
MeshPhysicalMaterial {
    metalness: 0.1-0.3,
    roughness: 0.05-0.1,
    transmission: 0.7-0.9,
    thickness: 0.3-0.5,
    clearcoat: 1.0,
    ior: 1.45-2.0
}
```

## 📊 Métricas en Tiempo Real

La interfaz muestra:
- **FPS**: Frames por segundo
- **Velocidad**: Velocidad actual de la pelota
- **Marcador**: Puntuación jugador vs CPU

## 🎨 Paleta de Colores

- **Fondo**: Gradiente púrpura (#667eea → #764ba2)
- **Paleta Jugador**: Rosa (#ff4488)
- **Paleta CPU**: Verde (#44ff88)
- **Mesa**: Azul (#4488ff)
- **Pelota**: Blanco con núcleo cyan
- **Efectos**: Neón multicolor

## 🔧 Configuración Avanzada

### Ajustar Velocidad del Juego
En `game.js`, línea 29:
```javascript
this.ballSpeed = 0.3; // Aumentar para más velocidad
```

### Ajustar Gravedad
En `game.js`, línea 30:
```javascript
this.gravity = -0.005; // Más negativo = más gravedad
```

### Puntos para Ganar
En `game.js`, línea 38:
```javascript
maxScore: 11 // Cambiar el objetivo
```

## 🐛 Solución de Problemas

### El juego no carga
- Verifica que Three.js se cargue correctamente desde el CDN
- Revisa la consola del navegador para errores
- Asegúrate de usar un navegador moderno

### Rendimiento bajo
- Desactiva algunos efectos visuales
- Reduce la calidad de sombras en el código
- Cierra otras pestañas del navegador

### Controles no responden
- Verifica que el juego esté iniciado (botón ▶)
- Recarga la página
- Prueba con otro navegador

## 🌐 Compatibilidad

### Navegadores Soportados
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Requisitos
- WebGL 2.0
- ES6 JavaScript
- Backdrop-filter support (opcional)

## 📱 Responsive Design

El juego se adapta automáticamente a:
- 🖥️ Escritorio (1920x1080+)
- 💻 Laptop (1366x768+)
- 📱 Tablet (768x1024+)
- 📱 Mobile (360x640+)

## 🎓 Tecnologías Utilizadas

- **Three.js**: Motor 3D y renderizado WebGL
- **HTML5 Canvas**: Superficie de renderizado
- **CSS3**: Glassmorphism y animaciones
- **JavaScript ES6**: Lógica del juego
- **Web APIs**: RequestAnimationFrame, Touch Events

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - Siéntete libre de usar este proyecto para aprender o crear tu propia versión.

## 👨‍💻 Autor

Creado con ❤️ usando Claude AI

## 🎯 Roadmap

Próximas características planeadas:
- [ ] Modo multijugador en red
- [ ] Tabla de clasificaciones global
- [ ] Más efectos de post-procesamiento
- [ ] Personalización de skins
- [ ] Modo torneo
- [ ] Replay system
- [ ] Efectos de sonido
- [ ] Música de fondo
- [ ] Powerups especiales
- [ ] Estadísticas del jugador

## 📸 Capturas

El juego presenta:
- Interfaz glassmorphic moderna
- Efectos de vidrio y líquido en tiempo real
- Partículas dinámicas
- Iluminación cinematográfica
- UI responsive y elegante

---

**¡Disfruta jugando Ping Pong 3D!** 🏓✨

Para reportar bugs o sugerir mejoras, abre un issue en GitHub.
