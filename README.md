# Proyecto de Back End

Este es el repositorio del Back End para la aplicación financiera Fince. Aquí encontrarás la lógica y los servicios necesarios para gestionar usuarios, categorías, transacciones, cartera de inversiones y datos financieros de instrumentos.

## Estructura del Proyecto

El proyecto está organizado en varios módulos:

- **Controllers:** Manejan la lógica de negocio y la interacción con la base de datos Firebase.

  - `categoryController.js`: Controla las operaciones relacionadas con las categorías de gastos.

  - `transactionController.js`: Gestiona las transacciones financieras.

  - `stockController.js`: Proporciona datos financieros de acciones, bonos y fondos de inversión.

  - `portfolioController.js`: Controla las operaciones relacionadas con la cartera de inversiones.

- **Middleware:** Contiene funciones de middleware, como la autenticación.

  - `authMiddleware.js`: Verifica la autenticación del usuario antes de permitir el acceso a ciertos recursos.

- **Routes:** Define las rutas y los controladores asociados.

  - `userRoutes.js`: Rutas para gestionar usuarios.

  - `categoryRoutes.js`: Rutas para operaciones relacionadas con categorías de gastos.

  - `transactionRoutes.js`: Rutas para gestionar transacciones financieras.

  - `stockRoutes.js`: Rutas para obtener datos financieros de instrumentos.

  - `portfolioRoutes.js`: Rutas para operaciones relacionadas con la cartera de inversiones.

  - `index.js`: Punto de entrada para todas las rutas.

- **Data:** Carpeta que contiene la capa que debe comunicarse con una base de datos Firebase y con
  la api externa de Invertir On line (IOL).

- `connection.js` : se encarga de la conexión a la base de datos Firebase utilizando las credenciales proporcionadas en variables de entorno.

- `usersData.js` : proporciona funciones para interactuar con la colección de usuarios en la base de datos.

- **getUsers():** Obtiene la información de todos los usuarios.
- **findUserByMail(mail):** Encuentra un usuario por su dirección de correo electrónico.
- **createUser(newUser):** Crea un nuevo usuario.
- **findUserById(userId):** Encuentra un usuario por su ID.
- **deleteUserById(userId):** Elimina un usuario por su ID.
- **updateUser(userId, userNewValues):** Actualiza la información de un usuario.

-`categoriesData.js` : proporciona funciones para interactuar con la colección de categorías en la base de datos.

- **getCategories(userId):** Obtiene las categorías de gastos para un usuario.
- **createCategory(userId, category):** Crea una nueva categoría para un usuario.
- **updateCategory(userId, categoryId, category):** Actualiza una categoría existente.
- **deleteCategory(userId, categoryId):** Elimina una categoría.

-`transactionsData.js` proporciona funciones para interactuar con la colección de transacciones en la base de datos.

- **createTransaction(userId, transaction):** Crea una nueva transacción para un usuario.
- **getTransactions(userId):** Obtiene todas las transacciones de un usuario.
- **deleteTransaction(userId, transactionId):** Elimina una transacción.

-`portfolioData.js` : proporciona funciones para interactuar con la colección de activos en la cartera de un usuario.

- **buyAsset(userId, newAsset):** Compra un nuevo activo para la cartera de un usuario.
- **getPortfolio(userId):** Obtiene la cartera de inversiones de un usuario.
- **getAssetById(userId, assetId):** Obtiene detalles de un activo específico.
- **updateAsset(userId, assetId, quantity, purchasePrice, histQuantitiesUpdated, histPricesUpdated):** Actualiza la información de un activo en la cartera.
- **deleteAssetById(userId, assetId):** Elimina un activo de la cartera.

-`instrumentsData.js` proporciona funciones para obtener datos financieros de diferentes instrumentos.

- **getCedears():** Obtiene datos sobre cedears.
- **getStocks():** Obtiene datos sobre acciones.
- **getGovernmentBonds():** Obtiene datos sobre bonos del gobierno.
- **getCorporateBonds():** Obtiene datos sobre obligaciones negociables.
- **getInvestmentFund():** Obtiene datos sobre fondos comunes de inversión (FCI).
- **getInvestmentFundData(symbol):** Obtiene datos específicos de un FCI.
- **getSymbolData(symbol):** Obtiene datos de un instrumento específico.
- **getAllInstruments():** Obtiene datos de todos los instrumentos.

-`iolConnection.js` : se encarga de la conexión con la API de IOL (InvertirOnline) para obtener datos de instrumentos financieros.

- **checkToken():** Verifica y refresca el token de acceso de IOL.

## Configuración del Proyecto

### **Instalación de Dependencias:**

npm install

### Configuración de Variables de Entorno

Asegurese de configurar las variables de entorno necesarias en un archivo `.env`. Deberá incluir credenciales de Firebase e Invertir On Line específicas del entorno.

### Ejecución del Servidor

npm start

### Información del Servidor

El servidor estará en funcionamiento en [http://localhost:3000]

# Endpoints Principales

## Usuarios

- **GET /api/users/:userId:** Obtener información de un usuario específico.
- **POST /api/users/register:** Registrar un nuevo usuario.
- **POST /api/users/login:** Iniciar sesión.

## Categorías de Gastos

- **GET /api/categories/:userId:** Obtener categorías de gastos para un usuario.
- **POST /api/categories/:userId:** Crear una nueva categoría.
- **PUT /api/categories/update/:userId/:categoryId:** Actualizar una categoría existente.
- **DELETE /api/categories/delete/:userId/:categoryId:** Eliminar una categoría.

## Transacciones Financieras

- **POST /api/transactions/createTransaction/:userId:** Registrar una nueva transacción.
- **GET /api/transactions/getTransactions/:userId:** Obtener todas las transacciones de un usuario.
- **POST /api/transactions/deleteTransaction/:userId/:transactionId:** Eliminar una transacción.
- **GET /api/transactions/singleTransaction/:userId/:idTransaction:** Obtener detalles de una transacción específica.
- **PUT /api/transactions/updateTransaction/:userId/:idTransaction:** Actualizar una transacción.

## Cartera de Inversiones

- **POST /api/portfolio/buyAsset/:userId:** Comprar un nuevo activo para la cartera.
- **GET /api/portfolio/getPortfolio/:userId:** Obtener la cartera de inversiones de un usuario.
- **GET /api/portfolio/getAssetById/:userId/:assetId:** Obtener detalles de un activo específico.
- **PUT /api/portfolio/sellAsset/:userId:** Vender un activo de la cartera.

## Datos Financieros de Instrumentos

- **POST /api/instruments/acciones:** Obtener datos sobre acciones.
- **POST /api/instruments/titulosPublicos:** Obtener datos sobre bonos del gobierno.
- **POST /api/instruments/obligacionesNegociables:** Obtener datos sobre obligaciones negociables.
- **POST /api/instruments/FCI:** Obtener datos sobre fondos comunes de inversión (FCI).
- **GET /api/instruments/FCI/:simbolo:** Obtener datos específicos de un FCI.
- **GET /api/instruments/simbolo/:simbolo:** Obtener datos de un instrumento específico.
- **POST /api/instruments/TODOS:** Obtener datos de todos los instrumentos.

## Datos Financieros para Gráficos

- **GET /api/transactions/getDataGraph/:userId:** Obtener datos para representación gráfica.

¡Gracias por utilizar FINCE!
