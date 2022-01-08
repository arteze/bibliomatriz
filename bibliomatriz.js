function mostrar_log(registros_nuevos){
	var pre = document.querySelector("pre")
	var registros = [...pre.querySelectorAll("a")].map(x=>x.innerHTML)
	var i = 0
	registros.push(...registros_nuevos)
	pre.innerHTML = registros.filter(x=>x!=0).map(x=>{
		return (++i) + " <a>" + x + "</a>"
	}).join("\n")
	return pre
}
function vaciar_log(){
	var pre = document.querySelector("pre")
	pre.innerHTML = "\n"
}

function crear_bibliomatriz(){
	var tipo = document.querySelector("#tipo").checked
	var unificado = document.querySelector("#unificado").checked
	var ruta = document.querySelector("#ruta").value
	var nombre = document.querySelector("#nombre").value
	var unibinop = tipo * 2 + unificado
	var f = (fetch(`bibliomatriz.php?f=c&r=${ruta}&n=${nombre}&u=${unibinop}`)
		.then(x=>x.text())
		.then(x=>{
			var analizado = JSON.parse(x)
			mostrar_log(analizado.registro)
			console.log(analizado)
		})
	)
}
function borrar_bibliomatriz(){
	var unificado = document.querySelector("#unificado").checked
	var ruta = document.querySelector("#ruta").value
	var unibinop = tipo * 2 + unificado
	var f = (fetch(`bibliomatriz.php?f=b&r=${ruta}&u=${unibinop}`)
		.then(x=>x.text())
		.then(x=>{
			var analizado = JSON.parse(x)
			mostrar_log(analizado.registro)
			console.log(analizado)
		})
	)
}
