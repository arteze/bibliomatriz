<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

function mostrar_log($v){
	$volcado = print_r($v, true);
	echo "<pre style='background-color: #eee'>".htmlentities($volcado)."</pre>";
}
function borrar_archivo($ruta,$o){
	$bin_url_inicio_barra = substr($ruta,0,1)== "/";
	if($bin_url_inicio_barra){
		array_push($o->registro,"ebia1_$o->unibinop Advertencia: El archivo '$ruta' es del sistema, por eso no se va a borrar.");
	}else{
		$bin_existe_archivo = file_exists($ruta);
		if($bin_existe_archivo){
			$bin_borrar_archivo = unlink($ruta);
			if($bin_borrar_archivo){
				array_push($o->registro,"ebia3_$o->unibinop Archivo '$ruta' borrado correctamente.");
			}else{
				array_push($o->registro,"ebia2_$o->unibinop El archivo o carpeta '$ruta' existe, pero no se pudo borrar.");
			}
		}else{
			array_push($o->registro,"ebia4_$o->unibinop Advertencia: La ruta '$ruta' no contiene información, por eso no se va a eliminar su contenido.");
		}
	}
}
function borrar_carpeta($ruta,$o){
	$bin_url_inicio_barra = substr($ruta,0,1)== "/";
	if($bin_url_inicio_barra){
		array_push($o->registro,"ebia1_$o->unibinop Advertencia: La carpeta '$ruta' es del sistema, por eso no se va a borrar.");
	}else{
		$bin_borrar_carpeta = rmdir($ruta);
		if($bin_borrar_carpeta){
			array_push($o->registro,"ebca1_$o->unibinop Carpeta '$ruta' borrada correctamente.");
		}else{
			array_push($o->registro,"ebca0_$o->unibinop Advertencia: La carpeta '$ruta' no se pudo borrar.");
		}
	}
}
function borrar_url($ruta,$o){
	if($ruta){
		$rutas = glob( $ruta ."/*", GLOB_MARK );
		foreach( $rutas as $url ){
			if(substr($url,-1)== "/"){
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
		array_push($o->registro,"ebu_$o->unibinop Advertencia: La ruta '$ruta' es nula, por eso no se va a intentar borrar ningún archivo");
	}
	return $o;
}
function crear_carpeta($ruta,$o){
	$bin_crear_carpeta = mkdir($ruta, 0777, true);
	if($bin_crear_carpeta){
		array_push($o->registro,"ecap1_$o->unibinop Carpeta '$ruta' creada correctamente.");
	}else{
		array_push($o->registro,"ecap0_$o->unibinop Advertencia: La carpeta '$ruta' no se pudo crear.");
	}
}
function crear_archivo($ruta,$datos,$o){
	$var_crear_archivo = file_put_contents($ruta,$datos);
	if($var_crear_archivo===strlen($datos)){
		array_push($o->registro,"ecai1_$o->unibinop Archivo '$ruta' creado correctamente.");
	}else{
		if($var_crear_archivo===false){
			array_push($o->registro,"ecai3_$o->unibinop Advertencia: El archivo '$ruta' no se pudo crear.");
		}else{
			array_push($o->registro,"ecai2_$o->unibinop Advertencia: El archivo '$ruta' se pudo crear, pero su contenido es parcial.");
		}
	}
}
function registro_url_tiene_info($ruta,$o){
	array_push($o->registro,"euti_$o->unibinop La ruta '$ruta' contiene información.");
}
function crear_carpeta_si_no_existe($ruta,$o){
	$retorno = 0;
	$bin_existe_url = file_exists($ruta);
	if($bin_existe_url){
		$bin_es_carpeta = is_dir("$ruta");
		if($bin_es_carpeta){
			array_push($o->registro,"euti_$o->unibinop La carpeta '$ruta' existía.");
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
			array_push($o->registro,"euti_$o->unibinop El archivo '$ruta' existía.");
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
	crear_archivo($o->url."/info.txt",obtener_info($o->url),$o);
	crear_archivo($o->url."/bibliomatriz.json",$o->datos,$o);
}
function crear_bibliomatriz($ruta,$nombre,$unibinop){
	$o = (object)array();
	$o->bibma = array();
	$o->registro = array();
	$o->unibinop = $unibinop;
	$tipo =	  intdiv($unibinop,2**0)%2;
	$unificado = intdiv($unibinop,2**1)%2;
	if($unificado){
		$o->url = "$ruta.json";
		$o->datos = json_encode(array($ruta,$nombre))."\n";
	}else{
		$o->url = "$ruta";
		$o->datos = json_encode(array($nombre))."\n";
	}
	echo "<div>Tipo: $tipo; Unificado: $unificado</div>";
	if($tipo==0){
		borrar_url($o->url,$o);
		if($unificado==0){
			crear_carpeta($o->url,$o);
			crear_bibliomatriz_carpeta_contenido($o);
		}
		if($unificado==1){
			crear_archivo($o->url,$o->datos,$o);
		}
	}
	if($tipo==1){
		if($unificado==0){
			$real_url_creada = crear_carpeta_si_no_existe($o->url,$o);
			if( $real_url_creada==1 || $real_url_creada==2 ){
				crear_bibliomatriz_carpeta_contenido($o);
			}
		}
		if($unificado==1){
			$real_url_creada = crear_archivo_si_no_existe($o->url,$o->datos,$o);
			if( $real_url_creada==1 || $real_url_creada==3 ){
				// Resto
			}
		}
	}
	return $o;
}

?>
