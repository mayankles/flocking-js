[Live demo](https://mayankles.github.io/flocking-js/)

[Story Walkthrough](https://mayankles.github.io/flocking-js/story.html)

# Flocking Simulation

This is a dynamic, interactive simulation of flocking behavior using virtual agents called **Floaters**. Each Floater moves independently across the screen, influenced by local decision-making rules, simple behavioral traits, and emergent group dynamics.

It’s like watching a murmuration of birds — but powered by sliders and JavaScript.

---

## How It Works

Every Floater:
- Has a position, velocity, and "clingyness" (how strongly it reacts to others).
- Picks another Floater to follow based on **leadership** — a personal trait that can grow over time (learnability).
- Adjusts its velocity to subtly move toward its leader or toward the mouse if you're clicking.
- Changes color based on its **speed** or **leadership value**, so you can visually track behavior.
- Avoids drifting off-screen using a soft “wall avoidance” behavior.

Over time, complex and beautiful motion patterns emerge from these simple rules.

---

## Interactive Controls

A floating panel lets you control the simulation in real time:

| Control                 | Description |
|------------------------|-------------|
| **Color Mode**         | Switch between coloring by velocity or leadership |
| **Leadership Distribution** | Choose how initial leadership values are spread (`uniform`, `logarithmic`, or `normal`) |
| **Number of Floaters** | Set the number of agents in the simulation (100–20,000) |
| **Floater Size**       | Adjust how big each Floater appears |
| **Clingyness**         | Controls how strongly Floaters respond to their leader |
| **Leader Trial Fraction** | Fraction of the population each Floater samples when picking a new leader |
| **Learn ability**      | Governs how quickly a Floater's leadership value increases over time |
| **Use Allegiance**     | When enabled, a Floater compares new leaders against its current leader instead of itself |
| **Mouse Influence**    | When clicked, the mouse becomes a temporary attractor for all Floaters |
| **Reset Simulation**   | Re-initializes the Floaters using current settings |

All controls update live — except number of Floaters and distribution settings, which apply when you reset.

---

## Educational Concepts

This simulation explores concepts in:
- Agent-based modeling
- Emergence
- Social dynamics
- Distributed decision making
- Visual encoding of state (e.g. color = velocity)

It’s a fun way to learn how small local rules can produce global patterns — or just to zone out and enjoy the swirling motion.

---

## Try It Out

Open `index.html` in a browser and start playing.  A [live demo](https://mayankles.github.io/flocking-js/) can be viewed on the Github Page site.

No setup needed — everything runs with [p5.js](https://p5js.org/) in your browser.

# Attributions
This project was resurrected from a [Processing sketch](https://openprocessing.org/sketch/462747) I wrote circa 2014ish, thanks to some mix of ChatGPT 4o, 4.5, o1, and o3-mini.
