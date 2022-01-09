# bibliomatriz

Gestor de base de datos de tipo matriz JSON, es decir arrays de arrays.

Una bibliomatriz es una biblioteca de matrices JSON, que son arrays bidimensionales, usada como bases de datos.

Advertencia: Proyecto en desarrollo, por ahora solo se hablará de las especificaciones.

## Funciones principales

 - ✅ `crear_bibliomatriz`
 - ✅ `borrar_bibliomatriz`
 - `crear_tabla`
 - `apilar`
 - `buscar`
 - `cambiar`
 - `borrar_filas`
 - `borrar_tabla`
 - `ver`

## Ejemplos de cada función:

```php
$b = crear_bibliomatriz("b","B",1);     // c(url,nombre,tipo)
borrar_bibliomatriz($b);                // b(url)
crear_tabla($b,"t",1,["c0","c1","c2"]); // c(url,tabla,tipo,fila)
apilar($b,"t",1,["v0 v1 v2"]);          // a(url,tabla,tipo,fila)
cambiar($b,"t",1,"c","v",["w0","w1"]);  // c(url,tabla,tipo,clave,valor,fila)
buscar($b,"t","c","v");                 // b(url,tabla,clave,valor)
borrar_filas($b,"t","c0","v");          // b(url,tabla,clave,valor)
borrar_tabla($b,"t");                   // b(url,tabla)
ver($b,"html",1);                       // v(url,formato,binop)
```

## Explicaciones:

 - `url`: Ruta de la bibliomatriz.
   - Si termina en `.json` o en `.` es un archivo.
   - Si termina en `.` se cambia a `.json`.
   - De lo contrario, es una carpeta con archivos.

### ✅ `crear_bibliomatriz`: Crea una nueva bibliomatriz

 - `url`: Ruta de la bibliomatriz.
 - `nombre`: Nombre de la bibliomatriz.
 - `tipo`: Parámetro binario:
   - Con valor `0` fuerza el reemplazo.
   - Con valor `1` solo si no existe la crea.

### ✅ `borrar_bibliomatriz`: Borra la bibliomatriz

 - `url`: Ruta de la bibliomatriz.

### `crear_tabla`: Crea una nueva tabla

 - `url`: Ruta de la bibliomatriz.
 - `tabla`: Nombre de la tabla.
 - `fila`: Array de strings con los nombres de cada columna.

### `apilar`: Crea una nueva fila en una tabla

 - `url`: Ruta de la bibliomatriz.
 - `tabla`: Nombre de la tabla.
 - `fila`: Array de strings con los valores de cada columna.

### `cambiar`: Cambia el valor o los valores de una fila

 - `url`: Ruta de la bibliomatriz.
 - `tabla`: Nombre de la tabla.
 - `clave`: Nombre de la columna.
 - `valor`: Valor de la celda que pertenece a la columna.
 - `fila`: Array con el valor o los valores nuevos.

### `buscar`: Devuelve filas que coinciden con clave y valor

 - `url`: Ruta de la bibliomatriz.
 - `tabla`: Nombre de la tabla.
 - `clave`: Nombre de la columna.
 - `valor`: Valor de la celda que pertenece a la columna.

### `borrar_filas`: Borra las filas que coinciden con clave y valor

 - `url`: Ruta de la bibliomatriz.
 - `tabla`: Nombre de la tabla.
 - `clave`: Nombre de la columna.
 - `valor`: Valor de la celda que pertenece a la columna.

### `borrar_tabla`: Borra la tabla

 - `url`: Ruta de la bibliomatriz.
 - `tabla`: Nombre de la tabla.

### `ver`: Convierte la bibliomatriz a diferentes formatos

 - `url`: Ruta de la bibliomatriz.
 - `formato`: El formato que tendrá la bibliomatriz.
   - Si es `html_a` lo convierte a HTML en forma de tabla.
   - Si es `html_b` lo convierte a HTML en forma de texto.
   - Si es `json` lo convierte a un array JSON.
 - `binop`: Parámetro binario.
   - Con valor `0` no muestra la bibliomatriz.
   - Con valor `1` muestra la bibliomatriz.

## Notas

 - Un string (cadena en inglés), es una cadena de caracteres.
 - Los que tienen el símbolo check ✅ ya están programados.
