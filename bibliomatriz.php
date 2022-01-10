<?php

ini_set("display_errors","1");
ini_set("display_startup_errors","1");
error_reporting(E_ALL);

function oi($o,$propiedad){
	return $o->$propiedad;
}
function declarar_get($array){
	foreach( $array as $variable ){
		define($variable, $_GET[$variable]??null);
	}
}
function borrar_directorio_sin_contenido($url){ // Por hacer
	;
}
function borrar_archivo($url,$o){
	$bin_url_inicio_barra = substr($url,0,1)=="/";
	if($bin_url_inicio_barra){
		array_push($o->registro,"abia1 Advertencia: El archivo '$url' es del sistema, por eso no se va a borrar.");
	}else{
		$bin_existe_archivo = file_exists($url);
		if($bin_existe_archivo){
			$bin_borrar_archivo = unlink($url);
			if($bin_borrar_archivo){
				array_push($o->registro,"ebia3 Archivo '$url' borrado correctamente.");
			}else{
				array_push($o->registro,"ebia2 El archivo o carpeta '$url' existe, pero no se pudo borrar.");
			}
		}else{
			array_push($o->registro,"abia4 Advertencia: La ruta '$url' no contiene información, por eso no se va a borrar su contenido.");
		}
	}
}
function borrar_carpeta($url,$o){
	$bin_url_inicio_barra = substr($url,0,1)== "/";
	if($bin_url_inicio_barra){
		array_push($o->registro,"abca1 Advertencia: La carpeta '$url' es del sistema, por eso no se va a borrar.");
	}else{
		$bin_borrar_carpeta = rmdir($url);
		if($bin_borrar_carpeta){
			array_push($o->registro,"ebca3 Carpeta '$url' borrada correctamente.");
		}else{
			array_push($o->registro,"abca2 Advertencia: La carpeta '$url' no se pudo borrar.");
		}
	}
}
function borrar_url($url,$o){
	$a = __FUNCTION__;
	if($url){
		$rutas = glob( $url ."/*", GLOB_MARK );
		foreach( $rutas as $ruta ){
			if(substr($ruta,-1)=="/"){
				$a($ruta,$o);
			}else{
				borrar_archivo($ruta,$o);
			}
		}
		$bin_es_carpeta = is_dir("$url");
		if($bin_es_carpeta){
			borrar_carpeta($url,$o);
		}else{
			borrar_archivo($url,$o);
		}
	}else{
		array_push($o->registro,"abo Advertencia: La ruta '$url' es nula, por eso no se va a intentar borrar ningún archivo");
	}
	return $o;
}
function crear_carpeta($url,$o){
	$bin_existe_url = file_exists($url);
	if(!$bin_existe_url){
		$bin_crear_carpeta = mkdir($url, 0777, true);
		if($bin_crear_carpeta){
			array_push($o->registro,"de3 Carpeta '$url' creada correctamente.");
		}else{
			array_push($o->registro,"ade2 Advertencia: La carpeta '$url' no se pudo crear.");
		}
	}else{
		array_push($o->registro,"ade0 Advertencia: La carpeta '$url' existía.");
	}
}
function crear_subcarpetas($url,$o){
	$partes = explode("/",$url);
	$t = count($partes);
	for($i=1;$i<$t;++$i){
		$sector = array_slice($partes,0,$i);
		$subcarpeta = implode("/", $sector);
		crear_carpeta($subcarpeta,$o);
	}
	return $t;
}
function crear_archivo($url,$datos,$o){
	$var_subcarpetas = crear_subcarpetas($url,$o);
	$var_crear_archivo = file_put_contents($url,$datos);
	if(!$datos){
		$datos = "";
	}
	if($var_crear_archivo===strlen($datos)){
		array_push($o->registro,"co1 Archivo '$url' creado correctamente.");
	}else{
		if($var_crear_archivo===false){
			array_push($o->registro,"aco3 Advertencia: El archivo '$url' no se pudo crear.");
		}else{
			array_push($o->registro,"aco2 Advertencia: El archivo '$url' se pudo crear, pero su contenido es parcial.");
		}
	}
}
function crear_carpeta_si_no_existe($url,$o){
	$retorno = 0;
	$bin_existe_url = file_exists($url);
	if($bin_existe_url){
		$bin_es_carpeta = is_dir("$url");
		if($bin_es_carpeta){
			array_push($o->registro,"cas La carpeta '$url' existía.");
			$retorno = 3;
		}else{
			borrar_url($url,$o);
			crear_carpeta($url,$o);
			$retorno = 2;
		}
	}else{
		crear_carpeta($url,$o);
		$retorno = 1;
	}
	return $retorno;
}
function crear_archivo_si_no_existe($url,$datos,$o){
	$retorno = 0;
	$bin_existe_url = file_exists($url);
	if($bin_existe_url){
		$bin_es_carpeta = is_dir("$url");
		if($bin_es_carpeta){
			borrar_url($url,$o);
			crear_archivo($url,$datos,$o);
			$retorno = 3;
		}else{
			array_push($o->registro,"dus El archivo '$url' existía.");
			$retorno = 2;
		}
	}else{
		crear_archivo($url,$datos,$o);
		$retorno = 1;
	}
	return $retorno;
}
function crear_bibliomatriz_carpeta_contenido($o){
	crear_archivo($o->url."/info.txt",obtener_info($o->nombre),$o);
	crear_archivo($o->url."/bibma.json",$o->datos,$o);
}
function generar_url($url,$o){
	$subcarpeta = json_decode(file_get_contents("subcarpeta.json"))[0];
	$o->unificado = es_unificado($url);
	$o->ext = $o->unificado?"json":"";
	$o->url = "$subcarpeta/$url$o->ext";
}
function generar_datos($url,$o){
	$o->unificado = es_unificado($url);
	$o->datos = json_encode($o->bibma)."\n";
}
function obtener_info($url){
	return "Nombre de la bibliomatriz: $url
";
}
function es_unificado($url){
	return (substr($url,-1)=="."
		  ||substr($url,-5)==".json"
	)?1:0;
}
function crear_bibliomatriz($url,$nombre,$tipo){
	$o = (object)array();
	$o->bibma = array($url,$nombre);
	$o->registro = array("Creando bibliomatriz.");
	if($url){
		$o->unificado = es_unificado($url);
		$o->tipo = $tipo;
		$a = $o->unificado?"Sí":"No";
		$b = $o->tipo?"Sí":"No";

		generar_url($url,$o);
		generar_datos($url,$o);
		$o->nombre = $nombre;
		
		array_push($o->registro,"¿Es un JSON unificado?: '$a'; Crear solo si no existe: '$b'; Ruta: '$url'; Nombre: '$o->nombre'");
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
	}else{
		array_push($o->registro,"La ruta '$url' es nula.");
	}
	return $o;
}
function borrar_bibliomatriz($url){
	$o = (object)array();
	$o->registro = array("Borrando bibliomatriz.");
	$o->unificado = es_unificado($url);
	$a = $o->unificado?"Sí":"No";
	if($url){
		generar_url($url,$o);
		array_push($o->registro,"¿Es un JSON unificado?: '$a';");
		borrar_url($o->url,$o);
	}else{
		array_push($o->registro,"La ruta '$url' es nula.");
	}
	return $o;
}

function programa(){
	declarar_get(array("f","r","n","t"));
	if(f=="c"){
		echo json_encode(crear_bibliomatriz(r,n,t));
	}
	if(f=="b"){
		echo json_encode(borrar_bibliomatriz(r));
	}
}
programa();

?>
