# PixelX_backend

# Comandos instalación 

1. **Clonar Repositorio**

2. **Instalar Dependencias**
    ```sh
    yarn install
    ```
3. **Crear Base de Datos**
    - Ejemplo: `fval_db_development` (importante agregar el `development`)

4. **Crear archivo `.env` con:**
    ```plaintext
    DB_USER=Usuario_postgres
    DB_PASSWORD=12131415
    DB_HOST=localhost
    DB_NAME=fval_db
    ```
    - EJ: Si el usuario postgres no existe, crearlo con el comando:
        ```sh
        sudo -u postgres createuser --superuser fval_user
        ```

## Modo de Verificación

- **Ver usuario:**
    ```sh
    sudo -u postgres psql
    \du
    ```

- **Ver base de datos:**
    ```sh
    \c nombre_base
    ```

5. **Hacer Migración**
    ```sh
    yarn sequelize-cli db:migrate
    ```
6. **Migrar Seeds**
    ```sh
    yarn sequelize-cli db:seed:all
    ```
7. **Correr Servidor**
    ```sh
    yarn dev
    ```
8. **Correr rutas en Postman**

# Flujo

## Creacion / Ingreso partida

### RUTA: /prepartida/crear/privada

### Request

```
{
    "id_usuario": "5",
    "turnos": 30
}
```

### Response

```
{
    "estado": "disponible",
    "codigo": "934330",
    "id": 16,
    "turnos": 30,
    "updatedAt": "2024-05-10T22:47:08.004Z",
    "createdAt": "2024-05-10T22:47:07.996Z",
    "comienza": null,
    "ganador": null
}
```

- Esta ruta permite a los usuarios crear una partida privada. Devuelve detalles de la partida, incluyendo el código de acceso para poder compartirlo con los otros jugadores.

## Buscar partida privada
### RUTA: /prepartida/buscar/privada

### Request

```
{
    "id_usuario": "5",
    "codigo": "934330"
}
```
### Response

```
{
    "id": 16,
    "comienza": null,
    "turnos": 30,
    "ganador": null,
    "estado": "disponible",
    "codigo": "934330",
    "createdAt": "2024-05-10T22:47:07.996Z",
    "updatedAt": "2024-05-10T22:47:08.004Z"
}
```

- Mediante esta ruta los usuarios pueden unirse a una partida existente. 

- La unión se realiza mediante el código si la partida está "disponible" (menos de 3 jugadores dentro).

- Esta relación partida-jugador se llama "participacion".

## Buscar partida pública
### RUTA: /prepartida/buscar/publica

### Request

```
{
    "id_usuario": 7
}
```

### Response

```
{
    "id": 6,
    "comienza": null,
    "turnos": 20,
    "ganador": null,
    "estado": "disponible",
    "codigo": "None",
    "createdAt": "2024-05-10T22:00:37.084Z",
    "updatedAt": "2024-05-10T22:00:37.084Z"
}
```
- En esta ruta el usuario puede buscar partidas públicas disponibles (sin código de acceso). Se agrega el usuario a la partida disponible con un turno por defecto de 20. Si no hay disponibles, se crea una nueva.

- Esta relación partida-jugador se llama "participacion".

***

# Acciones de partida

## *Lanzar Dado*

### RUTA: /partida/lanzar

### Request

```None```

### Response

```
{
    "numero": 2
}
```

- Este método permite simular un dado virtual para determinar los turnos de la partida y avanzar durante el juego.

## *Verificar Orden*
### RUTA: /partida/verificar/orden

### Request

```
{
    "id_partida": 4,
    "dado1": 6,
    "jugador1ID": 7,
    "dado2": 4,
    "jugador2ID": 8,
    "dado3": 2,
    "jugador3ID": 9
}
```
### Response

```
{
    "message": "Orden de jugadores actualizado",
    "ordenJugadores": "7,8,9",
    "winnerID": 7,
    "tie": false
}
```

- Este método sirve para definir el orden de los jugadores durante toda la partida.

## *Mover Jugador*
### RUTA: /partida/mover/



### Request

```
{
    "cantidad_movimientos": 12,
    "id_partida": "15",
    "id_jugador": "11"
}
```

### Response

```
{
    "id": 11,
    "id_usuario": 6,
    "posicion": 13,
    "color": null,
    "dinero": 1000,
    "estado": "libre",
    "createdAt": "2024-05-10T22:32:44.859Z",
    "updatedAt": "2024-05-10T23:05:57.903Z"
}
```

- Permite al jugador moverse durante el juego y avanzar por las casillas. Si se supera la casilla 20, el jugador vuelve al principio del tablero.

## *Comprar propiedades*
### RUTA: /partida/comprar

### Request

```
{
    "id_jugador": 14,
    "id_partida": 16,
    "id_casilla": 2
}
```

### Response

```
{
    "id": 3,
    "id_jugador": 14,
    "id_propiedad": 1,
    "num_casas": 1,
    "updatedAt": "2024-05-11T22:02:23.775Z",
    "createdAt": "2024-05-11T22:02:23.775Z"
}
```	
- Se indica que jugador, dentro de que partida, compra una propiedad, descontandosele el valor de la misma y aumentando su patrimonio.

## *Construir casas*

### RUTA: /partida/construir

### Request

```
{
    "id_jugador": "14",
    "id_partida": "16",
    "id_casilla": "2",
    "num_casas": 2
}
```

### Response

```
{
    "id": 2,
    "id_jugador": 14,
    "id_propiedad": 1,
    "num_casas": 3,
    "createdAt": "2024-05-11T22:01:07.234Z",
    "updatedAt": "2024-05-11T22:10:01.965Z"
}
```
- Se indica que jugador, dentro de que partida, construye para tener una cantidad de casas en una propiedad, descontandosele el valor de las mismas y aumentando su patrimonio.

## Pagar renta
### RUTA: /partida/pagar/renta

### Request

```
{
    "id_jugador": "13",
    "id_partida": "16",
    "id_casilla": "2"
}
```

### Response

```
{
    "id": 13,
    "id_usuario": 5,
    "posicion": 1,
    "color": null,
    "dinero": 985,
    "estado": "libre",
    "createdAt": "2024-05-10T22:47:08.012Z",
    "updatedAt": "2024-05-11T22:26:14.729Z"
}
```
- Se indica que jugador, dentro de que partida, paga la renta de una propiedad, descontandosele el valor de la misma.