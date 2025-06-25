# DCCommit

¿Estás preparadx para navegar por nuestro Blog computín? 💻🚀


## 🧠 Descripción del proyecto y propuesta de valor

DCCommit es una red social pensada para estudiantes y entusiastas de la tecnología. Su objetivo es crear una comunidad donde cualquier usuario pueda compartir publicaciones, leer contenido aprobado por moderadores y tener su propio perfil con su historial de publicaciones.

Queremos fomentar el intercambio de conocimientos, ideas y experiencias tecnológicas en un ambiente seguro y ordenado gracias a un sistema de roles que incluye usuarios, moderadores y administradores.

## 🚀 ¿Cómo empiezo?

1. Ingresa al link de nuestra app: [dccommit](https://www.dccommit.space/). **IMPORTANTE**:(si no funciona la sesion de admin y mod...es porque no logramos conectar el front deployado con clerk 🥲 asi que por favor sería solo probar el front local con el backend -que si funciona deployado- y agregar las variables de entorno de más abajo)
2. Tienes tres opciones: 

a. Entrar como **USER** normal alguna de tus sesiones de google y tendras permisos como usuario (no admin, ni moderador).  

![alt text](./src/assets/image-2.png)

Permisos:

    ✅ Ver tu perfil

    ✅ Consultar tus publicaciones (estén o no aprobadas)

    ✅ Navegar por el feed principal con publicaciones aprobadas

    ✅ Crear nuevas publicaciones

    ✅ Eliminar tus publicaciones

    ✅ Cambiar tu nickname


b. Entrar como admin con las siguiente credencial: 

**ADMIN**:  
```
correo: dccommita@gmail.com  
pass: admin12.dccommit
```
![alt text](./src/assets/image.png)
Permisos:

    ✅ Acceso al dashboard de administrador

    ✅ Ver a todos los usuarios registrados

    ✅ Ver todas las publicaciones (pendientes, aceptadas y rechazadas)

    ✅ Crear publicaciones propias

c. Entrar como moderador con las siguientes credenciales:  

**MOD**:  
```
correo: dccommitmod@gmail.com  
pass: mod12.dccommit
```
![alt text](./src/assets/image-1.png)

Permisos:

    ✅ Ver el perfil de moderador

    ✅ Revisar y moderar todas las publicaciones

    ✅ Aprobar o rechazar contenido

    ✅ Crear publicaciones propias

## Tecnologías principales utilizadas

Frontend: Next.js + TailwindCSS + Clerk (autenticación)

Backend: Express.js + Prisma ORM + Supabase

## Arquitectura y patrones implementados

* Autenticación basada en roles: Implementada con Clerk para diferenciar entre usuario, moderador y administrador.

* Patrones de Renderizado: patrón de renderizado **Static Site Generation (SSG)**, ideal para contenido estático que no cambia frecuentemente, ya que mejora el rendimiento al generar el contenido previamente durante la compilación, implementado en vista `about`,

* Patrón MVC: Separación entre rutas, controladores y lógica de negocio en backend.

![alt text](./src/assets/supabase-schema-hucqexjofqmwcqmfbbis-1.png)

* REST API: Rutas estructuradas para CRUD de Post, User, Report, Comments, Label y Verification.

* Protección de rutas por rol: Accesos diferenciados según permisos del usuario.

## Pasos detallados para setup y deployment. 

### 🔧 Frontend local

Clonar el repositorio:
```
git clone https://github.com/IIC3585/tarea-4-2025-01-s2-frontend-div-inos
    
cd tarea-4-2025-01-s2-frontend-div-inos
```
Instalar dependencias:
```
npm install
```
.env
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y29uY2lzZS1kaW5vc2F1ci03LmNsZXJrLmFjY291bnRzLmRldiQ
NEXT_PUBLIC_URL_BACK=https://tarea-4-2025-01-s2-backend-div-inos.onrender.com
CLERK_SECRET_KEY=sk_test_thxXYy2qUgVIV12CHS5StTz09CgMjKoGXBSlnZ4SHd
```
Levantar en desarrollo:
```
npm run dev
```
### 🔧 Frontend deployment

### 🔧 Backend local

Clonar el repositorio:
```
git clone https://github.com/IIC3585/tarea-4-2025-01-s2-backend-div-inos
    
cd tarea-4-2025-01-s2-backend-div-inos
```
Instalar dependencias:
```
npm install
```
.env
```
DATABASE_URL='postgresql://postgres.hucqexjofqmwcqmfbbis:EnEUMqFS5H1DUgbA@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require'

DIRECT_URL='postgresql://postgres.hucqexjofqmwcqmfbbis:EnEUMqFS5H1DUgbA@aws-0-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true&sslmode=require'

CLERK_JWT_KEY=<jwt-key>

CLERK_SECRET_KEY=<secret-key>

CLERK_API_URL=<api-clerk>
```

Levantar en desarrollo:
```
npm run dev
```
**EXTRA:**
Puedes revisar la base de datos ejecutando:
```
npx prisma studio
```
Esto te entregará un link del tipo `http://localhost:5555` que te llevará a las tablas.
### 🔧 Backend Deployment

Crear una cuenta en [render.cl](https://render.com/) y sincronizar repositorio, en este caso: 

    https://github.com/IIC3585/tarea-4-2025-01-s2-backend-div-inos

Agregar las variables de entornos en [render.cl](https://render.com/) para que la plataforma pueda ejecutar el código sin problema:
```
CLERK_JWT_KEY = ***************

DATABASE_URL = ***************

DIRECT_URL = ***************

NODE_ENV = ***************
```
Realizar workflow en github actions para el CD:
```
name: Deploy to Render

on:
    push:
        branches:
        - main

jobs:
    build:
        runs-on: ubuntu-latest

        steps:
        - uses: actions/checkout@v2

        - name: Set up Node.js
          uses: actions/setup-node@v2

        - name: Install dependencies
          run: npm install

        - name: Export env variables
          run: |
            echo "DATABASE_URL=${{ secrets.DATABASE_URL }}" >> $GITHUB_ENV
            echo "DIRECT_URL=${{ secrets.DIRECT_URL }}" >> $GITHUB_ENV
        
        - name: Prisma migrate deploy
          run: npx prisma migrate deploy

        deploy:
            runs-on: ubuntu-latest

        steps:
            - name: Deploy to Render
            uses: johnbeynon/render-deploy-action@v0.0.8
             with:
                service-id: ${{ secrets.MY_RENDER_SERVICE_ID }}
                api-key: ${{ secrets.MY_RENDER_API_KEY }}
```
Definir los secretos en actions para que el workflow funcione, es decir, de:
`DIRECT_URL`, `DATABASE_URL`, `MY_RENDER_SERVICE_ID` y `MY_RENDER_API_KEY`.

Una vez se haga un push a main, se ejecutara el workflow y el deploy en render.




## Declaración de uso de herramientas de IA

Este código fue desarrollado con asistencia de una Inteligencia Artificial:

    Modelo: GPT-4o
    Plataforma: Extensión de VS Code Copilot
    Cómo se uso: Corrección de errores que se generaban en el código y ayuda con estilos

