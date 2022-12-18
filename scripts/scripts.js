//Funciones auxiliares:
//Funcion para reordenar:
function reordenarArr(array) {
  return array.sort(() => Math.random() - 0.5)
}


// Api preguntas : https://opentdb.com/

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



  for (let i = 0; i < arrayPreguntas.length; i++) {

    let preguntasReordenadas = reordenarArr(arrayPreguntas[i].answers)

    const union = document.getElementById("formpreguntas");
    const pregunta = document.createElement("fieldset");
    union.appendChild(pregunta);

    pregunta.innerHTML = `
    <legend class="titulo">${arrayPreguntas[i].question}</legend>
    <div class="respuestas">
    <label for="${preguntasReordenadas[0].value}">${preguntasReordenadas[0].label}</label>
    <input id="${preguntasReordenadas[0].value}" type="radio" name="${arrayPreguntas[i].name}" value="${preguntasReordenadas[0].value}">

    <label for="${preguntasReordenadas[1].value}">${preguntasReordenadas[1].label}</label>
    <input id="${preguntasReordenadas[1].value}" type="radio" name="${arrayPreguntas[i].name}" value="${preguntasReordenadas[1].value}">

    <label for="${preguntasReordenadas[2].value}">${preguntasReordenadas[2].label}</label>
    <input id="${preguntasReordenadas[2].value}" type="radio" name="${arrayPreguntas[i].name}" value="${preguntasReordenadas[2].value}">

    <label for="${preguntasReordenadas[3].value}">${preguntasReordenadas[3].label}</label>
    <input id="${preguntasReordenadas[3].value}" type="radio" name="${arrayPreguntas[i].name}" value="${preguntasReordenadas[3].value}">
    </div>

    <button type="submit">Enviar respuesta</button>`
  }

}

pedirPreguntas()



/* <form name="dnd">
    <fieldset>
      <legend>En el mundo de Dragones y Mazmorras, ¿Quién es Elminster?</legend>

      <div>
      <label for="bard-field">Un bardo</label>
      <input id="bard-field" type="radio" name="elminster" value="bardo">

      <label for="merchant-field">Un mercader</label>
      <input id="merchant-field" type="radio" name="elminster" value="mercader">

      <label for="sorcerer-field">Un mago</label>
      <input id="sorcerer-field" type="radio" name="elminster" value="mago">

      <label for="sailor-field">Un marinero</label>
      <input id="sailor-field" type="radio" name="elminster" value="marinero">
      </div>
    </fieldset>

    <button type="submit">Comprobar datos</button>
</form> */






// reordenar(arrayDeNumeros)

// function compareNumbers(a, b) {
//     return a - b;
//   }



