(() => {
  const colors = [
    { name: "あか", value: "#f2505c" },
    { name: "あお", value: "#4388e8" },
    { name: "きいろ", value: "#ffd447" },
    { name: "みどり", value: "#48b96b" },
    { name: "オレンジ", value: "#ff913d" },
    { name: "ピンク", value: "#f47bb1" },
    { name: "むらさき", value: "#9b6bd3" },
    { name: "みずいろ", value: "#53c5d5" },
    { name: "ちゃいろ", value: "#9a6849" },
    { name: "くろ", value: "#383838" },
    { name: "しろ", value: "#ffffff" },
  ];

  const canvas = document.querySelector("#drawingCanvas");
  const context = canvas.getContext("2d");
  const palette = document.querySelector("#colorPalette");
  const brushSizes = document.querySelector("#brushSizes");
  const eraserButton = document.querySelector("#eraserButton");
  const clearButton = document.querySelector("#clearButton");
  const selectedColorName = document.querySelector("#selectedColorName");
  const toolStatus = document.querySelector("#toolStatus");
  const guideButtons = document.querySelector("#guideButtons");
  const guideOverlay = document.querySelector("#guideOverlay");
  const canvasHint = document.querySelector("#canvasHint");

  let selectedColor = colors[0];
  let brushSize = 14;
  let erasing = false;
  let drawing = false;
  let previousPoint = null;
  let hasDrawing = false;

  function updateToolStatus() {
    const activeSize = [...brushSizes.querySelectorAll(".size-button")]
      .find((button) => button.getAttribute("aria-pressed") === "true");
    const sizeName = activeSize?.textContent.trim() ?? "ふつう";
    toolStatus.textContent = erasing
      ? "けしゴムをつかっているよ"
      : `${selectedColor.name}いろ・${sizeName}のふで`;
    selectedColorName.textContent = erasing ? "けしゴム" : `${selectedColor.name}いろ`;
  }

  function selectColor(color, button) {
    selectedColor = color;
    erasing = false;
    eraserButton.classList.remove("is-active");
    eraserButton.setAttribute("aria-pressed", "false");
    palette.querySelector(".is-selected")?.classList.remove("is-selected");
    palette.querySelector('[aria-pressed="true"]')?.setAttribute("aria-pressed", "false");
    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");
    updateToolStatus();
  }

  colors.forEach((color, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-button";
    button.dataset.color = color.name === "しろ" ? "white" : color.name;
    button.style.backgroundColor = color.value;
    button.setAttribute("aria-label", `${color.name}いろ`);
    button.setAttribute("aria-pressed", String(index === 0));
    if (index === 0) button.classList.add("is-selected");
    button.addEventListener("click", () => selectColor(color, button));
    palette.append(button);
  });

  brushSizes.addEventListener("click", (event) => {
    const button = event.target.closest(".size-button");
    if (!button) return;
    brushSize = Number(button.dataset.size);
    brushSizes.querySelectorAll(".size-button").forEach((sizeButton) => {
      const selected = sizeButton === button;
      sizeButton.classList.toggle("is-selected", selected);
      sizeButton.setAttribute("aria-pressed", String(selected));
    });
    updateToolStatus();
  });

  eraserButton.addEventListener("click", () => {
    erasing = !erasing;
    eraserButton.classList.toggle("is-active", erasing);
    eraserButton.setAttribute("aria-pressed", String(erasing));
    updateToolStatus();
  });

  function setGuide(guide, button) {
    const currentlySelected = button.getAttribute("aria-pressed") === "true";
    guideButtons.querySelectorAll(".guide-button").forEach((guideButton) => {
      guideButton.classList.remove("is-selected");
      guideButton.setAttribute("aria-pressed", "false");
    });

    if (currentlySelected) {
      guideOverlay.replaceChildren();
      return;
    }

    guideOverlay.innerHTML = guide.art;
    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");
  }

  window.IroawaseGuides.forEach((guide) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "guide-button";
    button.dataset.guide = guide.id;
    button.setAttribute("aria-label", `${guide.name}のおてほんをひょうじ`);
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `<span class="guide-emoji" aria-hidden="true">${guide.emoji}</span><span>${guide.name}</span>`;
    button.addEventListener("click", () => setGuide(guide, button));
    guideButtons.append(button);
  });

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const oldCanvas = document.createElement("canvas");
    oldCanvas.width = canvas.width;
    oldCanvas.height = canvas.height;
    oldCanvas.getContext("2d").drawImage(canvas, 0, 0);

    const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * pixelRatio);
    canvas.height = Math.round(rect.height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    if (oldCanvas.width && oldCanvas.height) {
      context.drawImage(oldCanvas, 0, 0, oldCanvas.width, oldCanvas.height,
        0, 0, rect.width, rect.height);
    }
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function applyStrokeStyle() {
    context.lineWidth = brushSize;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    context.strokeStyle = selectedColor.value;
  }

  function startDrawing(event) {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    drawing = true;
    previousPoint = getPoint(event);
    canvas.setPointerCapture(event.pointerId);
    applyStrokeStyle();
    context.beginPath();
    context.arc(previousPoint.x, previousPoint.y, brushSize / 2, 0, Math.PI * 2);
    context.fillStyle = selectedColor.value;
    if (erasing) {
      context.globalCompositeOperation = "destination-out";
    }
    context.fill();
    hasDrawing = true;
    canvasHint.classList.add("is-hidden");
  }

  function draw(event) {
    if (!drawing || !previousPoint) return;
    event.preventDefault();
    const point = getPoint(event);
    const middle = {
      x: (previousPoint.x + point.x) / 2,
      y: (previousPoint.y + point.y) / 2,
    };
    applyStrokeStyle();
    context.beginPath();
    context.moveTo(previousPoint.x, previousPoint.y);
    context.quadraticCurveTo(previousPoint.x, previousPoint.y, middle.x, middle.y);
    context.stroke();
    previousPoint = point;
    hasDrawing = true;
    canvasHint.classList.add("is-hidden");
  }

  function stopDrawing() {
    if (!drawing) return;
    drawing = false;
    previousPoint = null;
    context.closePath();
    context.globalCompositeOperation = "source-over";
  }

  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);
  canvas.addEventListener("lostpointercapture", stopDrawing);

  clearButton.addEventListener("click", () => {
    if (!hasDrawing || window.confirm("かいたえを ぜんぶけしてもいい？")) {
      const rect = canvas.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);
      hasDrawing = false;
      canvasHint.classList.remove("is-hidden");
    }
  });

  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(canvas);
  window.addEventListener("orientationchange", resizeCanvas);
  updateToolStatus();
})();
