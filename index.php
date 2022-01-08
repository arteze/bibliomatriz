<?php
include_once("bibliomatriz.php");

$bibma = crear_bibliomatriz("b","B",0);
echo "<div>Registro:</div>";
echo mostrar_log($bibma->registro);

?>
