function substr(s,i,f){
	return s.slice(i,f)
}
function json_encode(x){
	return JSON.stringify(x)
}
function array_push(a,b){
	return a.push(b)
}
function eval_servicio(funciones,nombre){
	eval("window."+nombre+"="+funciones.filter(x=>{
		return new RegExp(`function ${nombre}`,"").test(x)
	})[0].replace(/"/g,"`")
		.replace(/([^(]\$)(\w*)/g,"$1{$2}")
		.replace(/[(,]\$(\w*)/g,"($1")
	)
	return window[nombre]
}
function ls_obtener_carpeta_libro(){
	var libro = localStorage.getItem("libro")
	return libro
}
function ls_crear_carpeta_libro(){
	var ls_libros = localStorage.getItem("libro")
	var libro = null
	if(ls_libros==null){
		localStorage.setItem("libro","[]")
	}
	libro = ls_obtener_carpeta_libro()
	return libro
}
function ls_generar_url(url,o){
	subcarpeta = "libros/";
	o.unificado = es_unificado(url);
	o.ext = o.unificado?"json":"";
	o.url = `${subcarpeta}${url}${o.ext}`
}
function ls_generar_datos(url,o){
	o.unificado = es_unificado(url);
	o.datos = `${json_encode(o.bibma)}\n`;
}
function ls_crear_bibliomatriz(x,url,nombre,tipo){
	var o = {}, a = null, b = null
	var funciones = x.match(/(function .*{(.|\s)+?}\n)/gm)
	var info = null

	ls_crear_carpeta_libro()
	eval_servicio(funciones,"obtener_info")
	eval_servicio(funciones,"es_unificado")

	console.log("es_unificado",es_unificado(url))

	o.bibma = [url,nombre];
	o.registro = ["Creando bibliomatriz."]

	o.unificado = es_unificado(url)
	o.tipo = tipo
	a = o.unificado?"Sí":"No"
	b = o.tipo?"Sí":"No"

	ls_generar_url(url,o)
	ls_generar_datos(url,o)
	o.nombre = nombre
	
	array_push(o.registro,`¿Es un JSON unificado?: ${a}; Crear solo si no existe: ${b}; Nombre: ${o.nombre}`)

	console.log("url",o,o.url)

	info = obtener_info(nombre)
	return o	
}

function mostrar_log(registros){
	var pre = document.querySelector("pre")
	var div = document.createElement("div")
	var ndivs = [...pre.querySelectorAll("div")].length
	var ite = [...pre.querySelectorAll(".n1")].slice(-1)[0]
	var i = ite && +ite.innerHTML || 0
	var j = 0
	if(ndivs%2){
		div.style["background-color"] = "#eeee"
	}else{
		div.style["background-color"] = "#ddde"
	}
	if(/^(\s|\t)+$/.test(pre.innerHTML)){
		pre.innerHTML = ""
	}
	registros.map(x=>{
		var a = document.createElement("a")
		var b = document.createElement("a")
		var c = document.createElement("a")
		a.className = "n1"
		b.className = "n2"
		a.innerHTML = `${++i}`
		b.innerHTML = ` ${++j} `
		c.innerHTML = x + "\n"
		div.appendChild(a)
		div.appendChild(b)
		div.appendChild(c)
	})
	pre.appendChild(div)
	return pre
}
function vaciar_log(){
	var pre = document.querySelector("pre")
	pre.innerHTML = "\n"
}

function crear_bibliomatriz(){
	var tipo = +document.querySelector("#tipo").checked
	var unificado = +document.querySelector("#unificado").checked
	var url = document.querySelector("#url").value
	var nombre = document.querySelector("#nombre").value
	var o = null
	if(unificado){url += "."}
	var es_gh = parseInt(location.href.split("/")[2].match(/\w+/g)[1],36)==999068051

	var f = (fetch(`bibliomatriz.php?f=c&r=${url}&n=${nombre}&t=${tipo}`)
		.then(x=>x.text())
		.then(x=>{
			if(!es_gh){
				analizado = JSON.parse(x)
				mostrar_log(analizado.registro)
			}else{
				o = ls_crear_bibliomatriz(x,url,nombre,tipo)
				mostrar_log(o.registro)
			}
		})
	)
}

function borrar_bibliomatriz(){
	var unificado = +document.querySelector("#unificado").checked
	var url = document.querySelector("#url").value
	if(unificado){url += "."}
	var f = (fetch(`bibliomatriz.php?f=b&r=${url}`)
		.then(x=>x.text())
		.then(x=>{
			var analizado = JSON.parse(x)
			mostrar_log(analizado.registro)
			console.log(analizado)
		})
	)
}
