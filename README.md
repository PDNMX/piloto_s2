

1.
# Especificaciones técnicas

  1.
## Pre - requisitos

El ambiente de pruebas debe estar instalado y configurado correctamente. Para más información, consulte la siguiente documentación:

1. **GOV UK\_IIR\_Interconnection of S2 and S3 of the PDN:** el cual muestra los pasos para la preparación del ambiente local, contempla lo relacionado a Docker, Docker Compose y Mongo, [Ref.[1]](#2q02kq3lfhwc).
2. **GOV UK\_Gen\_Interconnection of S2 and S3 of the PDN:** documentación del generador de datos sintéticos para los dos sistemas, [Ref.[2]](#a3ggzjvxdivo).
3. **GOV UK\_Oauth2\_Interconnection of S2 and S3 of the PDN:** documentación para la implementación del protocolo Oauth 2.0, [Ref.[3]](#kix.c7de96b3ai57).

Adicionalmente, se cuenta con un Anexo que incluye una de guía de ayuda sobre las diversas tecnologías utilizadas:

- **GOV UK\_Anexo\_Interconnection of S2 and S3 of the PDN** , [Ref.[4]](#xdfe451pw6sm).

  1.
## Ejecución del programa

El API para el sistema S2 se encuentra en el repositorio de Github de la PDN, en el siguiente link:

[https://github.com/PDNMX/piloto\_s2.git](https://github.com/PDNMX/piloto_s2.git)

- Para clonar el repositorio desde el CLI (Interfaz de línea de comandos) de su computador utilice el siguiente comando:

| $ **git clone https://github.com/PDNMX/piloto\_s2.git** |
| --- |

- Se le solicitará su usuario y contraseña de Github para acceder.

- Agregar el servicio s2 al final del archivo docker-compose.yml que se encuentra en el directorio   &#60;home_directory&#62;/sistema\_pdn/mongodb de la siguiente forma:


```sh
version: '3.1'
services:
  mongodb:
    image: mongo
    container_name: mongodb
    restart: always
    ports:
      - 27017:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${DB_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - ./mongo-volume:/data/db
      - ./mongod.conf:/etc/mongod.conf
      - ./log/:/var/log/mongodb/
    env_file:
      - .env
    command: ["-f", "/etc/mongod.conf"] 
  oauth20:
    restart: always
    container_name: oauth20
    build:
      context: ../piloto_oauth2.0/
      dockerfile: Dockerfile
    ports:
      - 9003:9003    
    links:
      - mongodb
    depends_on:
      - mongodb
  s2:
    restart: always
    container_name: s2
    build:
        context: ../piloto_s2/
        dockerfile: Dockerfile
    ports:
      - 8080:8080
    links:
      - mongodb
    depends_on:
      - mongodb

 ```

Nota: La identación es importante, utilizar espacios, no tabuladores.

La variable context especifica la ubicación relativa ../piloto\_s2/ donde fue descargada la aplicación, y además, contiene el archivo Dockerfile incluido en la descarga de github.

La variable ports incluye el mapeo entre el puerto del host y el puerto interno del contenedor 8080:8080.

La variable container\_name especifica el nombre del contenedor s2 donde se encuentra la aplicación para el Sistema 2.

La variable links apunta al contenedor mongodb para que este contenedor s2 tenga acceso al contenedor mongodb equivalente a su dirección IP.

La variable depends\_on apunta al contenedor mongodb lo que establece la dependencia de este contenedor s2 sobre el contenedor mongodb.

  1.
## Variables de entorno

El archivo donde se contemplan las variables de entorno estará localizado en la siguiente ruta:

&#60;home_directory&#62;/sistema\_pdn/piloto\_s2/utils/.env

A continuación, se muestra un ejemplo del contenido que debe tener.

```sh
// SEED
SEED = YTBGD9YjAUhkjQk9ZXcb

USERMONGO = apiUsr
PASSWORDMONGO = <password>
HOSTMONGO = mongodb:27017
DATABASE= S2

```

Nota: Las diagonales // al inicio de línea indican que es un comentario

**USERMONGO** : Contiene el nombre del usuario apiUsr para acceder a la base de datos S2. Este usuario debe contar con los privilegios correspondientes y fue creado durante la instalación de MongoDB, [Ref.[1]](#2q02kq3lfhwc).

**PASSWORDMONGO** : Contiene la contraseña &#60;password&#62; del usuario apiUsr para acceder a la base de datos S2.

**HOSTMONGO** : Contiene la dirección IP mongodb y el puerto 27017 donde se encuentra alojada la base de datos. Se utiliza el link mongodb que se encuentra declarado en el archivo docker-compose.yml en lugar de la dirección IP. En este caso, tiene el valor de mongodb:27017.

**DATABASE** : Contiene el nombre de la base de datos S2.

**SEED** : Contiene la semilla YTBGD9YjAUhkjQk9ZXcb para la codificación del JSON Web Token (JWT)

**SEED**  **debe contener el mismo valor que se colocó en las variables de entorno del sistema de autorización Oauth 2.0** , [Ref.[3]](#kix.c7de96b3ai57).

  1.
## Desplegar Contenedor

- Una vez hecho lo anterior, ejecutar el docker compose desde el directorio _ **\&lt;home\_directory\&gt;** _/sistema\_pdn/mongodb que contiene el archivo docker-compose.yml de la siguiente forma:

| $ **docker-compose up -d** |
| --- |

Nota: En caso que MongoDB ya esté corriendo en un contenedor, sólo construirá la nueva imagen y se creará el nuevo contenedor s2.

- Verificar que todos los contenedores dentro del archivo docker-compose.yml estén corriendo con el siguiente comando:


| $ docker-compose ps|
| --- |

         Name                    Command            State        Ports          
-------------------------------------------------------------------------------------------
mongodb&ensp;&ensp;   				  docker-entrypoint.sh -f /e ...&ensp;   Up&ensp;      0.0.0.0:27017->27017/tcp  
oauth20&ensp; &ensp;        		  docker-entrypoint.sh yarn  ...&ensp;   Up&ensp;      0.0.0.0:9003->9003/tcp  
s2&ensp;&ensp;&ensp;&ensp; 			              docker-entrypoint.sh yarn  ...&ensp;   Up&ensp;      0.0.0.0:8080->8080/tcp  


Nota: El resultado puede variar de la imagen mostrada, verifique que los servicios definidos estén presentes en el resultado esperado.

  1.
## Esquemas en la base de datos

Dentro de MongoDB, se tiene la base de datos S2 para las siguientes colecciones que conciernen a la implementación de la API para el Sistema 2, y que ya fueron creadas durante la instalación de MongoDB, [Ref.[1]](#2q02kq3lfhwc).

Cada documento creado es almacenado en la base de datos S2 bajo la colección llamada spic(servidores públicos que intervienen en procesos de contrataciones). El esquema de esta colección está basado en el documento _Esquema de servidores públicos que intervienen en procesos de contrataciones_, [Ref.[5]](#kix.ta64ysrh3hmd).

##