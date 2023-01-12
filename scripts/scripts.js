//inicio de fb

const firebaseConfig = {
  apiKey: "AIzaSyBNOjqmJ9fQwc_ReQubkeKrLmqvmaiqk48",
  authDomain: "quizv2-5c21a.firebaseapp.com",
  projectId: "quizv2-5c21a",
  storageBucket: "quizv2-5c21a.appspot.com",
  messagingSenderId: "1087403902810",
  appId: "1:1087403902810:web:e58c18ac400a7c75c21563"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
//Listener
firebase.auth().onAuthStateChanged((user) => user ? console.log(`Está en el sistema:${user.email} ${user.uid}`) : console.log("no hay usuarios en el sistema"))


/* ----------------------------------FUNCIONES----------------------------------*/
//Funciones de firebase:

const loginUser = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((credential) => {
      let user = credential.user;
      console.log(`${user.email} está en el sistema (ID: ${user.uid})`)
      alert(`${user.email} está en el sistema (ID: ${user.uid})`)
      console.log('USER', user)
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message)
    })
}

//Función para deslogearse:
const logOut = () => {
  let user = firebase.auth().currentUser;
  firebase.auth().signOut()
    .then(() => {
      console.log(user.mail + 'is out')
    })
    .catch((error) => {
      console.log('Error: ' + error)
    });
  location.reload();
}

//Función que crea nuevo usuario:
const createUser = (email, password) => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((credential) => {
      let user = credential.user;
      console.log(`${user.email} registrado con ID: ${user.uid}`)
      alert(`registrado ${user.email} con ID ${user.uid}`)
      db.collection('usuarios')
        .add({
          id: user.uid,
          email: user.email
        })
        .then((userDoc) => console.log(`New user document with ID: ${user.uid}`))
        .catch((error) => console.error("Error adding document: ", error))
    })
    .catch((error) => {
      console.log("Error" + error.message)
    });
}

//Funciones auxiliares:
const addMessage = (texto, tiempo) => {
  const pintaMensaje = () => document.getElementById("mensaje").innerHTML += `<p>${texto}</p>`
  setTimeout(pintaMensaje, tiempo)
}

const reordenarArr = (array) => {
  return array.sort(() => Math.random() - 0.5)
}

//Funcion para pedir preguntas de la API, construir objeto con ellas y llamar a la función de pintado
const pedirPreguntas = async () => {
  const datos = await fetch('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple')
  const basePreguntas = await datos.json();
  const listaPreguntas = basePreguntas.results;
  const arrayPreguntas = [];
  for (let i = 0; i < listaPreguntas.length; i++) {
    let question = {
      name: `pregunta${i + 1}`,
      question: listaPreguntas[i].question,
      answers: [
        { label: listaPreguntas[i].correct_answer, value: listaPreguntas[i].correct_answer.split(' ').join('') },
        { label: listaPreguntas[i].incorrect_answers[0], value: listaPreguntas[i].incorrect_answers[0].split(' ').join('') },
        { label: listaPreguntas[i].incorrect_answers[1], value: listaPreguntas[i].incorrect_answers[1].split(' ').join('') },
        { label: listaPreguntas[i].incorrect_answers[2], value: listaPreguntas[i].incorrect_answers[2].split(' ').join('') },
      ],
      correct: listaPreguntas[i].correct_answer.split(' ').join('')
    }
    arrayPreguntas.push(question)
  }
  crearPreguntas(arrayPreguntas)
}

//Función para pinta rlas preguntas
const crearPreguntas = (arrayPreguntas) => {

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
    window.location.replace("results.html");
  })
}


/* ----------------------------------CODIGO PARA LAS PAGINAS----------------------------------*/
//Creación de clave/array en el localstorage en caso de que no exista:
for (let i = 0; i <= localStorage.length; i++) {
  let key = localStorage.key(i);
  if (key === 'memoryCard') {
    break;
  } else {
    localStorage.setItem("memoryCard", JSON.stringify([]));
  }
}

if (document.title == '¡Bienvenido al Quiz!' || document.title == 'Tu resultado' ) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        //Creación de botón logout en el navigator de index
        document.querySelector('.logout').innerHTML = `<button class="getout">Log out</button>`;
        document.querySelector('.getout').onclick = logOut;
    } else {
        document.querySelector('.logout').innerHTML = '';
    }
  });

}

if (document.title == 'Quiz') {
  pedirPreguntas()
}

if (document.title == 'Tu resultado') {
  let arrayGuardado = JSON.parse(localStorage.getItem("memoryCard"));
  let ultimaPuntuacion = arrayGuardado[arrayGuardado.length - 1].puntuacion

  const resultadoMostrado = document.querySelector("#puntuacion")
  const mensajeMostrado = document.querySelector("#mensajepuntuacion")

  resultadoMostrado.innerHTML = `${ultimaPuntuacion} / 10`
  ultimaPuntuacion == 10 ? mensajeMostrado.innerHTML = "¡Increible! ¡lo acertaste todo!" : (ultimaPuntuacion >= 5 ? mensajeMostrado.innerHTML = "Nada es perfecto... ¿verdad?" : mensajeMostrado.innerHTML = "¡Te has quedado lejos!")
}

if (document.title == '¡Bienvenido al Quiz!') {

  let arrayGuardado = JSON.parse(localStorage.getItem("memoryCard"));
  //Comprobación de datos para la apertura del mensaje inicial
  if (arrayGuardado.length == 0) {
    document.getElementById("homesection").style.display = "none";
    document.getElementById("primeravez").style.display = "block";
  }

  let arrayX = [];
  let arrayY = [];
  for (let i = 0; i < arrayGuardado.length; i++) {
    arrayX.push(arrayGuardado[i].fecha);
    arrayY.push(arrayGuardado[i].puntuacion);
  }
  //CHART de Chart.js:
  const arrayXLastTen = arrayX.slice(-10)
  const arrayYLastTen = arrayY.slice(-10)


  const ctx = document.getElementById('myChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: arrayXLastTen,
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

  addMessage('¿Te apetece echar una partida?', 5000);
  addMessage('Toca el botón de arriba, demuestra tus conocimientos y, sobretodo', 8000);
  addMessage('Venga, esta página no tiene nada más que mostrarte...', 13000);
  addMessage('...por ahora ;)', 16000);
  addMessage('La puntuación no va a aparecer por mucho que mires esta pantalla', 30000);
  addMessage('¿Un minuto esperando? ¡Ánimate y pulsa!?', 60000);

  //Login 

  document.getElementById("formlog").addEventListener("submit", function (event) {
    event.preventDefault();
    let mail = event.target.elements.logemail.value;
    let pass = event.target.elements.logpassword.value;
    console.log(mail, pass)
    loginUser(mail, pass)
  })
  //Apertura del registro de usuario
  const botonRegistro = document.getElementById('openregistration');
  const registro = document.getElementById('register');
  botonRegistro.onclick = () => registro.style.display !== 'block' ? registro.style.display = 'block' : registro.style.display = 'none' 

  //Registro de usuario
  document.getElementById('formreg').addEventListener('submit', (event) => {
    event.preventDefault();
    let mail = event.target.elements.email.value;
    let password = event.target.elements.password1.value;
    let checkPass = event.target.elements.password2.value;
    password === checkPass ? createUser(mail, password) : alert('Error: la contraseña debe ser la misma en los dos campos')
  })

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        botonRegistro.style.display = 'none';
        document.querySelector('#user-logged').style.display = 'block';
        document.querySelector('#nouser').style.display = 'none';
    } else {
        document.querySelector('#register').style.display = 'none';
        document.querySelector('#nouser').style.display = 'block';
    }
});
}