class FlipClock {
  constructor(element) {
    this.mainEl = element;
    this.elements = {
      frontTop: this.mainEl.querySelector(".flip-top.flip-front"),
      frontBottom: this.mainEl.querySelector(".flip-bottom.flip-front"),
      backTop: this.mainEl.querySelector(".flip-top.flip-back"),
      backBottom: this.mainEl.querySelector(".flip-bottom.flip-back"),
    };
    this.spans = {
      frontTop: this.elements.frontTop.querySelector("span"),
      frontBottom: this.elements.frontBottom.querySelector("span"),
      backTop: this.elements.backTop.querySelector("span"),
      backBottom: this.elements.backBottom.querySelector("span"),
    };
    this.currentNumber = 0;
    this.nextNumber = 0;
    this.isAnimating = false;
    this.animationProgress = 0;
  }

  updateElements(side) {
    this.spans[`${side}Top`].textContent = this.nextNumber;
    this.spans[`${side}Bottom`].textContent = this.nextNumber;
  }

  update(number) {
    const passedNumber = number.toString().padStart(2, "0");
    if (passedNumber === this.currentNumber || this.isAnimating) return;
    this.nextNumber = passedNumber;
    this.isAnimating = true;
    this.animationProgress = 0;
    this.updateElements("back");
    this.elements.backBottom.classList.add("hidden");
    this.elements.backBottom.style.transform = "rotateX(-90deg)";
    this.animate();
  }

  animate = (currentTime) => {
    if (!this.isAnimating) return;

    this.animationProgress += 0.01; // Adjust for faster/slower animation

    if (this.animationProgress <= 1) {
      this.animateFlip(this.animationProgress);
      requestAnimationFrame(this.animate);
    } else {
      this.finishAnimation();
    }
  };

  animateFlip(progress) {
    if (progress <= 0.5) {
      // Animate top half
      const rotation = -180 * progress;
      this.elements.frontTop.style.transform = `rotateX(${rotation}deg)`;
    } else {
      // Transition to bottom half
      if (progress <= 0.51) {
        this.elements.frontTop.classList.add("hidden");
        this.elements.backBottom.classList.remove("hidden");
        this.elements.backBottom.classList.add("active");
      }
      // Animate bottom half
      const rotation = 180 * (1 - progress);
      this.elements.backBottom.style.transform = `rotateX(${rotation}deg)`;
    }
  }

  finishAnimation() {
    this.elements.frontTop.style.transform = "";
    this.elements.frontTop.classList.remove("hidden");
    this.elements.backBottom.style.transform = "";
    this.elements.backBottom.classList.remove("active");
    this.elements.backBottom.classList.add("hidden");
    this.updateElements("front");
    this.currentNumber = this.nextNumber;
    this.isAnimating = false;
  }
}

class FlipClockManager {
  constructor(selector, cls = "") {
    this.mainEl = document.querySelector(selector);
    this.cls = cls;
    this.clocks = {};
    this.animationFrameId = null;
    this.lastUpdateTime = 0;
  }

  generateCounterHtml(unit) {
    return `
      <div class="flip-clock ${this.cls}" data-unit="${unit}">
        <div class="flip-top flip-front"><span>0</span></div>
        <div class="flip-top flip-back"><span>0</span></div>
        <div class="flip-bottom flip-front"><span>0</span></div>
        <div class="flip-bottom flip-back"><span>0</span></div>
      </div>
    `;
  }

  initializeClock(updateCallback) {
    const units = ["hours", "minutes", "seconds"];
    const html = units.map((unit) => this.generateCounterHtml(unit)).join("");

    this.mainEl.innerHTML = html;

    units.forEach((unit) => {
      const element = this.mainEl.querySelector(`[data-unit="${unit}"]`);
      this.clocks[unit] = new FlipClock(element);
    });

    this.stopClock();
    this.lastUpdateTime = performance.now();
    this.updateCallback = updateCallback;
    this.animate();
  }

  animate = (currentTime) => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    if (currentTime - this.lastUpdateTime >= 1000) {
      this.updateCallback();
      this.lastUpdateTime = currentTime;
    }
  };

  stopClock() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  updateClocks(hours, minutes, seconds) {
    this.clocks.hours.update(hours);
    this.clocks.minutes.update(minutes);
    this.clocks.seconds.update(seconds);
  }

  currentTime() {
    this.initializeClock(() => {
      const now = new Date();
      this.updateClocks(now.getHours(), now.getMinutes(), now.getSeconds());
    });
  }

  countdownToDate(countdownDate) {
    this.initializeClock(() => {
      const now = new Date();
      const dateDiff = Math.max(0, Math.floor((countdownDate - now) / 1000));
      const hours = Math.floor(dateDiff / 3600);
      const minutes = Math.floor(dateDiff / 60) % 60;
      const seconds = dateDiff % 60;
      this.updateClocks(hours, minutes, seconds);

      if (dateDiff === 0) this.stopClock();
    });
  }

  countFromDate(startDate) {
    this.initializeClock(() => {
      const now = new Date();
      const dateDiff = Math.floor((now - startDate) / 1000);
      const hours = Math.floor(dateDiff / 3600);
      const minutes = Math.floor(dateDiff / 60) % 60;
      const seconds = dateDiff % 60;
      this.updateClocks(hours, minutes, seconds);
    });
  }
}
