// Api preguntas : https://opentdb.com/

async function pedirPreguntas() {
    const arrPreguntas = []
    const datos = await fetch('https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple')
    const basePreguntas = await datos.json();
    const listaPreguntas = basePreguntas.results

const arrayPreguntas = [];
for (let i = 0; i < listaPreguntas.length; i++) {
    
    let question = {
        name: `pregunta${i+1}`,
        question: listaPreguntas[i].question,
        answers: [
          {label: listaPreguntas[i].correct_answer, value: listaPreguntas[i].correct_answer.replace(/\s/g, '')},
          {label: listaPreguntas[i].incorrect_answers[0], value: listaPreguntas[i].incorrect_answers[0].replace(/\s/g, '')},
          {label: listaPreguntas[i].incorrect_answers[1], value: listaPreguntas[i].incorrect_answers[1].replace(/\s/g, '')},
          {label: listaPreguntas[i].incorrect_answers[2], value: listaPreguntas[i].incorrect_answers[2].replace(/\s/g, '')},
        ],
        correct: listaPreguntas[i].correct_answer.replace(/\s/g, '')
    }
    arrayPreguntas.push(question)
}











}





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




// function reordenarArr(array) {
//     array.sort(()=> Math.random() - 0.5)
// }

// reordenar(arrayDeNumeros)

// function compareNumbers(a, b) {
//     return a - b;
//   }



