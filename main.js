const form = document.querySelector(".container section form");
const x = document.getElementById("x-coordinate");
const y = document.getElementById("y-coordinate");
const locationElements = document.querySelector(".container section .locations");
const btnDrawRoutes = document.querySelector('.all-routes');
// const gen = document.querySelector('.gen');


const allRutes = {};
let locations = [];


const deleteLocationHandler = (event) => {
  if (event.target.tagName !== "BUTTON") return;

  locations = locations.filter(
    (location) =>
      !(
        location.x === event.target.parentElement.dataset.x &&
        location.y === event.target.parentElement.dataset.y
      )
  );
  drawGraph();

  event.target.parentElement.remove();
};

locationElements.addEventListener("click", deleteLocationHandler);

const createLocEl = (x, y) => {
  const locationElement = document.createElement("div");
  locationElement.className = "location";
  locationElement.setAttribute("data-x", x);
  locationElement.setAttribute("data-y", y);

  const li = document.createElement("li");
  li.innerHTML = `(${x}, ${y})`;

  const button = document.createElement("button");
  button.innerHTML = "Delete";

  locationElement.append(li, button);
  locationElements.appendChild(locationElement);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (x.value.trim() === "" || y.value.trim() === "") return;

  for (let i = 0; i < locations.length; i++) {
    if (locations[i].x === x.value && locations[i].y === y.value) return;
  }

  locations.push({ x: x.value, y: y.value });
  addGraphNode(x.value * 20, height - y.value * 20);
  createLocEl(x.value, y.value);

  drawGraph();
  x.value = y.value = "";
  x.focus();
  console.log(locations);
  randomPopulation();
  calcFitness();

  normalizeFitness();
  best = calcBest(fitness);
  drawBest();


});

const myCanvas = document.getElementById("my-canvas");
const ctx = myCanvas.getContext("2d");
const height = myCanvas.height;
const width = myCanvas.width;


function blackbg() {
  ctx.beginPath();
  ctx.moveTo(0, newBegin);
  ctx.lineTo(width, newBegin);
  ctx.lineWidth = 22222;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}
const createVerticalLine = (newBegin) => {
  ctx.beginPath();
  ctx.moveTo(newBegin, 0);
  ctx.lineTo(newBegin, height);
  ctx.lineWidth = .5;
  ctx.strokeStyle = 'white';
  ctx.stroke();
};

const createHorizontalLine = (newBegin) => {
  ctx.beginPath();
  ctx.moveTo(0, newBegin);
  ctx.lineTo(width, newBegin);
  ctx.lineWidth = .5;
  ctx.strokeStyle = 'white';
  ctx.stroke();
};

const addGraphNode = (x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.strokeStyle = 'white';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  // ctx.strokeStyle = 'white';
  ctx.fill();
  ctx.stroke();
  // ctx.arc(x, y, 8, 0, 1 * Math.PI);
  // ctx.fillStyle = "white";
  // ctx.stroke();
};



const drawRoute = (from, to) => {
  ctx.beginPath();
  ctx.moveTo(from.x * 20, height - (from.y * 20));
  ctx.lineTo(to.x * 20, height - (to.y * 20));
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  ctx.stroke();
};



const drawGraph = () => {

  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < locations.length; i++) {
    addGraphNode(locations[i].x * 20, height - locations[i].y * 20);

  }
  drawPosiblePaths();

};

drawGraph();
function drawPosiblePaths() {
  // drawGraph();
  for (let i = 0; i < locations.length; i++) {
    allRutes[i] = [];
    for (let j = i + 1; j < locations.length; j++) {
      // drawRoute(locations[i], locations[j]);
      const dist = Math.sqrt(((locations[i].x - locations[j].x) ** 2) + ((locations[i].y - locations[j].y) ** 2));
      const jObj = {};
      jObj[j] = dist;
      allRutes[i].push(jObj);

    }
  };
};

// console.log('locations', locations);
let population = new Array();
let populationSize = 10;
const fitness = [];
let best;

function randomPopulation() {
  for (let i = 0; i < populationSize; i++) {
    population[i] = shuffleArr(locations.map((el, i) => {
      return { order: ++i, vector: el };
    }));

  }

}

function calcFitness() {

  for (let i = 0; i < populationSize; i++) {
    let sum = 0;

    for (let j = 0; j < population[i].length; j++) {
      if (j === population[i].length - 1) break;
      sum += Math.sqrt(((population[i][j].vector.x - population[i][j + 1].vector.x) ** 2) + ((population[i][j].vector.y - population[i][j + 1].vector.y) ** 2));
    }
    fitness[i] = 1 / sum;

  }

}

function calcBest(array) {
  let best = 0;
  for (let i = 0; i < populationSize; i++) {
    if (array[i] > array[best]) best = i;
  }
  return best;
}

function drawBest() {
  drawGraph();
  const bestSol = population[best];
  for (let i = 0; i < bestSol.length; i++) {
    const j = i === bestSol.length - 1 ? 0 : i + 1;
    drawRoute(bestSol[i].vector, bestSol[j].vector);
  }
}







console.log('kick off population', population);
console.log('kick off fitness', fitness);
console.log('kick off best', best);



function renderOneFrame() {

}


function runMutationAndNewGen() {



}


function nextGeneration() {
  const newPopulation = [];
  for (var i = 0; i < population.length; i++) {
    const order = pickOne(population, fitness);
    mutate(order);
    newPopulation[i] = order;
  }

  population = newPopulation;
  console.log('new pop', population);
};

function mutate(order, mutationRate) {
  const len = population[0].length;
  const indexA = Math.floor(Math.random() * len);
  const indexB = Math.floor(Math.random() * len);
  console.log('a', indexA);
  swap(order, indexA, indexB);
}

function pickOne(list, prob) {
  let index = 0;
  let r = Math.random();

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function normalizeFitness() {
  let sum = 0;
  for (let i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }
  for (let i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;
  }
}



btnDrawRoutes.onclick = (e) => {



  for (i = 0; i < 100; i++) {


    (function () {
      setTimeout(function () {

        console.log(i, 'we are here in settime');
        // gen.innerHTML = i;

        oldbest = fitness[best];
        console.log('oldbest', oldbest);
        console.log('oldbest best', best);
        nextGeneration();
        console.log('after new gen populatipon', population);
        calcFitness();
        console.log('fitness after new gen', fitness);
        normalizeFitness();
        console.log('fitness after new  and normalize', fitness);
        const newbestIndex = calcBest(fitness);
        newbest = fitness[newbestIndex];
        console.log('newbest best', best);

        if (newbest > oldbest) {
          best = newbestIndex;
          drawBest();

        }

      }, 150);
    })();
  };

  // runMutationAndNewGen();
};

function shuffleArr(array) {
  let tmp, current, top = array.length;
  if (top) while (--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}

function swap(arr, fIndex, sIndex) {
  const temp = arr[fIndex];
  arr[fIndex] = arr[sIndex];
  arr[sIndex] = temp;
}