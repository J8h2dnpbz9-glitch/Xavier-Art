(() => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: true });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let width = 0;
  let height = 0;
  let imageData;
  let lastFrame = 0;

  canvas.className = "district-grain";
  canvas.setAttribute("aria-hidden", "true");
  document.body.classList.add("has-grain-canvas");
  document.body.append(canvas);

  const resize = () => {
    width = Math.min(420, Math.max(180, Math.ceil(window.innerWidth / 3)));
    height = Math.min(280, Math.max(120, Math.ceil(window.innerHeight / 3)));
    canvas.width = width;
    canvas.height = height;
    imageData = context.createImageData(width, height);
  };

  const draw = () => {
    const pixels = imageData.data;
    for (let index = 0; index < pixels.length; index += 4) {
      const value = 140 + Math.random() * 115;
      pixels[index] = value;
      pixels[index + 1] = value;
      pixels[index + 2] = value;
      pixels[index + 3] = Math.random() * 50;
    }
    context.putImageData(imageData, 0, 0);
  };

  const animate = (time) => {
    if (time - lastFrame > 83) {
      draw();
      lastFrame = time;
    }
    if (!reducedMotion.matches) requestAnimationFrame(animate);
  };

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
  if (!reducedMotion.matches) requestAnimationFrame(animate);
})();
