var ls = {
	analizar_ficheros: function analizar_ficheros(v){ // Opcional
		// Función recursiva
		// Ver: analizar_ficheros_ejemplo
		var o = {}
		var v = v && v || "[]"
		var a = (v.constructor == String && JSON.parse(v) || v).map(x=>{
			if(x[1].constructor==Array){
				o[x[0]] = arguments.callee(x[1])
			}else{
				o[x[0]] = x[1]
			}
		})
		return o
	},
	analizar_ficheros_ejemplo: function analizar_ficheros_ejemplo(){ // Opcional
		var s = '[["a.json","[]"],["b.json","[]"],["c",[["c.json","[]"]]]]'
		return ls.analizar_ficheros(s)
	},
	eval_servicio: function eval_servicio(funciones,nombre){ // Opcional
		eval("window."+nombre+"="+funciones.filter(x=>{
			return new RegExp(`function ${nombre}`,"").test(x)
		})[0].replace(/"/g,"`")
			.replace(/([^(]\$)(\w*)/g,"$1{$2}")
			.replace(/[(,]\$(\w*)/g,"($1")
		)
		return window[nombre]
	},
	registrar_error_html: function registrar_error_html(a,r,s,d,o){ // Opcional
		var es_html = /html/i.test(s.constructor)
		var n = a.callee.name
		if(es_html){
			var t = ls.html_hacia_string(s,0)
			var u = ls.html_hacia_string(s,1)
			var e = x => `${r} Error: En '${n}' el parámetro '${x}' es una etiqueta HTML en vez de un string.`
			var j = e(t)
			var k = e(u)
			console.error(s,j)
			o.registro.push(k)
		}else{
			if(d){
				console.error(s,d)
				o.registro.push(d)
			}
		}
	},
	nodos: {
		nombre_aleatorio: function nombre_aleatorio(){
			return (Math.random()*2**53).toString(36).replace(/\d/g,"")
		},
		crear_archivo: function crear_archivo(){
			return Array(2).fill(0).map(x=>ls.nodos.nombre_aleatorio())
		},
		crear_carpeta: function crear_carpeta(a,b){
			return [
				ls.nodos.nombre_aleatorio(),[
					a && a || null,
					b && b || null
				]
			]
		},
		crear_carpeta_compleja: function crear_carpeta_compleja(){
			var archivo1 = ls.nodos.crear_archivo()
			var archivo2 = ls.nodos.crear_archivo()
			var carpeta1 = ls.nodos.crear_carpeta(archivo1,archivo2)
			var carpeta2 = ls.nodos.crear_carpeta(archivo1,archivo2)
			var carpeta3 = ls.nodos.crear_carpeta(carpeta1,carpeta2)
			return carpeta3
		},
		guardar: function guardar(){
			var a = ls.nodos.crear_carpeta_compleja()
			localStorage["b"] = JSON.stringify(a)
			return localStorage["b"]
		}
	},
	obtener_carpeta_libros: function obtener_carpeta_libros(){
		var libros = localStorage.getItem("libros")
		return libros
	},
	crear_carpeta_libros: function crear_carpeta_libros(){
		var libros = null
		var fichero = []
		var carpeta_libros = ls.obtener_carpeta_libros()
		if(carpeta_libros==null){
			localStorage.setItem("libros",ls.json_encode(fichero))
		}
		libros = ls.obtener_carpeta_libros()
		return libros
	},
	agregar_entidades_html: function(s,puede_agregar_entidades){
		var a = document.createElement("a")
		a.textContent = s
		return puede_agregar_entidades && a.innerHTML || s
	},
	html_hacia_string: function html_hacia_string(h,puede_agregar_entidades){
		console.log("h",h)
		return ls.agregar_entidades_html(`<${h.nodeName.toLowerCase()} ${
				([...h.attributes].map(x=>[
						x.name, JSON.stringify(x.value)
					].join("=")).join(" ")
				)
			}>`
		,puede_agregar_entidades)
	},
	ls_hacia_matriz: function ls_hacia_matriz(){
		var a = []
		Object.keys(localStorage).map(x=>{
			var v = localStorage[x]
			try{
				a.push([x,JSON.parse(v)])
			}catch(e){
				a.push([x,v])
			}
		})
		return a
	},
	debug_backtrace: function debug_backtrace(){
		console.trace()
	},
	array_push: function array_push(a,b){
		if(a.constructor==Array){
			a.push(b)
		}else{
			mostrar_log([`eap Error: El valor '${a}' no es un array.`])
		}
		return a
	},
	substr: function substr(s,c,o){
		var d = null
		if(s.constructor==String){
			d = s.slice(c[0],c[1])
		}else{
			ls.array_push(o.registro,`esu Error: El parámetro '${s}' no es un string.`)
		}
		return d
	},
	json_encode: function json_encode(x){
		return JSON.stringify(x)
	},
	strlen: function strlen(datos){
		return datos && datos.length || -1
	},
	implode: function implode(delimitador,array){
		return array && array.join(delimitador) || ""
	},
	explode: function explode(delimitador,url){
		return url && url.split(delimitador) || []
	},
	count: function count(array){
		return array && array.length || null
	},
	array_slice: function array_slice(array,i,j){
		return array && array.slice(i,j) || array
	},
	json_decode: function json_decode(s,o){
		var d = null
		try{
			d = JSON.parse(s)
		}catch(e){
			ls.array_push(o.registro,`jos Error: El JSON. '${s}' no se pudo analizar.`)
		}
		return d
	},
	dir: function dir(o){
		var d = [], o = o && o || [], pila = ls.ls_hacia_matriz()
		while(pila.length>0){
			var x = pila[0], c = x && x[0], v = x && x[1]
			if(x && x.length==2 && c.constructor==String){
				d.push(c)
				if(v && v.constructor==Array){
					if(v.length==2 && v[0].constructor==String){
						v = [v]
					}
					v.map(x=>{
						x[0] = `${c}/${x[0]}`
						pila.push(x)
					})
				}
			}
			pila.shift()
		}
		return d
	},
	leer_url: function(url){ // Por hacer
		console.log("leer_url",url)
	},
	file_exists: function file_exists(url,o){
		var d = false
		var partes = null
		var puntero = localStorage
		partes = url.split("/") || []
		for(var i=0;i<partes.length;++i){
			var v = null
			var a = partes[i]
			if(i==0){
				v = puntero[a]
				puntero = v && JSON.parse(v) || null
			}else{
				if(puntero && puntero.filter){
					puntero = puntero.filter(x=>x[0]==a)[0]
					puntero = (i<partes.length-1) && puntero && puntero[1]
				}else{
					puntero = null
				}
			}
			if(!puntero){break}
		}
		return !!puntero
	},
	glob: function glob(url,bandera){ // Por hacer
		var todo = []
		console.log("glob_mark",url,bandera)
		if(bandera=="glob_mark"){
			;
		}
		return todo;
	},
	is_dir: function is_dir(url){ // Por hacer
		var d = false
		return d
	},
	unlink: function unlink(url){ // Por hacer
	},
	mkdir: function mkdir(url,permisos,recursivo){ // Por hacer
	},
	rmdir: function rmdir(url){ // Por hacer
		
	},
	file_get_contents: function file_get_contents(url,retrollamada){ // Por hacer
		console.log("file_get_contents",url,retrollamada)
		fetch(url).then(x=>x.text()).then(x=>retrollamada(x))
	},
	file_put_contents: function file_put_contents(url,datos){ // Por hacer
		
	},
	es_gh: function es_gh(){
		return location.href.split("/")[2].match(/\w+/g)[1] + "A=" == btoa('\x82+a¹°')
			|| document.querySelector("#sinphp").checked
	},
	borrar_archivo: function borrar_archivo(url,o){
		var bin_url_inicio_barra = ls.substr(url,[0,1],o)=="/"
		if(bin_url_inicio_barra){
			ls.array_push(o.registro,`abia1 Advertencia: El archivo '${url}' es del sistema, por eso no se va a borrar.`)
		}else{
			var bin_existe_archivo = ls.file_exists(url,o)
			if(bin_existe_archivo){
				var bin_borrar_archivo = ls.unlink(url)
				if(bin_borrar_archivo){
					ls.array_push(o.registro,`bia3 Archivo '${url}' borrado correctamente.`)
				}else{
					ls.array_push(o.registro,`ebia5 Error: El archivo o carpeta '${url}' existe, pero no se pudo borrar.`)
				}
			}else{
				ls.array_push(o.registro,`abia4 Advertencia: La ruta '${url}' no contiene información, por eso no se va a borrar su contenido.`)
			}
		}
	},
	borrar_carpeta: function borrar_carpeta(url,o){
		var bin_url_inicio_barra = ls.substr(url,[0,1],o)== "/"
		if(bin_url_inicio_barra){
			ls.array_push(o.registro,`ebca1 Error: La carpeta '${url}' es del sistema, por eso no se va a borrar.`)
		}else{
			var bin_borrar_carpeta = ls.rmdir(url)
			if(bin_borrar_carpeta){
				array_push(o.registro,`bca3 Carpeta '${url}' borrada correctamente.`)
			}else{
				ls.array_push(o.registro,`abca2 Advertencia: La carpeta '${url}' no se pudo borrar.`)
			}
		}
	},
	borrar_url: function borrar_url(url,o){
		if(url && url.constructor==String){
			var glob_mark = "glob_mark"
			var urls = ls.glob(`${url}/*`,glob_mark)
			urls.map(x=>{
				if(substr(x,[-1],o)=="/"){
					arguments.callee(x,o)
				}else{
					ls.borrar_archivo(x,o)
				}
			})
			var bin_es_carpeta = ls.is_dir(url)
			if(bin_es_carpeta){
				ls.borrar_carpeta(url,o)
			}else{
				ls.borrar_archivo(url,o)
			}
		}else{
			var e = x=>`abo Advertencia: La ruta '${url}' ${x}, por eso no se va a intentar borrar ningún archivo`
			if(!url){
				ls.array_push(o.registro,e("es nula"))
			}
			if(url && url.constructor!=String){
				ls.array_push(o.registro,e("no es un string"))
			}
		}
		return o
	},
	crear_carpeta: function crear_carpeta(url,o){
		var bin_existe_url = ls.file_exists(url,o)
		if(!bin_existe_url){
			var bin_crear_carpeta = ls.mkdir(url, 0777, true)
			if(bin_crear_carpeta){
				ls.array_push(o.registro,`de3 Carpeta '${url}' creada correctamente.`)
			}else{
				ls.array_push(o.registro,`ade2 Advertencia: La carpeta '${url}' no se pudo crear.`)
			}
		}else{
			ls.array_push(o.registro,`ade0 Advertencia: La carpeta '${url}' existía.`)
		}
	},
	crear_subcarpetas: function crear_subcarpetas(url,o){
		var partes = ls.explode("/",url)
		var t = ls.count(partes)
		for(var i=1;i<=t;++i){
			var sector = ls.array_slice(partes,0,i)
			var subcarpeta = ls.implode("/",sector)
			ls.crear_carpeta(subcarpeta,o)
		}
		return t
	},
	crear_archivo: function crear_archivo(url,datos,o){
		var var_subcarpetas = ls.crear_subcarpetas(url,o)
		var var_crear_archivo = ls.file_put_contents(url,datos)
		if(!datos){
			datos = ""
		}
		if(var_crear_archivo===ls.strlen(datos)){
			ls.array_push(o.registro,`co1 Archivo '${url}' creado correctamente.`)
		}else{
			if(var_crear_archivo===false){
				ls.array_push(o.registro,`aco3 Advertencia: El archivo '${url}' no se pudo crear.`)
			}else{
				ls.array_push(o.registro,`aco2 Advertencia: El archivo '${url}' se pudo crear, pero su contenido es parcial.`)
			}
		}
	},
	crear_carpeta_si_no_existe: function crear_carpeta_si_no_existe(url,o){
		var d = 0
		var bin_existe_url = ls.file_exists(url)
		if(bin_existe_url){
			var bin_es_carpeta = ls.is_dir(url)
			if(bin_es_carpeta){
				ls.array_push(o.registro,`cas La carpeta '${url}' existía.`)
				d = 3
			}else{
				ls.borrar_url(url,o)
				ls.crear_carpeta(url,o)
				d = 2
			}
		}else{
			ls.crear_carpeta(url,o)
			d = 1
		}
		return d
	},
	crear_archivo_si_no_existe: function crear_archivo_si_no_existe(url,datos,o){
		var d = 0
		var bin_existe_url = ls.file_exists(url)
		if(bin_existe_url){
			var bin_es_carpeta = ls.is_dir(url)
			if(bin_es_carpeta){
				ls.borrar_url(url,o)
				ls.crear_archivo(url,datos,o)
				d = 3
			}else{
				ls.array_push(o.registro,`dus El archivo '${url}' existía.`)
				d = 2
			}
		}else{
			ls.crear_archivo(url,datos,o)
			d = 1
		}
		return d
	},
	crear_bibliomatriz_carpeta_contenido: function crear_bibliomatriz_carpeta_contenido(o){
		ls.crear_archivo(`${o.url}/info.txt`,ls.obtener_info(o.nombre),o)
		ls.crear_archivo(`${o.url}/bibma.json`,o.datos,o)
	},
	generar_url: function generar_url(url,retrollamada,o){
		var u = function u(x){
			var subcarpeta = ls.json_decode(x,o)[0]
			o.unificado = ls.es_unificado(url,o)
			o.ext = o.unificado?"json":""
			o.url = `${subcarpeta}/${url}${o.ext}`
			retrollamada()
		}
		ls.file_get_contents("subcarpeta.json",u)
	},
	generar_datos: function generar_datos(url,o){
		o.unificado = ls.es_unificado(url,o)
		o.datos = `${ls.json_encode(o.bibma)}\n`
	},
	obtener_info: function obtener_info(url){
		return `Nombre de la bibliomatriz: ${url}
`
	},
	es_unificado: function es_unificado(url,o){
		return (ls.substr(url,[-1],o)=="."
		  ||ls.substr(url,[-5],o)==".json"
		)?1:0
	},
	crear_bibliomatriz: function crear_bibliomatriz(url,nombre,tipo){
		var o = {}, a = null, b = null, u = null
		var info = null
		ls.crear_carpeta_libros()
		o.bibma = [url,nombre]
		if(url){
			o.unificado = ls.es_unificado(url,o)
			o.tipo = tipo
			a = o.unificado?"Sí":"No"
			b = o.tipo?"Sí":"No"
			u = function u(o){
				o.registro = ["Creando bibliomatriz."]
				ls.generar_datos(url,o)
				o.nombre = nombre
				ls.array_push(o.registro,`¿Es un JSON unificado?: '${a}'; Crear solo si no existe: '${b}'; Ruta: '${o.url}'; Nombre: '${o.nombre}'`)
				if(o.tipo==0){
					ls.borrar_url(o.url,o)
					if(o.unificado==0){
						ls.crear_carpeta(o.url,o)
						ls.crear_bibliomatriz_carpeta_contenido(o)
					}
					if(o.unificado==1){
						ls.crear_archivo(o.url,o.datos,o)
					}
				}
				info = ls.obtener_info(nombre)
				mostrar_log(o.registro)
			}
			ls.generar_url(url,()=>u(o),o)
		}else{
			ls.array_push(o.registro,`La ruta '${url}' es nula.`)
		}
		return o
	},
	borrar_bibliomatriz: function borrar_bibliomatriz(url){
		var o = {}, u = null
		o.registro = ["Borrando bibliomatriz."]
		o.unificado = ls.es_unificado(url)
		a = o.unificado?"Sí":"No"
		if(url){
			u = function u(){
				ls.array_push(o.registro,`¿Es un JSON unificado?: '${a}';`)
				ls.borrar_url(o.url,o)
			}
			ls.generar_url(url,u,o)
		}else{
			array_push(o.registro,`La ruta '${url}' es nula.`)
		}
		return o
	}
}

function oi(o,i){ // Opcional
	return o[i]
}
Object.prototype.i = function i(i){ // Opcional
	return this[i]
}

function mostrar_log(registros){
	var pre = document.querySelector("pre")
	var div = document.createElement("div")
	var ndivs = [...pre.querySelectorAll("div")].length
	var ite = [...pre.querySelectorAll(".n1")].slice(-1)[0]
	var i = ite && +ite.innerHTML || 0
	var j = 0
	if(ndivs%2){
		div.className = "d0"
		
	}else{
		div.className = "d1"
	}
	if(/^(\s|\t)+$/.test(pre.innerHTML)){
		pre.innerHTML = ""
	}
	registros.filter(x=>x).map(x=>{
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
	var o = {}
	if(url){
		if(unificado){url += "."}
		var es_gh = ls.es_gh()
		if(!es_gh){
			(fetch(`bibliomatriz.php?f=c&r=${url}&n=${nombre}&t=${tipo}`)
				.then(x=>x.text())
				.then(x=>{
					analizado = JSON.parse(x)
					mostrar_log(analizado.registro)
				})
			)
		}else{
			o = ls.crear_bibliomatriz(url,nombre,tipo)
		}
	}else{
		o.registro = ["Creando bibliomatriz."]
		ls.array_push(o.registro,`La ruta '${url}' es nula.`)
		mostrar_log(o.registro)
	}
}

function borrar_bibliomatriz(){
	var unificado = +document.querySelector("#unificado").checked
	var url = document.querySelector("#url").value
	var o = {}
	if(url){
		if(unificado){url += "."}
		var es_gh = ls.es_gh()
		if(!es_gh){
			(fetch(`bibliomatriz.php?f=b&r=${url}`)
				.then(x=>x.text())
				.then(x=>{
					var analizado = JSON.parse(x)
					mostrar_log(analizado.registro)
					console.log(analizado)
				})
			)
		}else{
			o = ls.borrar_bibliomatriz(url)
			mostrar_log(o.registro)
		}
	}else{
		o.registro = ["Borrando bibliomatriz."]
		ls.array_push(o.registro,`La ruta '${url}' es nula.`)
		mostrar_log(o.registro)
	}
}

document.onreadystatechange = function(x){
	if(!window.t){
		var a = [
			["JSON"                   ,"unificado" ,1,0],
			["Crear solo si no existe","tipo"      ,1,0],
			["Sin PHP"                ,"sinphp"    ,1,0],
			["Ruta"                   ,"url"       ,0,0],
			["Nombre"                 ,"nombre"    ,0,0],
			["crear_bibliomatriz"     ,"Crear"     ,0,1],
			["borrar_bibliomatriz"    ,"Borrar"    ,0,1],
			["vaciar_log"             ,"Vaciar log",0,1],
		].map(x=>{
			if(!x[3]){
				var a = ["a","input","a"].map(x=>document.createElement(x))
				var div = document.querySelector("div")
				a[0].className = "ina"
				a[0].innerHTML = `${x[0]}: `
				a[1].id = x[1]
				a[1].className = "tin"
				a[1].type = x[2]?"checkbox":""
				a[2].innerHTML = " "
				a[0].appendChild(a[1])
				div.appendChild(a[0])
				div.appendChild(a[2])
			}
			if(x[3]){
				console.log(x)
				var u = document.createElement("button")
				var div = document.querySelectorAll("div")[1]
				u.addEventListener("click",x=>window[x[0]]())
				u.className = "tin"
				u.innerHTML = x[1]
				div.appendChild(u)
			}
		})
		window.t = 1
	}
}
