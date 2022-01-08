<?php
include_once("bibliomatriz.php");

$bibma = crear_bibliomatriz("b","B",0);
echo "<div>Registro:</div>";
echo mostrar_log($bibma->registro);

$eliminado = borrar_bibliomatriz($bibma);
echo "<div>Borrando bibliomatriz:</div>";
echo mostrar_log($eliminado->registro);
?>
