class Floater {
    constructor(distribution, clingyness) {
      this.location = createVector(random(width), random(height));
      this.velocity = createVector(random(-2, 2), random(-2, 2));
      this.clingyness = clingyness;
      this.leadership = this.assignLeadership(distribution);
      this.learn = this.leadership * random(0.001, 0.005);  // scaled evolution
      this.followers = 0;
      this.leader = null;
      this.topspeed = 3;
      this.defaultSize = 5;
      this.rgbColor = [255, 0, 255];
    }
  
    assignLeadership(distribution) {
      if (distribution === 'uniform') {
        return random();
      } else if (distribution === 'logarithmic') {
        return log(random(1.001, Math.E));  // avoid log(0)
      } else if (distribution === 'normal') {
        return constrain(randomGaussian(0.5, 0.15), 0, 1);
      }
      return random();  // fallback
    }
  
    update() {
      this.velocity.limit(this.topspeed);
      this.location.add(this.velocity);
      this.leadership += this.learn;
      if (this.leadership > 1) {
        this.leadership = random();  // reset if maxed out
      }
    }
  
    display(size) {
      let scaler = (colorMode === 'velocity')
        ? this.velocity.mag() / this.topspeed
        : this.leadership;
  
      scaler = constrain(scaler, 0, 1);
      fill(this.rgbColor[0]*scaler, this.rgbColor[1], this.rgbColor[2] - this.rgbColor[2]*scaler);
      noStroke();
      ellipse(this.location.x, this.location.y, size, size);
    }
  
    checkEdges() {
      let edge = width * 1.2;
      let velChange = this.topspeed / 50;
      if (this.location.x < edge) this.velocity.x += velChange;
      if (this.location.x > width - edge) this.velocity.x -= velChange;
      if (this.location.y < edge) this.velocity.y += velChange;
      if (this.location.y > height - edge) this.velocity.y -= velChange;
    }
  }
  