const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacion = document.querySelector('#paginacion');

const registrosPorPagina = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}


function validarFormulario(e){
    e.preventDefault();

    if(termino === ''){

        imprimirAlerta('Se requiere un termino de busqueda');

        return;
    }
    buscarImagenes();
}

function imprimirAlerta(mensaje){

    const alertaExistente = document.querySelector('.bg-red-100');

    if(!alertaExistente){
        const alerta = document.createElement('p');
    alerta.classList.add('bg-red-100','border-red-400','text-red-100','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center');
    alerta.innerHTML = mensaje;

    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 5000);
    }
}

function buscarImagenes(){

    const termino = document.querySelector('#termino').value;

    const key = '29530826-f993037695020d94732f6f688';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => {
        totalPaginas = calcularPaginas(resultado.totalHits);
        console.log(totalPaginas);
        mostrarImagenes(resultado.hits);
    })
}

//Paginador

function*crearPaginador(total){
    for(let i = 1; i <= total; i++){
        yield i;
    }
}



function calcularPaginas(total){
    return parseInt(Math.ceil( total / registrosPorPagina ));
}

function mostrarImagenes(imagenes){
    
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }

    //Iterar el array de imagenes para mostrar en HTML

    imagenes.forEach(imagen => {
        const {previewURL,likes,views,largeImageURL}= imagen;

        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div>
                <img class="w-full" src="${previewURL}">

                <div class="p-4 pie-img">
                    <p class="font-bold"> ${likes} <span class="font-light"> Me Gusta </span> </p>
                    <p class="font-bold"> ${views} <span class="font-light"> Vistas </span> </p>

                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                    href="${largeImageURL}" target="_blank" rel="noopener noreferrer">

                    Ver Imagen

                    </a>

                </div>

            </div>   
            
        </div>
        
        `
    });

    //Limpiar paginado previo

    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild)
    }

    mostrarPaginador();

}

function mostrarPaginador(){
    iterador = crearPaginador(totalPaginas);


    while(true){
        const {value , done} = iterador.next();
        if(done) return;

        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente','bg-yellow-400', 'px-4','py-1','mr-2','font-bold','mb-5','rounded');

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();
        }

        paginacion.appendChild(boton);
    }

}

