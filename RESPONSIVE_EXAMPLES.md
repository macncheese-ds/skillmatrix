# Ejemplos de Clases Responsivas - Skill Matrix

Esta guía proporciona ejemplos prácticos de las clases responsivas más utilizadas en el proyecto.

## 📐 Padding y Márgenes

### Padding Progresivo
```jsx
// Móvil: 8px, Tablet: 16px, Desktop: 24px
<div className="p-2 sm:p-4 md:p-6">
  Contenido con padding adaptativo
</div>

// Vertical específico
<div className="py-2 sm:py-3 md:py-4">
  Padding vertical escalable
</div>

// Horizontal específico
<div className="px-3 sm:px-4 md:px-6">
  Padding horizontal escalable
</div>
```

### Espaciado entre Elementos
```jsx
// Gap en grids
<div className="grid gap-2 sm:gap-3 md:gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Space en flex
<div className="flex space-x-2 sm:space-x-3 md:space-x-4">
  <button>Botón 1</button>
  <button>Botón 2</button>
</div>
```

---

## 🔤 Tipografía

### Tamaños de Texto
```jsx
// Headers
<h1 className="text-lg sm:text-xl md:text-2xl font-bold">
  Título Principal
</h1>

<h2 className="text-base sm:text-lg md:text-xl font-semibold">
  Subtítulo
</h2>

// Párrafos
<p className="text-sm sm:text-base md:text-lg">
  Texto de párrafo escalable
</p>

// Textos pequeños
<span className="text-xs sm:text-sm">
  Texto secundario
</span>
```

### Truncado de Texto
```jsx
// Truncar con ellipsis
<div className="truncate">
  Texto largo que se corta con...
</div>

// Line clamp (máximo de líneas)
<div className="line-clamp-2 sm:line-clamp-3">
  Texto que se limita a 2 líneas en móvil
  y 3 líneas en tablets
</div>
```

---

## 📊 Grids Responsivos

### Columnas Adaptativas
```jsx
// 1 columna en móvil, 2 en tablet, 3 en desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

// Grid complejo usado en la app
<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
  {/* Proceso cards */}
</div>
```

### Auto-fit / Auto-fill
```jsx
// Autoajuste de columnas
<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
  <div>Item flexible</div>
</div>
```

---

## 🎯 Flexbox Responsivo

### Dirección de Flex
```jsx
// Vertical en móvil, horizontal en desktop
<div className="flex flex-col sm:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Invertir orden
<div className="flex flex-col-reverse sm:flex-row gap-2">
  <button>Cancelar</button>  {/* Aparece primero en móvil */}
  <button>Guardar</button>   {/* Aparece segundo en móvil */}
</div>
```

### Alineación
```jsx
// Centro en móvil, inicio en desktop
<div className="flex items-center sm:items-start justify-center sm:justify-between">
  <span>Texto</span>
  <button>Acción</button>
</div>
```

---

## 🖼️ Tamaños y Dimensiones

### Ancho
```jsx
// Full-width en móvil, auto en desktop
<button className="w-full sm:w-auto">
  Botón adaptativo
</button>

// Ancho máximo
<div className="w-full max-w-sm sm:max-w-md lg:max-w-4xl">
  Contenedor con ancho máximo
</div>
```

### Altura
```jsx
// Altura de imagen
<img className="h-14 sm:h-16 md:h-20" />

// Altura máxima con scroll
<div className="max-h-[60vh] sm:max-h-[80vh] overflow-y-auto">
  Contenido scrolleable
</div>
```

---

## 🎨 Visibilidad

### Mostrar/Ocultar Elementos
```jsx
// Oculto en móvil, visible en desktop
<div className="hidden sm:block">
  Contenido solo para desktop
</div>

// Visible en móvil, oculto en desktop
<div className="block sm:hidden">
  Contenido solo para móvil
</div>

// Inline en móvil, block en desktop
<span className="inline sm:block">
  Comportamiento cambiante
</span>
```

### Texto Adaptativo
```jsx
// Diferentes textos según tamaño
<button>
  <span className="hidden sm:inline">Guardar Cambios</span>
  <span className="sm:hidden">Guardar</span>
</button>

// Con iconos
<button>
  📷 <span className="hidden xs:inline">Subir Imagen</span>
  <span className="xs:hidden">Subir</span>
</button>
```

---

## 🎭 Efectos y Transiciones

### Hover Solo en Desktop
```jsx
// Hover states que no se activan en touch
<div className="bg-gray-700 hover:bg-gray-600 active:bg-gray-800">
  Elemento con feedback táctil
</div>
```

### Transformaciones
```jsx
// Escala diferente según dispositivo
<div className="scale-90 sm:scale-100 hover:scale-105">
  Elemento con escala adaptativa
</div>
```

---

## 🔘 Botones Touch-Friendly

### Botones Estándar
```jsx
// Botón básico optimizado
<button className="touch-target bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base">
  Botón Touch
</button>

// Botón con ancho adaptativo
<button className="touch-target w-full sm:w-auto bg-green-600 px-4 py-2">
  Full-width móvil
</button>
```

### Grupos de Botones
```jsx
// Botones apilados en móvil, fila en desktop
<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
  <button className="touch-target flex-1 sm:flex-none">Cancelar</button>
  <button className="touch-target flex-1 sm:flex-none">Guardar</button>
</div>
```

---

## 📝 Formularios

### Inputs
```jsx
// Input con tamaño adaptativo
<input 
  className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg"
  placeholder="Nombre"
/>

// Label adaptativo
<label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
  Campo *
</label>
```

### Checkboxes y Radio Buttons
```jsx
// Checkbox con área táctil ampliada
<label className="flex items-center space-x-2 cursor-pointer touch-target">
  <input type="checkbox" className="rounded" />
  <span className="text-xs sm:text-sm">Opción</span>
</label>
```

---

## 📦 Cards y Contenedores

### Card Responsiva
```jsx
<div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border shadow-sm">
  <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">
    Título
  </h3>
  <p className="text-xs sm:text-sm text-gray-600">
    Contenido de la card
  </p>
</div>
```

### Modal Responsivo
```jsx
<div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
  <div className="bg-white rounded-lg w-full max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6">
    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
      Modal
    </h2>
    {/* Contenido */}
  </div>
</div>
```

---

## 🎨 Colores y Bordes

### Bordes
```jsx
// Grosor adaptativo
<div className="border sm:border-2 rounded">
  Borde más grueso en desktop
</div>

// Border radius
<div className="rounded sm:rounded-lg md:rounded-xl">
  Radio adaptativo
</div>
```

---

## 📐 Ejemplos Completos

### Tarjeta de Empleado (Móvil)
```jsx
<div className="bg-gray-700 border border-gray-600 rounded-lg p-3 sm:p-4">
  {/* Layout Móvil */}
  <div className="block sm:hidden">
    <div className="flex items-start gap-3">
      <img className="w-14 h-14 rounded-full" src={foto} />
      <div className="flex-1">
        <div className="font-medium text-sm">{nombre}</div>
        <div className="text-xs text-gray-400">{puesto}</div>
      </div>
      <div className="px-2 py-1 rounded text-xs bg-blue-900">
        {certificaciones}
      </div>
    </div>
  </div>
  
  {/* Layout Desktop */}
  <div className="hidden sm:grid sm:grid-cols-6 gap-4">
    {/* ... contenido desktop ... */}
  </div>
</div>
```

### Formulario Completo
```jsx
<form className="space-y-3 sm:space-y-4">
  {/* Grid de campos */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
    <div>
      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
        Nombre *
      </label>
      <input 
        className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg"
        required 
      />
    </div>
    
    <div>
      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
        Email *
      </label>
      <input 
        type="email"
        className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg"
        required 
      />
    </div>
  </div>
  
  {/* Botones */}
  <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 pt-3">
    <button 
      type="button" 
      className="touch-target w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg"
    >
      Cancelar
    </button>
    <button 
      type="submit" 
      className="touch-target w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Guardar
    </button>
  </div>
</form>
```

### Navegación Adaptativa
```jsx
<nav className="flex gap-2 sm:gap-4">
  <button className="touch-target flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg">
    📊 <span className="hidden xs:inline">Resumen</span>
  </button>
  <button className="touch-target flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg">
    👥 <span className="hidden xs:inline">Empleados</span>
  </button>
</nav>
```

---

## 🔍 Tips de Debugging

### Ver Breakpoint Actual
```jsx
// Agregar temporalmente para ver breakpoint activo
<div className="fixed top-0 left-0 bg-black text-white p-2 z-50">
  <span className="sm:hidden">Base (&lt;640px)</span>
  <span className="hidden sm:inline md:hidden">SM (≥640px)</span>
  <span className="hidden md:inline lg:hidden">MD (≥768px)</span>
  <span className="hidden lg:inline xl:hidden">LG (≥1024px)</span>
  <span className="hidden xl:inline">XL (≥1280px)</span>
</div>
```

---

## ✅ Checklist de Revisión

Al crear/modificar un componente, verificar:

- [ ] ¿Padding progresivo? (`p-2 sm:p-4 md:p-6`)
- [ ] ¿Texto escalable? (`text-sm sm:text-base`)
- [ ] ¿Grid adaptativo? (`grid-cols-1 sm:grid-cols-2`)
- [ ] ¿Botones touch-friendly? (`.touch-target`)
- [ ] ¿Espaciado adaptativo? (`gap-2 sm:gap-3`)
- [ ] ¿Ancho apropiado? (`w-full sm:w-auto`)
- [ ] ¿Estados activos? (`:active` para móvil)
- [ ] ¿Probado en móvil real?

---

**Última actualización**: Octubre 28, 2025  
**Próximo paso**: Probar en dispositivos reales y ajustar según feedback
