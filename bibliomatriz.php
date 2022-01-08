<?php

ini_set("display_errors","1");
ini_set("display_startup_errors","1");
error_reporting(E_ALL);

function declarar_get($array){
	foreach( $array as $variable ){
		define($variable, $_GET[$variable]??null);
	}
}
function borrar_archivo($ruta,$o){
	$bin_url_inicio_barra = substr($ruta,0,1)=="/";
	if($bin_url_inicio_barra){
		array_push($o->registro,"ebia1 Advertencia: El archivo '$ruta' es del sistema, por eso no se va a borrar.");
	}else{
		$bin_existe_archivo = file_exists($ruta);
		if($bin_existe_archivo){
			$bin_borrar_archivo = unlink($ruta);
			if($bin_borrar_archivo){
				array_push($o->registro,"ebia3 Archivo '$ruta' borrado correctamente.");
			}else{
				array_push($o->registro,"ebia2 El archivo o carpeta '$ruta' existe, pero no se pudo borrar.");
			}
		}else{
			array_push($o->registro,"ebia4 Advertencia: La ruta '$ruta' no contiene información, por eso no se va a borrar su contenido.");
		}
	}
}
function borrar_carpeta($ruta,$o){
	$bin_url_inicio_barra = substr($ruta,0,1)== "/";
	if($bin_url_inicio_barra){
		array_push($o->registro,"ebia1 Advertencia: La carpeta '$ruta' es del sistema, por eso no se va a borrar.");
	}else{
		$bin_borrar_carpeta = rmdir($ruta);
		if($bin_borrar_carpeta){
			array_push($o->registro,"ebca1 Carpeta '$ruta' borrada correctamente.");
		}else{
			array_push($o->registro,"ebca0 Advertencia: La carpeta '$ruta' no se pudo borrar.");
		}
	}
}
function borrar_url($ruta,$o){
	if($ruta){
		$rutas = glob( $ruta ."/*", GLOB_MARK );
		foreach( $rutas as $url ){
			if(substr($url,-1)=="/"){
				borrar_url($url,$o);
			}else{
				borrar_archivo($url,$o);
			}
		}
		$bin_es_carpeta = is_dir("$ruta");
		if($bin_es_carpeta){
			borrar_carpeta($ruta,$o);
		}else{
			borrar_archivo($ruta,$o);
		}
	}else{
		array_push($o->registro,"ebu Advertencia: La ruta '$ruta' es nula, por eso no se va a intentar borrar ningún archivo");
	}
	return $o;
}
function crear_carpeta($ruta,$o){
	$bin_crear_carpeta = mkdir($ruta, 0777, true);
	if($bin_crear_carpeta){
		array_push($o->registro,"ecap1 Carpeta '$ruta' creada correctamente.");
	}else{
		array_push($o->registro,"ecap0 Advertencia: La carpeta '$ruta' no se pudo crear.");
	}
}
function crear_archivo($ruta,$datos,$o){
	$var_crear_archivo = file_put_contents($ruta,$datos);
	if($var_crear_archivo===strlen($datos)){
		array_push($o->registro,"ecai1 Archivo '$ruta' creado correctamente.");
	}else{
		if($var_crear_archivo===false){
			array_push($o->registro,"ecai3 Advertencia: El archivo '$ruta' no se pudo crear.");
		}else{
			array_push($o->registro,"ecai2 Advertencia: El archivo '$ruta' se pudo crear, pero su contenido es parcial.");
		}
	}
}
function registro_url_tiene_info($ruta,$o){
	array_push($o->registro,"euti La ruta '$ruta' contiene información.");
}
function crear_carpeta_si_no_existe($ruta,$o){
	$retorno = 0;
	$bin_existe_url = file_exists($ruta);
	if($bin_existe_url){
		$bin_es_carpeta = is_dir("$ruta");
		if($bin_es_carpeta){
			array_push($o->registro,"euti La carpeta '$ruta' existía.");
			$retorno = 3;
		}else{
			borrar_url($ruta,$o);
			crear_carpeta($ruta,$o);
			$retorno = 2;
		}
	}else{
		crear_carpeta($ruta,$o);
		$retorno = 1;
	}
	return $retorno;
}
function crear_archivo_si_no_existe($ruta,$datos,$o){
	$retorno = 0;
	$bin_existe_url = file_exists($ruta);
	if($bin_existe_url){
		$bin_es_carpeta = is_dir("$ruta");
		if($bin_es_carpeta){
			borrar_url($ruta,$o);
			crear_archivo($ruta,$datos,$o);
			$retorno = 3;
		}else{
			array_push($o->registro,"euti El archivo '$ruta' existía.");
			$retorno = 2;
		}
	}else{
		crear_archivo($ruta,$datos,$o);
		$retorno = 1;
	}
	return $retorno;
}
function obtener_info($ruta){
	return "Nombre de la bibliomatriz: $ruta
";
}
function crear_bibliomatriz_carpeta_contenido($o){
	crear_archivo($o->url."/info.txt",obtener_info($o->nombre),$o);
	crear_archivo($o->url."/bibliomatriz.json",$o->datos,$o);
}
function generar_url($ruta,$unificado,$o){
	if($unificado){
		$o->url = "$ruta.json";
	}else{
		$o->url = "$ruta";
	}
}
function generar_datos($ruta,$unificado,$nombre,$o){
	if($unificado){
		$o->datos = json_encode(array($ruta,$nombre))."\n";
	}else{
		$o->datos = json_encode(array($nombre))."\n";
	}
}
function crear_bibliomatriz($ruta,$nombre,$unibinop){
	$o = (object)array();
	$o->bibma = array();
	$o->registro = array("Creando bibliomatriz.");
	$o->unibinop = $unibinop;
	$o->tipo =      intdiv($unibinop,2**0)%2;
	$o->unificado = intdiv($unibinop,2**1)%2;
	generar_url  ($ruta,$o->unificado,$o);
	generar_datos($ruta,$o->unificado,$nombre,$o);
	$o->nombre = $nombre;
	$o->url = "libros/$o->url";
	array_push($o->registro,"¿Es un JSON unificado?: $o->unificado; Crear solo si no existe: $o->tipo; Nombre: $o->nombre");
	if($o->tipo==0){
		borrar_url($o->url,$o);
		if($o->unificado==0){
			crear_carpeta($o->url,$o);
			crear_bibliomatriz_carpeta_contenido($o);
		}
		if($o->unificado==1){
			crear_archivo($o->url,$o->datos,$o);
		}
	}
	if($o->tipo==1){
		if($o->unificado==0){
			$real_url_creada = crear_carpeta_si_no_existe($o->url,$o);
			if( $real_url_creada==1 || $real_url_creada==2 ){
				crear_bibliomatriz_carpeta_contenido($o);
			}
		}
		if($o->unificado==1){
			$real_url_creada = crear_archivo_si_no_existe($o->url,$o->datos,$o);
		}
	}
	return $o;
}
function borrar_bibliomatriz($ruta,$unificado){
	$o = (object)array();
	$o->registro = array("Borrando bibliomatriz.");
	generar_url  ($ruta,$unificado,$o);
	$o->url = "libros/$o->url";
	array_push($o->registro,"¿Es un JSON unificado?: $unificado;");
	borrar_url($o->url,$o);
	return $o;
}


declarar_get(array("f","r","n","u"));

if(f=="c"){
	echo json_encode(crear_bibliomatriz(r,n,u));
}
if(f=="b"){
	$u = u=="true"?1:0;
	echo json_encode(borrar_bibliomatriz(r,$u));
}

?>
