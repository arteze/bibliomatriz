var ls = {
	substr: function substr(s,i,f){
		return s.slice(i,f)
	},
	json_encode: function json_encode(x){
		return JSON.stringify(x)
	},
	array_push: function array_push(a,b){
		return a.push(b)
	},
	file_exists: function file_exists(url){
		var partes = url.split("/")
		console.log(partes)
	},
	analizar_ficheros: function analizar_ficheros(v){
		// Función opcional
		var o = {}
		var c = v.constructor == String
		var a = c && JSON.parse(v) || v
		a.map(x=>{
			console.log("x",x)
			if(x[1].constructor==Array){
				o[x[0]] = analizar_ficheros(x[1])
			}else{
				o[x[0]] = x[1]
			}
		})
		return o
	},
	analizar_ficheros_ejemplo: function analizar_ficheros_ejemplo(){
		// Función opcional
		var archivo = x=>`["${x}","[]"]`
		var s = `[${archivo("a.json")},${archivo("b.json")},["c",[${archivo("c.json")}]]]`
		return ls.analizar_ficheros(s)
	},
	eval_servicio: function eval_servicio(funciones,nombre){
		// Función opcional
		eval("window."+nombre+"="+funciones.filter(x=>{
			return new RegExp(`function ${nombre}`,"").test(x)
		})[0].replace(/"/g,"`")
			.replace(/([^(]\$)(\w*)/g,"$1{$2}")
			.replace(/[(,]\$(\w*)/g,"($1")
		)
		return window[nombre]
	},
	obtener_info: function obtener_info(url){
		return `Nombre de la bibliomatriz: ${url}
`
	},
	es_unificado: function es_unificado(url){
		return (ls.substr(url,-1)=="."
		  ||ls.substr(url,-5)==".json"
		)?1:0
	},
	obtener_carpeta_libro: function obtener_carpeta_libro(){
		var libro = localStorage.getItem("libro")
		return libro
	},
	crear_carpeta_libro: function crear_carpeta_libro(){
		var carpeta_libro = localStorage.getItem("libro")
		if(carpeta_libro==null){
			var fichero = []
			localStorage.setItem("libro",ls.json_encode(fichero))
		}
		libro = ls.obtener_carpeta_libro()
		return libro
	},
	crear_carpeta: function crear_carpeta(url,o){
		var bin_existe_url = file_exists(url); //
		if(!bin_existe_url){
			bin_crear_carpeta = mkdir(url, 0777, true); //
			if(bin_crear_carpeta){ //
				array_push(o.registro,"eca3 Carpeta 'url' creada correctamente.");
			}else{
				array_push(o.registro,"eca2 Advertencia: La carpeta 'url' no se pudo crear.");
			}
		}else{
			array_push(o.registro,"eca0 Advertencia: La carpeta 'url' existía.");
		}
	},
	generar_url: function generar_url(url,o){
		subcarpeta = "libros/";
		o.unificado = es_unificado(url);
		o.ext = o.unificado?"json":"";
		o.url = `${subcarpeta}${url}${o.ext}`
	},
	generar_datos: function generar_datos(url,o){
		o.unificado = es_unificado(url);
		o.datos = `${ls.json_encode(o.bibma)}\n`;
	},
	crear_bibliomatriz: function crear_bibliomatriz(url,nombre,tipo){
		var o = {}, a = null, b = null
		var info = null
		ls.crear_carpeta_libro()

		o.bibma = [url,nombre];
		o.registro = ["Creando bibliomatriz."]
		if(url){
			o.unificado = ls.es_unificado(url)
			o.tipo = tipo
			a = o.unificado?"Sí":"No"
			b = o.tipo?"Sí":"No"

			ls.generar_url(url,o)
			ls.generar_datos(url,o)
			o.nombre = nombre

			array_push(o.registro,`¿Es un JSON unificado?: ${a}; Crear solo si no existe: ${b}; Nombre: ${o.nombre}`)
			if(o.tipo==0){
				borrar_url(o.url,o)
				if(o.unificado==0){
						ls.crear_carpeta(o.url,o) //
						ls.crear_bibliomatriz_carpeta_contenido(o) //
				}
				if(o.unificado==1){
						ls.crear_archivo(o.url,o.datos,o) //
				}
			}
			console.log("url",o,o.url)

			info = ls.obtener_info(nombre)

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
	var o = null
	if(unificado){url += "."}
	var es_gh = location.href.split("/")[2].match(/\w+/g)[1] + "AA" == btoa('\x82+a¹°\x00')
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
