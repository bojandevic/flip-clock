class FlipClock {
  constructor(selector) {
    this.mainEl = document.querySelector(selector);
    this.frontTopEl = this.mainEl.querySelector("div.flip-top.flip-front");
    this.frontBottomEl = this.mainEl.querySelector(
      "div.flip-bottom.flip-front"
    );
    this.backTopEl = this.mainEl.querySelector("div.flip-top.flip-back");
    this.backBottomEl = this.mainEl.querySelector("div.flip-bottom.flip-back");

    this.setupEventListeners();
  }

  setupEventListeners() {
    const animationEndEvents =
      "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd";

    this.frontTopEl.addEventListener(animationEndEvents, () => {
      this.frontTopEl.classList.remove("flip-top-animate");
      this.updateFrontElements();
      this.frontBottomEl.classList.add("flip-bottom-animate");
    });

    this.frontBottomEl.addEventListener(animationEndEvents, () => {
      this.frontBottomEl.classList.remove("flip-bottom-animate");
      this.updateBackElements();
    });
  }

  updateFrontElements() {
    this.frontTopEl.querySelector("span").textContent = this.nextNumber;
    this.frontBottomEl.querySelector("span").textContent = this.nextNumber;
  }

  updateBackElements() {
    this.backTopEl.querySelector("span").textContent = this.nextNumber;
    this.backBottomEl.querySelector("span").textContent = this.nextNumber;
  }

  update(number) {
    if (number === this.nextNumber) return;

    this.nextNumber = number;
    this.frontTopEl.classList.add("flip-top-animate");
    this.backTopEl.querySelector("span").textContent = this.nextNumber;
  }
}

// FlipClockManager class
class FlipClockManager {
  static idx = 0;

  constructor(selector, cls) {
    this.mainEl = document.querySelector(selector);
    this.cls = cls;
    FlipClockManager.idx++;
  }

  generateCounterHtml(id, cls) {
    return `
      <div id="${id}" class="flip-clock ${cls}">
        <div class="flip-top flip-front"><span>0</span></div>
        <div class="flip-top flip-back"><span>0</span></div>
        <div class="flip-bottom flip-front"><span>0</span></div>
        <div class="flip-bottom flip-back"><span>0</span></div>
      </div>
    `;
  }

  initializeClock(callback) {
    const mainHTML = [
      this.generateCounterHtml(`fc-hours${FlipClockManager.idx}`, this.cls),
      this.generateCounterHtml(`fc-minutes${FlipClockManager.idx}`, this.cls),
      this.generateCounterHtml(`fc-seconds${FlipClockManager.idx}`, this.cls),
    ].join("");

    this.mainEl.innerHTML = mainHTML;

    this.hours = new FlipClock(`#fc-hours${FlipClockManager.idx}`);
    this.minutes = new FlipClock(`#fc-minutes${FlipClockManager.idx}`);
    this.seconds = new FlipClock(`#fc-seconds${FlipClockManager.idx}`);

    if (this.currentInterval) {
      clearInterval(this.currentInterval);
    }

    this.currentInterval = setInterval(callback, 1000);
  }

  currentTime() {
    this.initializeClock(() => {
      const date = new Date();
      this.hours.update(date.getHours());
      this.minutes.update(date.getMinutes());
      this.seconds.update(date.getSeconds());
    });
  }

  countdownToDate(countdownDate) {
    this.initializeClock(() => {
      const dateDiff = Math.round((countdownDate - new Date()) / 1000);
      this.hours.update(Math.floor(dateDiff / 3600));
      this.minutes.update(Math.floor(dateDiff / 60) % 60);
      this.seconds.update(dateDiff % 60);
    });
  }

  countFromDate(startDate) {
    this.initializeClock(() => {
      const dateDiff = Math.round((new Date() - startDate) / 1000);
      this.hours.update(Math.floor(dateDiff / 3600));
      this.minutes.update(Math.floor(dateDiff / 60) % 60);
      this.seconds.update(dateDiff % 60);
    });
  }
}
