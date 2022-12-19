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
    //Este ternario identifica la primera pregunta con una clase ya que tendrá que estar abierta desde el principio y las demás cerradas
    i == 0 ? pregunta.setAttribute("class","firstquestion") : pregunta.setAttribute("class","regularquestion");
    pregunta.setAttribute("id", `test${i + 1}`)

    union.appendChild(pregunta);
    const encabezado = document.createElement("legend");
    encabezado.setAttribute("class", "titulo");
    encabezado.innerHTML = arrayPreguntas[i].question;
    pregunta.appendChild(encabezado);


    const divRespuestas = document.createElement("div");
    divRespuestas.setAttribute("class", "respuestas")
    pregunta.appendChild(divRespuestas)

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

    if (arrayPreguntas[i] !== arrayPreguntas[arrayPreguntas.length-1]){
      const botonSiguiente = document.createElement("button");
      botonSiguiente.setAttribute("type", "button");
      botonSiguiente.setAttribute("id", `button${i}`);
      botonSiguiente.innerHTML = "Siguiente";
      pregunta.appendChild(botonSiguiente);


      // Intento de que el botón siguiente no se pueda seleccionar

      // const input = document.querySelector(`input[name="${arrayPreguntas[i].name}"]`);
      
      // input.addEventListener('change', function() {
      //   if (input.checked) {
      //     botonSiguiente.disabled = true;
      //   } else {
      //     botonSiguiente.disabled = false;
      //   }
      // });

      botonSiguiente.onclick = function () {
  
        document.getElementById(`test${i+1}`).style.display = "none"
        document.getElementById(`test${i+2}`).style.display = "block"
      }

    } else {
      
      const botonFinal = document.createElement("input");
      botonFinal.setAttribute("type", "submit");
      botonFinal.setAttribute("value", "Finalizado");
      pregunta.appendChild(botonFinal);
    }
  }

}


pedirPreguntas()


