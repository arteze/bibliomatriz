var ls = {
	analizar_ficheros: function analizar_ficheros(v){ // Función opcional
		var o = {}
		var c = v.constructor == String
		var a = c && JSON.parse(v) || v
		a.map(x=>{
			console.log("x",x)
			if(x[1].constructor==Array){
				o[x[0]] = ls.analizar_ficheros(x[1])
			}else{
				o[x[0]] = x[1]
			}
		})
		return o
	},
	analizar_ficheros_ejemplo: function analizar_ficheros_ejemplo(){ // Función opcional
		var s = '[["a.json","[]"],["b.json","[]"],["c",[["c.json","[]"]]]]'
		return ls.analizar_ficheros(s)
	},
	eval_servicio: function eval_servicio(funciones,nombre){ // Función opcional
		eval("window."+nombre+"="+funciones.filter(x=>{
			return new RegExp(`function ${nombre}`,"").test(x)
		})[0].replace(/"/g,"`")
			.replace(/([^(]\$)(\w*)/g,"$1{$2}")
			.replace(/[(,]\$(\w*)/g,"($1")
		)
		return window[nombre]
	},
	obtener_carpeta_libro: function obtener_carpeta_libro(){
		var libro = localStorage.getItem("libro")
		return libro
	},
	crear_carpeta_libro: function crear_carpeta_libro(){
		var libro = null
		var carpeta_libro = ls.obtener_carpeta_libro()
		var fichero = []
		if(carpeta_libro==null){
			localStorage.setItem("libro",ls.json_encode(fichero))
		}
		libro = ls.obtener_carpeta_libro()
		return libro
	},
	agregar_entidades_html: function(s,puede_agregar_entidades){
		var a = document.createElement("a")
		a.textContent = s
		return puede_agregar_entidades && a.innerHTML || s
	},
	html_hacia_string: function html_hacia_string(h,puede_agregar_entidades){
		return ls.agregar_entidades_html(`<${h.nodeName.toLowerCase()} ${
				([...h.attributes].map(x=>[
						x.name, JSON.stringify(x.value)
					].join("=")).join(" ")
				)
			}>`
		,puede_agregar_entidades)
	},
	registrar_error_html: function registrar_error_html(a,r,s,d,o){
		var es_html = /html/i.test(s)
		var n = a.callee.name
		if(es_html){
			var t = ls.html_hacia_string(s,0)
			var u = ls.html_hacia_string(s,1)
			var e = x => `${r} Error: En '${n}' el parámetro '${x}' es una etiqueta HTML en vez de un string.`
			var j = e(t)
			var k = e(u)
			console.error(j)
			ls.array_push(o.registro,k)
		}else{
			ls.array_push(o.registro,d)
		}
	},
	substr: function substr(s,i,f,o){
		var d = null
		if(s.constructor==String){
			d = s.slice(i,f)
		}else{
			ls.registrar_error_html(arguments,"esu",s,"",o)
		}
		return d
	},
	json_encode: function json_encode(x){
		return JSON.stringify(x)
	},
	array_push: function array_push(a,b,o){
		if(a.constructor==Array){
			a.push(b)
		}else{
			ls.registrar_error_html(arguments,"eap",a,"",o)
		}
		return a
	},
	strlen: function strlen(datos){
		return datos && datos.length || -1
	},
	ls: function ls(){ // Por hacer
		var libro = localStorage.getItem("libro")
		var array = libro && JSON.parse(libro) || []
		
	},
	file_exists: function file_exists(url,o){ // Por hacer
		var d = false
		var partes = null
		ls.registrar_error_html(arguments,"efa",url,"",o)
		return d
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
	file_put_contents: function file_put_contents(url,datos){ // Por hacer
		
	},
	rmdir: function rmdir(url){ // Por hacer
		
	},
	es_gh: function es_gh(){
		return location.href.split("/")[2].match(/\w+/g)[1] + "A=" == btoa('\x82+a¹°')
	},
	borrar_archivo: function borrar_archivo(url,o){
		var bin_url_inicio_barra = ls.substr(url,0,1,o)=="/"
		if(bin_url_inicio_barra){
			ls.array_push(o.registro,`abia1 Advertencia: El archivo '${url}' es del sistema, por eso no se va a borrar.`)
		}else{
			var bin_existe_archivo = ls.file_exists(url,o)
			if(bin_existe_archivo){
				var bin_borrar_archivo = ls.unlink(url)
				if(bin_borrar_archivo){
					ls.array_push(o.registro,`ebia3 Archivo '${url}' borrado correctamente.`)
				}else{
					ls.array_push(o.registro,`ebia2 El archivo o carpeta '${url}' existe, pero no se pudo borrar.`)
				}
			}else{
				var d = `abia4 Advertencia: La ruta '${url}' no contiene información, por eso no se va a borrar su contenido.`
				ls.registrar_error_html(arguments,"abia5",url,d,o)
			}
		}
	},
	borrar_carpeta: function borrar_carpeta(url,o){
		var bin_url_inicio_barra = ls.substr(url,0,1)== "/"
		if(bin_url_inicio_barra){
			ls.array_push(o.registro,`abca1 Advertencia: La carpeta '${url}' es del sistema, por eso no se va a borrar.`)
		}else{
			var bin_borrar_carpeta = ls.rmdir(url)
			if(bin_borrar_carpeta){
				array_push(o.registro,`ebca3 Carpeta '${url}' borrada correctamente.`)
			}else{
				ls.array_push(o.registro,`abca2 Advertencia: La carpeta '${url}' no se pudo borrar.`)
			}
		}
	},
	borrar_url: function borrar_url(ruta,o){
		var glob_mark = "glob_mark"
		if(ruta){
			var urls = ls.glob(`${ruta}/*`,glob_mark)
			urls.map(x=>{
				if(substr(x,-1)=="/"){
					ls.borrar_url(x,o)
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
			ls.array_push(o.registro,`abo Advertencia: La ruta '${url}' es nula, por eso no se va a intentar borrar ningún archivo`)
		}
		return o
	},
	crear_carpeta: function crear_carpeta(url,o){
		var bin_existe_url = ls.file_exists(url,o)
		if(!bin_existe_url){
			var bin_crear_carpeta = ls.mkdir(url, 0777, true)
			if(bin_crear_carpeta){
				ls.array_push(o.registro,`eca3 Carpeta '${url}' creada correctamente.`)
			}else{
				ls.array_push(o.registro,`eca2 Advertencia: La carpeta '${url}' no se pudo crear.`)
			}
		}else{
			ls.array_push(o.registro,`eca0 Advertencia: La carpeta '${url}' existía.`)
		}
	},
	crear_archivo: function crear_archivo(url,datos,o){
		var var_crear_archivo = ls.file_put_contents(url,datos)
		if(!datos){
			datos = ""
		}
		if(var_crear_archivo===ls.strlen(datos)){
			ls.array_push(o.registro,`eco1 Archivo '${url}' creado correctamente.`)
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
				ls.array_push(o.registro,`ecas La carpeta '${url}' existía.`)
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
				ls.array_push(o.registro,`edas El archivo '${url}' existía.`)
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
	generar_url: function generar_url(url,o){
		subcarpeta = "libros/"
		o.unificado = ls.es_unificado(url,o)
		o.ext = o.unificado?"json":""
		o.url = `${subcarpeta}${url}${o.ext}`
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
		return (ls.substr(url,-1,o)=="."
		  ||ls.substr(url,-5,o)==".json"
		)?1:0
	},
	crear_bibliomatriz: function crear_bibliomatriz(url,nombre,tipo){
		var o = {}, a = null, b = null
		var info = null
		ls.crear_carpeta_libro()

		o.bibma = [url,nombre]
		o.registro = ["Creando bibliomatriz."]
		if(url){
			o.unificado = ls.es_unificado(url,o)
			o.tipo = tipo
			a = o.unificado?"Sí":"No"
			b = o.tipo?"Sí":"No"

			ls.generar_url(url,o)
			ls.generar_datos(url,o)
			o.nombre = nombre

			ls.array_push(o.registro,`¿Es un JSON unificado?: '${a}'; Crear solo si no existe: '${b}'; Nombre: '${o.nombre}'`)
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

		}else{
			ls.array_push(o.registro,`La ruta '${url}' es nula.`)
		}
		return o
	},
	borrar_bibliomatriz: function borrar_bibliomatriz(url){
		var o = {}
		o.registro = ["Borrando bibliomatriz."]
		o.unificado = ls.es_unificado(url)
		a = o.unificado?"Sí":"No"
		if(url){
			ls.generar_url(url,o)
			ls.array_push(o.registro,`¿Es un JSON unificado?: '${a}';`)
			ls.borrar_url(o.url,o)
		}else{
			array_push(o.registro,`La ruta '${url}' es nula.`)
		}
		return o
	}
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
			mostrar_log(o.registro)
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
