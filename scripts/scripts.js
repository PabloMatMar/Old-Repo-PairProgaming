//Creación de espacio en el localstorage en caso de que no exista la clave:

for (let i = 0; i <= localStorage.length; i++) {
  let key = localStorage.key(i);
  if (key === 'memoryCard') {
    break;
  } else {
    const arrayPuntuaciones = []
    localStorage.setItem("memoryCard", JSON.stringify(arrayPuntuaciones));
  }
}

//Funciones auxiliares:
//Funcion para reordenar:
function reordenarArr(array) {
  return array.sort(() => Math.random() - 0.5)
}

// Api preguntas : https://opentdb.com/
// Creamos array de objetos a partir de la api

async function pedirPreguntas() {
  const datos = await fetch('https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple')
  const basePreguntas = await datos.json();
  const listaPreguntas = basePreguntas.results

  const arrayPreguntas = [];
  for (let i = 0; i < listaPreguntas.length; i++) {
    let question = {
      name: `pregunta${i + 1}`,
      question: listaPreguntas[i].question,
      answers: [
        { label: listaPreguntas[i].correct_answer, value: listaPreguntas[i].correct_answer.replace(/\s/g, '') },
        { label: listaPreguntas[i].incorrect_answers[0], value: listaPreguntas[i].incorrect_answers[0].replace(/\s/g, '') },
        { label: listaPreguntas[i].incorrect_answers[1], value: listaPreguntas[i].incorrect_answers[1].replace(/\s/g, '') },
        { label: listaPreguntas[i].incorrect_answers[2], value: listaPreguntas[i].incorrect_answers[2].replace(/\s/g, '') },
      ],
      correct: listaPreguntas[i].correct_answer.replace(/\s/g, '')
    }
    arrayPreguntas.push(question)
  }

 
  
  //Usamos el arrayPreguntas para pintar el DOM:

  for (let i = 0; i < arrayPreguntas.length; i++) {

    let respuestasReordenadas = reordenarArr(arrayPreguntas[i].answers)

    const union = document.getElementById("formpreguntas");
    const pregunta = document.createElement(`fieldset`);
    i == 0 ? pregunta.setAttribute("class", "firstquestion") : pregunta.setAttribute("class", "regularquestion");
    pregunta.setAttribute("id", `test${i + 1}`)

    union.appendChild(pregunta);
    const encabezado = document.createElement("legend");
    encabezado.setAttribute("class", "titulo");
    encabezado.innerHTML = arrayPreguntas[i].question;
    pregunta.appendChild(encabezado);

    const divRespuestas = document.createElement("div");
    divRespuestas.setAttribute("class", "respuestas")
    pregunta.appendChild(divRespuestas)

    //Las opciones se pintan en un bucle que itera con j dentro del bucle que itera con i
    var inputRespuestas;
    for (let j = 0; j < arrayPreguntas[i].answers.length; j++) {
      inputRespuestas = document.createElement("input")
      inputRespuestas.setAttribute("id", `${respuestasReordenadas[j].value}`)
      inputRespuestas.setAttribute("type", "radio")
      inputRespuestas.setAttribute("name", `${arrayPreguntas[i].name}`)
      inputRespuestas.setAttribute("value", `${respuestasReordenadas[j].value}`)
      divRespuestas.appendChild(inputRespuestas)
      
      const labelRespuestas = document.createElement("label")
      labelRespuestas.setAttribute("for", `${respuestasReordenadas[j].value}`)
      labelRespuestas.innerHTML = respuestasReordenadas[j].label;
      divRespuestas.appendChild(labelRespuestas)
    }
    // El botón que acompaña a cada pregunta es un botón que desbloquea la siguiente (exceptuando la última pregunta)
    if (arrayPreguntas[i] !== arrayPreguntas[arrayPreguntas.length - 1]) {
      const botonSiguiente = document.createElement("button");
      botonSiguiente.setAttribute("type", "button");
      botonSiguiente.setAttribute("id", `button${i}`);
      botonSiguiente.innerHTML = "Siguiente";
      pregunta.appendChild(botonSiguiente);
      //Deshabilitado hasta que se responda:
      botonSiguiente.disabled = true;
      const input = document.querySelectorAll(`#test${i + 1}>div>input`);
      input.forEach((input) => {
        input.onclick = function () {
          botonSiguiente.disabled = false
        }
      })
      botonSiguiente.onclick = function () {
        document.getElementById(`test${i + 1}`).style.display = "none"
        document.getElementById(`test${i + 2}`).style.display = "block"
      }
      //El último botón que se abre es el input del formulario
    } else {
      const botonFinal = document.createElement("input");
      botonFinal.setAttribute("type", "submit");
      botonFinal.setAttribute("value", "Finalizado");
      pregunta.appendChild(botonFinal);
      botonFinal.disabled = true;
      const input = document.querySelectorAll(`#test${i + 1}>div>input`);
      input.forEach((input) => {
        input.onclick = function () {
          botonFinal.disabled = false
        }
      })
    }
  }

  //Validación del formulario:

  document.querySelector('#formpreguntas').addEventListener('submit', function (event) {

    event.preventDefault();
    //Establecemos un contador que suma si la respuesta es correcta

    let contador = 0;
    for (let i = 0; i < arrayPreguntas.length; i++) {
      if (event.target[arrayPreguntas[i].name].value === arrayPreguntas[i].correct) {
        contador++;
      }
    }

    //Datos de la partida jugada por el usuario:
    let nuevosDatos = {
      puntuacion: contador,
      fecha: new Date().toLocaleString()
    }

    //Guardado de datos:

    let arrayGuardado = JSON.parse(localStorage.getItem("memoryCard"))
    arrayGuardado.push(nuevosDatos)
    localStorage.setItem("memoryCard", JSON.stringify(arrayGuardado))

    //Salida hacia la siguiente página exigida por el ejercicio (donde se desplega unicamente un mensaje con el resultado final) => results.html

    window.location.replace("results.html"); //Borra datos guardados
  })
}
//Script ejecutable solo en question.html
if (document.title == 'Quiz') {
  pedirPreguntas()
}
// Script ejecutable solo en results.html
if (document.title == 'Tu resultado') {
  let arrayGuardado = JSON.parse(localStorage.getItem("memoryCard"));
  let ultimaPuntuacion = arrayGuardado[arrayGuardado.length - 1].puntuacion

  const resultadoMostrado = document.querySelector("#puntuacion")
  const mensajeMostrado = document.querySelector("#mensajepuntuacion")

  resultadoMostrado.innerHTML = `${ultimaPuntuacion} / 10`

  if (ultimaPuntuacion == 10) {
    mensajeMostrado.innerHTML = "¡Increible! ¡lo acertaste todo!"
  } else {
    ultimaPuntuacion >= 5 ? mensajeMostrado.innerHTML = "Tienes un buen conocimiento sobre los animales" : mensajeMostrado.innerHTML = "No vayas a África o te comerán los bichos"
  }
}

//Script ejecutable solo en home.html:
if (document.title == '¡Bienvenido al Quiz!') {

  //Extraccion de datos:
  let arrayGuardado = JSON.parse(localStorage.getItem("memoryCard"));
  let arrayX = [];
  let arrayY = [];
  for (let i = 0; i < arrayGuardado.length; i++) {
    arrayX.push(arrayGuardado[i].fecha);
    arrayY.push(arrayGuardado[i].puntuacion);
  }
  //CHART de Chart.js:
  //Guardamos en dos constantes arrays de solo 10 últimas puntuaciones:
  const arrayXLastTen = arrayX.slice(-10)
  const arrayYLastTen = arrayY.slice(-10)


  const ctx = document.getElementById('myChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: arrayXLastTen,//cambiarlo por arrayX si no hacemos filtrado
      datasets: [{
        label: 'Respuestas acertadas',
        data: arrayYLastTen,
        borderColor: '#F9D203',
        backgroundColor: '#22283f',
        borderWidth: 4,
      }]
    },
    options: {
      layout: {
        padding: 10
      },
      plugins: {
        title: {
          display: true,
          text: 'Últimas 10 puntuaciones',
        },

      },
      aspectRatio: 1,
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          min: 0
        }
      }
    }
  });

  //Pintado de lista de puntuaciones  
  const listaPuntuaciones = document.getElementById("listapuntuaciones")
  for (let i = 0; i < arrayGuardado.length; i++) {
    let item = document.createElement("li")
    item.innerHTML = `${arrayGuardado[i].fecha.substring(11, 17)}: <b>${arrayGuardado[i].puntuacion} aciertos</b>`
    listaPuntuaciones.appendChild(item)
    

  }
}

//Función para redirigir en un tiempo determinado:

// function pageRedirect() {
//   window.location.replace("../home.html");
// }    
// setTimeout("pageRedirect()", 10000);