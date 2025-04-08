// Updated sketch.js with leadership distribution and learnability managed in Floater class
let colorModeSelector;
let distributionSelector;
let colorMode = 'leadership';
let leadershipDistribution = 'normal';
let floaters = [];
let numEl = 1000;
let floaterSize = 8;
let clingyness = 0.05;
let leaderTrial = 0;
let learnAbility = 0;
let allegiance = false;
let showMouseInfluence = false;

let numElSlider, sizeSlider, clingySlider, leaderTrialSlider, learnAbilitySlider, allegianceCheckbox, mouseCheckbox, resetButton;
let controlPanel, isDragging = false, dragOffset;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  controlPanel = createDiv('');
  let toggleButton = createButton('❐');
  toggleButton.position(0, 0);
  toggleButton.style('z-index', '10');
  toggleButton.style('font-size', '20px');
  toggleButton.style('background', '#222');
  toggleButton.style('color', '#fff');
  toggleButton.style('border', 'none');
  toggleButton.style('padding', '4px 8px');
  toggleButton.style('cursor', 'pointer');
  let panelVisible = true;
  toggleButton.mousePressed(() => {
    panelVisible = !panelVisible;
    controlPanel.style('display', panelVisible ? 'block' : 'none');
  });
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

  let colorModeLabel = createDiv('Color Mode');
  let colorModeHelp = createSpan(' ℹ️');
  colorModeHelp.attribute('title', 'Select how floaters are colored: by speed (velocity) or influence (leadership).');
  colorModeHelp.style('cursor', 'help');
  colorModeLabel.child(colorModeHelp);
  controlPanel.child(colorModeLabel);
  colorModeSelector = createSelect();
  colorModeSelector.option('velocity');
  colorModeSelector.option('leadership');
  colorModeSelector.changed(() => colorMode = colorModeSelector.value());
  colorModeSelector.attribute('title', 'Select how floaters are colored: by speed (velocity) or influence (leadership).');
  colorModeSelector.selected(colorMode);
  controlPanel.child(colorModeSelector);

  let distributionLabel = createDiv('Leadership Distribution');
  let distributionHelp = createSpan(' ℹ️');
  distributionHelp.attribute('title', 'Choose the statistical distribution used to assign initial leadership scores.');
  distributionHelp.style('cursor', 'help');
  distributionLabel.child(distributionHelp);
  controlPanel.child(distributionLabel);
  distributionSelector = createSelect();
  distributionSelector.option('uniform');
  distributionSelector.option('logarithmic');
  distributionSelector.option('normal');
  distributionSelector.changed(() => leadershipDistribution = distributionSelector.value());
  distributionSelector.attribute('title', 'Choose the statistical distribution used to assign initial leadership scores.');
  distributionSelector.selected(leadershipDistribution);
  controlPanel.child(distributionSelector);

  let numElLabel = createDiv();
  let numElHelp = createSpan(' ℹ️');
  numElHelp.attribute('title', 'Sets the total number of agents (Floaters) in the simulation. Only takes effect on reset.');
  numElHelp.style('cursor', 'help');
  numElLabel.html('Number of Floaters: ' + numEl);
  numElLabel.child(numElHelp);
  controlPanel.child(numElLabel);
  numElSlider = createSlider(10, 10000, numEl, 100);
  numElSlider.input(() => numElLabel.html('Number of Floaters: ' + numElSlider.value()).append(numElHelp));
  controlPanel.child(numElSlider);

  let sizeLabel = createDiv();
  let sizeHelp = createSpan(' ℹ️');
  sizeHelp.attribute('title', 'Visual size of each Floater on screen.');
  sizeHelp.style('cursor', 'help');
  sizeLabel.html('Floater Size: ' + floaterSize);
  sizeLabel.child(sizeHelp);
  controlPanel.child(sizeLabel);
  sizeSlider = createSlider(2, 20, floaterSize);
  sizeSlider.input(() => sizeLabel.html('Floater Size: ' + sizeSlider.value()).append(sizeHelp));
  controlPanel.child(sizeSlider);

  let clingyLabel = createDiv();
  let clingyHelp = createSpan(' ℹ️');
  clingyHelp.attribute('title', 'Controls how quickly a Floater adjusts its direction toward a leader.');
  clingyHelp.style('cursor', 'help');
  clingyLabel.html('Clingyness: ' + clingyness);
  clingyLabel.child(clingyHelp);
  controlPanel.child(clingyLabel);
  clingySlider = createSlider(0.01, 0.5, clingyness, 0.01);
  clingySlider.input(() => clingyLabel.html('Clingyness: ' + clingySlider.value().toFixed(2)).append(clingyHelp));
  controlPanel.child(clingySlider);

  let trialLabel = createDiv();
  let trialHelp = createSpan(' ℹ️');
  trialHelp.attribute('title', 'The fraction of the total population that each Floater samples when choosing a new leader.');
  trialHelp.style('cursor', 'help');
  trialLabel.html('Leader Trial Fraction: ' + leaderTrial);
  trialLabel.child(trialHelp);
  controlPanel.child(trialLabel);
  leaderTrialSlider = createSlider(0.00, 1.0, 0.5, 0.01);
  leaderTrialSlider.input(() => trialLabel.html('Leader Trial Fraction: ' + leaderTrialSlider.value().toFixed(2)).append(trialHelp));
  controlPanel.child(leaderTrialSlider);

  let learnLabel = createDiv();
  let learnHelp = createSpan(' ℹ️');
  learnHelp.attribute('title', 'The rate at which a Floater\'s leadership score increases over time.');
  learnHelp.style('cursor', 'help');
  learnLabel.html('Learn Ability: ' + learnAbility);
  learnLabel.child(learnHelp);
  controlPanel.child(learnLabel);
  learnAbilitySlider = createSlider(0, 0.005, 0.001, 0.0001);
  learnAbilitySlider.input(() => learnLabel.html('Learn Ability: ' + learnAbilitySlider.value().toFixed(4)).append(learnHelp));
  controlPanel.child(learnAbilitySlider);

  let allegianceRow = createDiv();
  allegianceRow.style('display', 'flex');
  allegianceRow.style('align-items', 'center');
  allegianceRow.style('gap', '4px');
  allegianceCheckbox = createCheckbox('Use Allegiance', allegiance);
  let allegianceHelp = createSpan(' ℹ️');
  allegianceHelp.attribute('title', 'When enabled, floaters compare new leaders against their current leader instead of themselves.');
  allegianceHelp.style('cursor', 'help');
  allegianceRow.child(allegianceCheckbox);
  allegianceRow.child(allegianceHelp);
  controlPanel.child(allegianceRow);

  let mouseRow = createDiv();
  mouseRow.style('display', 'flex');
  mouseRow.style('align-items', 'center');
  mouseRow.style('gap', '4px');
  mouseCheckbox = createCheckbox('Mouse Influence', showMouseInfluence);
  let mouseHelp = createSpan(' ℹ️');
  mouseHelp.attribute('title', 'When enabled, clicking the canvas will temporarily attract all floaters to the mouse position.');
  mouseHelp.style('cursor', 'help');
  mouseCheckbox.changed(() => showMouseInfluence = mouseCheckbox.checked());
  mouseRow.child(mouseCheckbox);
  mouseRow.child(mouseHelp);
  controlPanel.child(mouseRow);

  let resetRow = createDiv();
  resetRow.style('display', 'flex');
  resetRow.style('align-items', 'center');
  resetRow.style('gap', '4px');
  resetButton = createButton('Reset Simulation');
  let resetHelp = createSpan(' ℹ️');
  resetHelp.attribute('title', 'Re-initializes all floaters using the current control panel settings.');
  resetHelp.style('cursor', 'help');
  resetButton.mousePressed(resetSimulation);
  resetRow.child(resetButton);
  resetRow.child(resetHelp);
  controlPanel.child(resetRow);

  // Set initial values for sliders and selectors

  // Recording panel setup
let capturer;
let recording = false;
let recordPanel = createDiv();
recordPanel.position(windowWidth - 140, windowHeight - 50);
recordPanel.style('position', 'fixed');
recordPanel.style('background', 'rgba(30, 30, 30, 0.7)');
recordPanel.style('padding', '6px');
recordPanel.style('border-radius', '6px');
recordPanel.style('color', '#fff');
recordPanel.style('user-select', 'none');
recordPanel.style('z-index', '10');
recordPanel.style('display', 'none');

let recordToggle = createButton('🎬');
recordToggle.position(windowWidth - 50, windowHeight - 50);
recordToggle.style('position', 'fixed');
recordToggle.style('font-size', '18px');
recordToggle.style('background', '#222');
recordToggle.style('color', '#fff');
recordToggle.style('border', 'none');
recordToggle.style('padding', '4px 8px');
recordToggle.style('border-radius', '4px');
recordToggle.style('cursor', 'pointer');
recordToggle.style('z-index', '11');

recordToggle.mousePressed(() => {
  recordPanel.style('display', recordPanel.style('display') === 'none' ? 'block' : 'none');
});

// TODO: Fix CCapture integration — currently causes 'width and height must be set prior to rendering' error
// TODO: Fix CCapture integration — currently causes 'width and height must be set prior to rendering' error
let captureButton = createButton('🎥 Start Recording');
captureButton.attribute('disabled', true);
recordPanel.child(captureButton);
  colorModeSelector.selected(colorMode);
  distributionSelector.selected(leadershipDistribution);
  numElSlider.value(numEl);
  sizeSlider.value(floaterSize);
  clingySlider.value(clingyness);
  leaderTrialSlider.value(leaderTrial);
  learnAbilitySlider.value(learnAbility);
  allegianceCheckbox.checked(allegiance);
  mouseCheckbox.checked(showMouseInfluence);


  initializeFloaters();
}

function draw() {
  if (typeof capturer !== 'undefined' && recording) {
    capturer.capture(canvas.elt);
  }
  background(0);

  if (isDragging) {
    controlPanel.position(mouseX - dragOffset.x, mouseY - dragOffset.y);
  }

  floaterSize = sizeSlider.value();
  for (let i = 0; i < floaters.length; i++) {
    let floater = floaters[i];

    let trials = 0;
    let newLeader = i;
    let trialFraction = leaderTrialSlider.value();
    while (trials < trialFraction * numEl) {
      let j = int(random(numEl));
      if (i === j) continue;
      trials++;
      let comparisonLeadership = allegianceCheckbox.checked() ? floaters[floater.leader].leadership : floater.leadership;
      if (floaters[j].leadership > comparisonLeadership) {
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
    dir.mult(clingySlider.value());
    floater.velocity.sub(dir);

    floater.learn = learnAbilitySlider.value();
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
