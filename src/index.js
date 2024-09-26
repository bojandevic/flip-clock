// Constants
const ANIMATION_END_EVENTS =
  "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd";
const UPDATE_INTERVAL = 1000; // 1 second

class FlipClock {
  constructor(selector) {
    this.mainEl = document.querySelector(selector);
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
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.elements.frontTop.addEventListener(ANIMATION_END_EVENTS, () => {
      this.elements.frontTop.classList.remove("flip-top-animate");
      this.updateElements("front");
      this.elements.frontBottom.classList.add("flip-bottom-animate");
    });

    this.elements.frontBottom.addEventListener(ANIMATION_END_EVENTS, () => {
      this.elements.frontBottom.classList.remove("flip-bottom-animate");
      this.updateElements("back");
    });
  }

  updateElements(side) {
    this.spans[`${side}Top`].textContent = this.nextNumber;
    this.spans[`${side}Bottom`].textContent = this.nextNumber;
  }

  update(number) {
    if (number === this.nextNumber) return;
    this.nextNumber = number;
    this.elements.frontTop.classList.add("flip-top-animate");
    this.spans.backTop.textContent = this.nextNumber;
  }
}

class FlipClockManager {
  static idx = 0;

  constructor(selector, cls = "") {
    this.mainEl = document.querySelector(selector);
    this.cls = cls;
    this.clocks = {};
    this.currentInterval = null;
  }

  generateCounterHtml(id) {
    return `
      <div id="${id}" class="flip-clock ${this.cls}">
        <div class="flip-top flip-front"><span>0</span></div>
        <div class="flip-top flip-back"><span>0</span></div>
        <div class="flip-bottom flip-front"><span>0</span></div>
        <div class="flip-bottom flip-back"><span>0</span></div>
      </div>
    `;
  }

  initializeClock(updateCallback) {
    FlipClockManager.idx++;
    const units = ["hours", "minutes", "seconds"];
    const html = units
      .map((unit) =>
        this.generateCounterHtml(`fc-${unit}${FlipClockManager.idx}`)
      )
      .join("");

    this.mainEl.innerHTML = html;

    units.forEach((unit) => {
      this.clocks[unit] = new FlipClock(`#fc-${unit}${FlipClockManager.idx}`);
    });

    this.stopClock();
    this.currentInterval = setInterval(updateCallback, UPDATE_INTERVAL);
  }

  stopClock() {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
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
