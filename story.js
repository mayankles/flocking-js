// story.js - includes original sketch.js logic and narrative functionality
let canvas;
let floaters = [];
let numEl = 100;
let floaterSize = 20;

let clingySlider, awarenessSlider, learnAbilitySlider;

let currentStage = 0;

function setupNarrative() {
  const narrativeText = document.getElementById("narrative-text");
  const nextBtn = document.getElementById("next-btn");

  function loadStage(stageIndex) {
    const stage = narrativeStages[stageIndex];
    narrativeText.classList.add("typing");
    narrativeText.innerHTML = "";
    let i = 0;
    const speed = 30;
    function typeWriter() {
      if (i < stage.text.length) {
        narrativeText.innerHTML += stage.text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }
    typeWriter();

    awarenessSlider.value(stage.settings.awareness);
    learnAbilitySlider.value(stage.settings.learnAbility);
    clingySlider.value(stage.settings.clingyness);

    // resetSimulation();
  }

  nextBtn.addEventListener('click', () => {
    currentStage = (currentStage + 1) % narrativeStages.length;
    loadStage(currentStage);
  });

  loadStage(currentStage);
}

function setup() {
  let simArea = document.getElementById('simulation-area');
  let w = simArea.offsetWidth;
  let h = simArea.offsetHeight;
  canvas = createCanvas(w, h).parent('simulation-area');
  canvas.style('z-index', '-1');
  canvas.style('display', 'block');

  clingySlider = createSlider(0.01, 0.5, 0.05, 0.01);
  awarenessSlider = createSlider(0.00, 1.0, 0, 0.01);
  learnAbilitySlider = createSlider(0, 0.005, 0, 0.0001);

  initializeFloaters();
  setupNarrative();
}

function draw() {
  background(0);

  for (let floater of floaters) {
    let trials = 0;
    let newLeader = floater;
    while (trials < awarenessSlider.value() * numEl) {
      let candidate = random(floaters);
      if (candidate === floater) continue;
      trials++;
      if (candidate.leadership > newLeader.leadership) {
        newLeader = candidate;
        break;
      }
    }

    floater.leader = newLeader;

    let target = floater.leader.location.copy();
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

function initializeFloaters() {
  floaters = [];
  for (let i = 0; i < numEl; i++) {
    let f = new Floater('normal', clingySlider.value());
    f.leader = f;
    floaters.push(f);
  }
}

// Narrative logic
let narrativeStages = [
  { text: "🌑 Age of Wanderers: Each floater drifts alone, aimlessly.", settings: {awareness: 0, learnAbility: 0, clingyness: 0.05} },
  { text: "🌙 First Contact: Awareness awakens, and gently pulls floaters into a cluster.", settings: {awareness: 0.01, learnAbility: 0, clingyness: 0.05} },
  { text: "🌠 Rising Ambition: Awareness deepens; clusters stretch into ribbons, following their flocking rules.", settings: {awareness: 0.05, learnAbility: 0, clingyness: 0.05} },
  { text: "☄️ Streamlined Society: High awareness forms a tight ribbon, unified in a pursuit of the mother flocker.", settings: {awareness: 0.5, learnAbility: 0, clingyness: 0.05} },
  { text: "🌌 Awakening: Introducing learn ability gently disrupts the tightness, creating an adaptive cluster.", settings: {awareness: 0.5, learnAbility: 0.001, clingyness: 0.1} },
  { text: "🌟 Dynamic Equilibrium: Floaters pulse with continual renewal and adaptation or collapse into a tight ball.", settings: {awareness: 0.5, learnAbility: 0.003, clingyness: 0.15} }
];


function resetSimulation() {
  initializeFloaters();
}
