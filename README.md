[Live demo](https://mayankles.github.io/flocking-js/)

[Story Walkthrough](https://mayankles.github.io/flocking-js/story.html)

# Flocking Simulation

This is a dynamic, interactive simulation of flocking behavior using virtual agents called **Floaters**. Each Floater moves independently across the screen, influenced by local decision-making rules, simple behavioral traits, and emergent group dynamics.

It’s like watching a murmuration of birds — but powered by sliders and JavaScript.

---

![Floaters Demo](./media/floaters.2.gif)

---

## How It Works

Every Floater:
- Has a position, velocity, and "clingyness" (how strongly it reacts to others).
- Picks another Floater to follow based on **leadership** — a trait that can grow over time through **Learn Ability**.
- Adjusts its velocity to subtly move toward its leader or toward the mouse if you're clicking.
- Changes color based on its **speed** or **leadership value**, so you can visually track behavior.
- Avoids drifting off-screen using a soft “wall avoidance” behavior.

Over time, complex and beautiful motion patterns emerge from these simple rules.

---

## Interactive Controls

A floating control panel lets you modify simulation behavior in real time:

| Control                 | Description |
|------------------------|-------------|
| **Color Mode**         | Switch between coloring by velocity or leadership |
| **Leadership Distribution** | Choose how initial leadership values are spread (`uniform`, `logarithmic`, or `normal`) |
| **Number of Floaters** | Set the number of agents in the simulation (100–20,000) |
| **Floater Size**       | Adjust how big each Floater appears |
| **Clingyness**         | Controls how tightly Floaters follow their leader |
| **Awareness**          | How many others each Floater evaluates when choosing a new leader |
| **Learn Ability**      | Governs how quickly a Floater's leadership value increases (and resets) over time |
| **Use Allegiance**     | When enabled, a Floater compares new leaders against their current leader rather than themselves |
| **Mouse Influence**    | When enabled, clicking the canvas temporarily attracts all floaters to the mouse |
| **Reset Simulation**   | Re-initializes the Floaters using current control values

All controls update live — except number of Floaters and leadership distribution, which apply on reset.

---

## Story Mode

Want to explore how different forces shape emergent societies?

Try the [Story Walkthrough](https://mayankles.github.io/flocking-js/story.html) — a guided narrative where variables like Awareness and Learn Ability are introduced gradually, revealing how different patterns emerge from simple rules.

The narrative overlay appears at the top of the screen, while the simulation responds beneath it.

---

## Educational Concepts

This simulation explores:
- Agent-based modeling
- Emergence and self-organization
- Social dynamics and decentralized leadership
- Visual encoding of abstract states

It's a playful way to explore serious ideas — or just get lost in a satisfying swirl.

---

## Try It Out

Open `index.html` in a browser and start experimenting.  
Or use the hosted [Live Demo](https://mayankles.github.io/flocking-js/) right now.

Built with [p5.js](https://p5js.org/), fully browser-based — no setup required.

---

## Attributions

This project was resurrected from a [Processing sketch](https://openprocessing.org/sketch/462747) I wrote circa 2014ish, with the invaluable help of various ChatGPT flavors (4o, 4.5, o1, and o3-mini).
