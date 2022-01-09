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
	var ruta = document.querySelector("#ruta").value
	var nombre = document.querySelector("#nombre").value
	if(unificado){ruta += "."}
	var f = (fetch(`bibliomatriz.php?f=c&r=${ruta}&n=${nombre}&t=${tipo}`)
		.then(x=>x.text())
		.then(x=>{
			var analizado = JSON.parse(x)
			mostrar_log(analizado.registro)
			console.log(analizado)
		})
	)
}
function borrar_bibliomatriz(){
	var unificado = +document.querySelector("#unificado").checked
	var ruta = document.querySelector("#ruta").value
	if(unificado){ruta += "."}
	var f = (fetch(`bibliomatriz.php?f=b&r=${ruta}`)
		.then(x=>x.text())
		.then(x=>{
			var analizado = JSON.parse(x)
			mostrar_log(analizado.registro)
			console.log(analizado)
		})
	)
}
