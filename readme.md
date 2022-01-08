# bibliomatriz

Gestor de base de datos de tipo matriz JSON, es decir arrays de arrays.

Una bibliomatriz es una biblioteca de matrices JSON, que son arrays bidimensionales, usada como bases de datos.

Advertencia: Proyecto en desarrollo, por ahora solo se hablará de las especificaciones.

## Ejemplos de cada función:

```php
$b = crear_bibliomatriz("b","B",3);   // bibma = c(ruta,nombre,unibinop)
crear_tabla($b,"t",["c0","c1","c2"]); // c(bibma,tabla,fila)
apilar($b,"t",["v0 v1 v2"]);          // a(bibma,tabla,fila)
buscar($b,"t","c","v");               // b(bibma,tabla,clave,valor)
cambiar($b,"t","c","v",["w0","w1"]);  // c(bibma,tabla,clave,valor,fila)
borrar_filas($b,"t","c0","v");        // b(bibma,tabla,clave,valor)
borrar_tabla($b,"t");                 // b(bibma,tabla)
borrar_bibliomatriz($b);              // b(bibma)
ver($b,"html",1);                     // v(bibma,formato,binop)
```

## Explicaciones:

### `crear_bibliomatriz`: Crea una nueva bibliomatriz

 - `ruta`: Ruta de la carpeta o archivo JSON.
 - `unibinop`: Opciones binarias unificadas.

Ociones de `unibinop`:
 
 - `unificado`: Parámetro binario:
   - Con valor `0` crea una carpeta.
   - Con valor `1` crea solo un archivo.
 - `tipo`: Parámetro binario:
   - Con valor `0` fuerza el reemplazo.
   - Con valor `1` solo si no existe la crea.

Para crear el parámetro `unibinop` es necesario hacer una multiplicación:

 - `unificado * 2 + tipo`

### `crear_tabla`: Crea una nueva tabla

 - `bibma`: Biblioteca.
 - `tabla`: Nombre de la tabla.
 - `fila`: Array de strings con los nombres de cada columna.

### `apilar`: Crea una nueva fila en una tabla

 - `bibma`: Biblioteca.
 - `tabla`: Nombre de la tabla.
 - `fila`: Array de strings con los valores de cada columna.

### `buscar`: Devuelve filas que coinciden con clave y valor

 - `bibma`: Biblioteca.
 - `tabla`: Nombre de la tabla.
 - `clave`: Nombre de la columna.
 - `valor`: Valor de la celda que pertenece a la columna.

### `cambiar`: Cambia el valor o los valores de una fila

 - `bibma`: Biblioteca.
 - `tabla`: Nombre de la tabla.
 - `clave`: Nombre de la columna.
 - `valor`: Valor de la celda que pertenece a la columna.
 - `fila`: Array con el valor o los valores nuevos.

### `borrar_filas`: Borra las filas que coinciden con clave y valor

 - `bibma`: Biblioteca.
 - `tabla`: Nombre de la tabla.
 - `clave`: Nombre de la columna.
 - `valor`: Valor de la celda que pertenece a la columna.

### `borrar_tabla`: Borra la tabla

 - `bibma`: Biblioteca.
 - `tabla`: Nombre de la tabla.

### `borrar_bibliomatriz`: Borra la bibliomatriz

 - `bibma`: Biblioteca.

### `ver`: Convierte la bibliomatriz a diferentes formatos

 - `bibma`: Biblioteca.
 - `formato`: El formato que tendrá la bibliomatriz.
   - Si es `html_a` lo convierte a HTML en forma de tabla.
   - Si es `html_b` lo convierte a HTML en forma de texto.
   - Si es `json` lo convierte a un array JSON.
 - `binop`: Parámetro binario.
   - Con valor `0` no muestra la bibliomatriz.
   - Con valor `1` muestra la bibliomatriz.

## Notas

 - Un string (cadena en inglés), es una cadena de caracteres.
 - `bibma` es el parámetro que referencia a la bibliomatriz declarada. 
