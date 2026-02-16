#!/usr/bin/env node

// scripts/protect.js

const fs = require('fs');
const path = require('path');

const APP_PATH = path.join(__dirname, '../src/App.tsx');
const BACKUP_PATH = path.join(__dirname, '../src/App.tsx.backup');

// Verificar que el archivo existe
if (!fs.existsSync(APP_PATH)) {
  console.error('❌ Error: No se encontró src/App.tsx');
  process.exit(1);
}

// Crear backup antes de modificar
function createBackup() {
  fs.copyFileSync(APP_PATH, BACKUP_PATH);
  console.log('💾 Backup creado: src/App.tsx.backup');
}

// Leer archivo
let content = fs.readFileSync(APP_PATH, 'utf8');

// Detectar estado actual
const hasImport = content.includes("import { ProtectedPage } from");
const hasOpeningTag = content.includes('<ProtectedPage>') && !content.includes('{/* <ProtectedPage>');
const hasClosingTag = content.includes('</ProtectedPage>') && !content.includes('</ProtectedPage> */}');
const isActive = hasImport && hasOpeningTag && hasClosingTag;
const isCommented = content.includes('{/* <ProtectedPage> */}');

const command = process.argv[2];

// ========================================
// COMANDO: ON (ACTIVAR)
// ========================================
if (command === 'on') {
  if (isActive) {
    console.log('✅ La protección ya está ACTIVA');
    process.exit(0);
  }

  createBackup();

  // Si está comentado, descomentar
  if (isCommented) {
    content = content
      .replace('{/* <ProtectedPage> */}', '<ProtectedPage>')
      .replace('{/* </ProtectedPage> */}', '</ProtectedPage>')
      .replace("// import { ProtectedPage } from '@/components/ProtectedPage';", "import { ProtectedPage } from '@/components/ProtectedPage';");
  } else {
    // Si no existe, agregar
    
    // Agregar import si no existe
    if (!hasImport) {
      const importLine = "import { ProtectedPage } from '@/components/ProtectedPage';";
      const helmetImport = "import { HelmetProvider } from 'react-helmet-async';";
      content = content.replace(helmetImport, `${helmetImport}\n${importLine}`);
    }

    // Agregar tags alrededor de BrowserRouter
    content = content.replace(
      '<BrowserRouter>',
      '<ProtectedPage>\n      <BrowserRouter>'
    );
    content = content.replace(
      '</BrowserRouter>\n    </HelmetProvider>',
      '</BrowserRouter>\n      </ProtectedPage>\n    </HelmetProvider>'
    );
  }

  fs.writeFileSync(APP_PATH, content);
  
  console.log('🔒 ¡PROTECCIÓN ACTIVADA!');
  console.log('');
  console.log('   📌 Ahora TODA la plataforma requiere login');
  console.log('   👤 Usuario: ' + (process.env.VITE_TEMP_USERNAME || 'admin'));
  console.log('   🔑 Contraseña: configurada en .env');
  console.log('');
  console.log('   ⚠️  Recordá:');
  console.log('   1. npm run dev (para desarrollo)');
  console.log('   2. git commit && git push (para producción)');
  console.log('');

// ========================================
// COMANDO: OFF (DESACTIVAR)
// ========================================
} else if (command === 'off') {
  if (!isActive && !isCommented) {
    console.log('✅ La protección ya está DESACTIVADA');
    process.exit(0);
  }

  createBackup();

  // Comentar en lugar de eliminar (por seguridad)
  content = content
    .replace('<ProtectedPage>', '{/* <ProtectedPage> */}')
    .replace('</ProtectedPage>', '{/* </ProtectedPage> */}')
    .replace("import { ProtectedPage } from '@/components/ProtectedPage';", "// import { ProtectedPage } from '@/components/ProtectedPage';");

  fs.writeFileSync(APP_PATH, content);
  
  console.log('🔓 ¡PROTECCIÓN DESACTIVADA!');
  console.log('');
  console.log('   📌 La plataforma es accesible sin login');
  console.log('   ⚠️  Cualquiera puede entrar a todas las páginas');
  console.log('');
  console.log('   Para reactivarla:');
  console.log('   npm run protect on');
  console.log('');

// ========================================
// COMANDO: STATUS (VER ESTADO)
// ========================================
} else if (command === 'status') {
  console.log('');
  console.log('🔐 ESTADO DE PROTECCIÓN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (isActive) {
    console.log('   Estado:    🔒 PROTEGIDA');
    console.log('   Login:     ✅ Requerido');
    console.log('   Usuario:   ' + (process.env.VITE_TEMP_USERNAME || 'admin'));
  } else if (isCommented) {
    console.log('   Estado:    🔓 DESACTIVADA (comentado)');
    console.log('   Login:     ❌ No requerido');
    console.log('   Acceso:    Público');
  } else {
    console.log('   Estado:    🔓 ABIERTA');
    console.log('   Login:     ❌ No configurado');
    console.log('   Acceso:    Público');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  
  if (!isActive) {
    console.log('   Para activar: npm run protect on');
  } else {
    console.log('   Para desactivar: npm run protect off');
  }
  console.log('');

// ========================================
// COMANDO: RESTORE (RESTAURAR BACKUP)
// ========================================
} else if (command === 'restore') {
  if (!fs.existsSync(BACKUP_PATH)) {
    console.error('❌ No hay backup disponible');
    process.exit(1);
  }

  fs.copyFileSync(BACKUP_PATH, APP_PATH);
  console.log('✅ App.tsx restaurado desde backup');

// ========================================
// SIN COMANDO O AYUDA
// ========================================
} else {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 PROTECCIÓN DE PLATAFORMA - Lead Engine Baigorria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMANDOS DISPONIBLES:

  npm run protect on         → 🔒 Activar login (proteger plataforma)
  npm run protect off        → 🔓 Desactivar login (acceso público)
  npm run protect status     → 📊 Ver estado actual
  npm run protect restore    → ⏮️  Restaurar desde backup

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EJEMPLOS DE USO:

  # Durante desarrollo (ocultar de bots)
  npm run protect on

  # Cuando vayas a producción (abrir al público)
  npm run protect off

  # Verificar si está protegida
  npm run protect status

  # Si algo sale mal
  npm run protect restore

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  IMPORTANTE:
   - El login protege TODAS las páginas (/, /comprar, /admin, etc.)
   - Las credenciales están en .env (VITE_TEMP_USERNAME y VITE_TEMP_PASSWORD)
   - Siempre se crea un backup antes de modificar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}