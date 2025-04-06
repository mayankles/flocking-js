// Updated sketch.js with leadership distribution and learnability managed in Floater class
let colorModeSelector;
let distributionSelector;
let colorMode = 'velocity';
let leadershipDistribution = 'uniform';
let floaters = [];
let numEl = 500;
let floaterSize = 6;
let clingyness = 0.1;
let showMouseInfluence = true;

let numElSlider, sizeSlider, clingySlider, mouseCheckbox, resetButton;
let controlPanel, isDragging = false, dragOffset;

function setup() {
  createCanvas(windowWidth, windowHeight);

  controlPanel = createDiv('');
  controlPanel.position(20, 20);
  controlPanel.style('background', 'rgba(30, 30, 30, 0.7)');
  controlPanel.style('padding', '10px');
  controlPanel.style('border-radius', '8px');
  controlPanel.style('color', '#fff');
  controlPanel.style('width', '220px');
  controlPanel.style('user-select', 'none');

  controlPanel.elt.addEventListener('mousedown', (e) => {
    if (e.target === controlPanel.elt) {
      isDragging = true;
      dragOffset = createVector(mouseX - controlPanel.position().x, mouseY - controlPanel.position().y);
    }
  });

  controlPanel.mouseReleased(() => {
    isDragging = false;
  });

  controlPanel.child(createDiv('Color Mode'));
  colorModeSelector = createSelect();
  colorModeSelector.option('velocity');
  colorModeSelector.option('leadership');
  colorModeSelector.changed(() => colorMode = colorModeSelector.value());
  controlPanel.child(colorModeSelector);

  controlPanel.child(createDiv('Leadership Distribution'));
  distributionSelector = createSelect();
  distributionSelector.option('uniform');
  distributionSelector.option('logarithmic');
  distributionSelector.option('normal');
  distributionSelector.changed(() => leadershipDistribution = distributionSelector.value());
  controlPanel.child(distributionSelector);

  controlPanel.child(createDiv('Number of Floaters'));
  numElSlider = createSlider(100, 20000, numEl, 100);
  controlPanel.child(numElSlider);

  controlPanel.child(createDiv('Floater Size'));
  sizeSlider = createSlider(2, 20, floaterSize);
  controlPanel.child(sizeSlider);

  controlPanel.child(createDiv('Clingyness'));
  clingySlider = createSlider(0.01, 0.5, clingyness, 0.01);
  controlPanel.child(clingySlider);

  mouseCheckbox = createCheckbox('Mouse Influence', showMouseInfluence);
  mouseCheckbox.changed(() => showMouseInfluence = mouseCheckbox.checked());
  controlPanel.child(mouseCheckbox);

  resetButton = createButton('Reset Simulation');
  resetButton.mousePressed(resetSimulation);
  controlPanel.child(resetButton);

  initializeFloaters();
}

function draw() {
  background(0);

  if (isDragging) {
    controlPanel.position(mouseX - dragOffset.x, mouseY - dragOffset.y);
  }

  floaterSize = sizeSlider.value();
  for (let i = 0; i < floaters.length; i++) {
    let floater = floaters[i];

    let trials = 0;
    let newLeader = i;
    while (trials < 0.1 * numEl) {
      let j = int(random(numEl));
      if (i === j) continue;
      trials++;
      if (floaters[j].leadership > floater.leadership) {
        newLeader = j;
        break;
      }
    }

    floater.leader = newLeader;

    let target;
    if (showMouseInfluence && mouseIsPressed && !isMouseOverUI()) {
      target = createVector(mouseX, mouseY);
    } else {
      target = floaters[floater.leader].location.copy();
    }
    let dir = p5.Vector.sub(floater.location, target);
    dir.normalize();
    dir.mult(floater.clingyness);
    floater.velocity.sub(dir);

    floater.update();
    floater.checkEdges();
    floater.display(floaterSize);
  }
}

function isMouseOverUI() {
  let box = controlPanel.elt.getBoundingClientRect();
  return mouseX >= box.left && mouseX <= box.right &&
         mouseY >= box.top && mouseY <= box.bottom;
}

function resetSimulation() {
  initializeFloaters();
}

function initializeFloaters() {
  floaters = [];
  numEl = numElSlider.value();
  clingyness = clingySlider.value();
  for (let i = 0; i < numEl; i++) {
    let f = new Floater(leadershipDistribution, clingyness);
    f.leader = i;
    floaters.push(f);
  }
}
