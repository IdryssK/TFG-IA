# IDRAI

IDRAI es una herramienta desarrollada en el marco de la iniciativa Smart University de la Universidad de Alicante. Su objetivo principal es generar datasets a partir de los datos proporcionados por la OpenAPI de Smart University y prepararlos para su uso en algoritmos de inteligencia artificial.
Esta herramienta esta desarollada con [Angular 17](https://v17.angular.io/docs) utilizando la plantilla [Fuse](https://angular-material.fusetheme.com/dashboards/project)


## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

Mira [**Despliegue**](#despliegue) para conocer como desplegar el proyecto.


### Pre-requisitos 📋

_Que cosas necesitas para instalar el proyecto_

- [Node.js](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/es/download.html)

### Instalación 🔧

1. Clonar el repositorio ```git clone https://github.com/IdryssK/TFG-IA.git```
2. Iniciar MySQL en XAMPP.
3. Abrir su aplicación de adminstración de bases de datos (_HeidiSQL, Navicat..._) y conectarse al localhost proporcionado por XAMPP.
4. Crear una base de datos **tfg_ia**.
5. Ejecutar el SQL **db.sql** (_back/bdd_) para la creación de las diferentes tablas y tener un usuario.
6. Navegar a la carpeta del Back-End desde una termina: ```cd back/server```.
7. Instalar dependencias: ```npm install```.
8. Configurar las variables de entorno en el archivo **.env** (_back/server_) para la conexión a la base de datos.
9. Navegar a la carpeta del Front-End: ```cd front```.
10. Instalar depencias: ```npm install```.
11. Dirijase: ```front/node_modules/@angular/material/core/index.d.ts``` y remplaze la linea **_1101_** del archivo **index.d.ts** por ```export declare type ThemePalette = 'primary' | 'accent' | 'warn' | 'success' | undefined;```
12. Dirijase: ```front/node_modules/danfojs/dist/danfojs-base/transformers/encoders/one.hot.encoder.d.ts``` y remplaze las variables **privadas**: **_$labels_** y **_$getData_** por variables **publicas**


## Despliegue

### Back-End
```bash
$ cd back/server
$ npm run dev
```

### Front-End
```bash
$ cd front
$ ng serve --open
```
Usuario de prueba para acceder a la parte privada de la aplicación:

* Email: user@ua.es
* Contraseña: Idrai123
## Autores ✒️

### Product Owner's

* **Jose Vicente Berná Martinez** - [jvberna@gcloud.ua.es](jvberna@gcloud.ua.es)
* **Lucía Arnau Muños** -  [lucia.arnau@gcloud.ua.es](lucia.arnau@gcloud.ua.es)

### Developpers

* **Idryss Kachermi** - [Linkedin](https://www.linkedin.com/in/idryss-kachermi/)

