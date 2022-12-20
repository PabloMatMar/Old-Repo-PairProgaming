//Creación de espacio en el localstorage en caso de que no exista la clave:

for (let i = 0; i < localStorage.length; i++) {
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
      const labelRespuestas = document.createElement("label")
      labelRespuestas.setAttribute("for", `${respuestasReordenadas[j].value}`)
      labelRespuestas.innerHTML = respuestasReordenadas[j].label;
      divRespuestas.appendChild(labelRespuestas)

      inputRespuestas = document.createElement("input")
      inputRespuestas.setAttribute("id", `${respuestasReordenadas[j].value}`)
      inputRespuestas.setAttribute("type", "radio")
      inputRespuestas.setAttribute("name", `${arrayPreguntas[i].name}`)
      inputRespuestas.setAttribute("value", `${respuestasReordenadas[j].value}`)
      divRespuestas.appendChild(inputRespuestas)

    }
    // El botón que acompaña a cada pregunta es un botón que desbloquea la siguiente (exceptuando la última pregunta)
    if (arrayPreguntas[i] !== arrayPreguntas[arrayPreguntas.length - 1]) {
      const botonSiguiente = document.createElement("button");
      botonSiguiente.setAttribute("type", "button");
      botonSiguiente.setAttribute("id", `button${i}`);
      botonSiguiente.innerHTML = "Siguiente";
      pregunta.appendChild(botonSiguiente);


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
    //El último botón cierrra es el input del formulario
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
      if (event.target[arrayPreguntas[i].name].value === arrayPreguntas[i].correct){
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

if (document.title == 'Quiz') {
pedirPreguntas()
}





// if (document.title == 'Tu resultado') {



//   const puntuacionFinal = document.querySelector("#puntuacion")
//   const mensaje = document.querySelector("#mensajepuntuacion")




// }



// //Pintado de datos

    

    
//     puntuacionFinal.innerHTML = `${nuevosDatos.puntuacion} / ${arrayPreguntas.length}`
//     console.log(puntuacionFinal)
    
//     if (nuevosDatos.puntuacion == arrayPreguntas.length) {
//       mensaje.innerHTML = "Increible, lo acertaste todo"
//     }

//     if (nuevosDatos.puntuacion >= 7) {
//       mensaje.innerHTML = "Un poco más y lo sacas todo"
//     }
    
//     if (nuevosDatos.puntuacion >= 5 ) {
//       mensaje.innerHTML = "Tienes buen conomiento sobre animales"
//     }
    
//     if (nuevosDatos.puntuacion < 5) {
//       mensaje.innerHTML = "No vayas a africa o te comeran los bichos"
//     }
    