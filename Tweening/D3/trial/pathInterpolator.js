document.getElementById("generateAnimatedSVGs").addEventListener("click", function () {
    const startFile = document.getElementById("startSvg").files[0];
    const endFile = document.getElementById("endSvg").files[0];

    if (!startFile || !endFile) {
      alert("Please upload both start and end SVG files.");
      return;
    }

    Promise.all([startFile.text(), endFile.text()]).then(
      ([startSvgData, endSvgData]) => {
        const parser = new DOMParser();
        const startSvgDoc = parser.parseFromString(startSvgData, "image/svg+xml");
        const endSvgDoc = parser.parseFromString(endSvgData, "image/svg+xml");

        const startPaths = [...startSvgDoc.querySelectorAll("path")];
        const endPaths = [...endSvgDoc.querySelectorAll("path")];
        const animationSVG = document.getElementById("animationSVG");
        animationSVG.innerHTML = ""; // Clear existing paths

        if (startPaths.length !== endPaths.length) {
          alert("Mismatched number of paths in SVG files.");
          return;
        }

        // Append paths with animate tags to SVG without initial 'd' attributes
        startPaths.forEach((path, index) => {
          // Create a new path element for each frame
          const newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

          //Assuming that both svgs have the same fill color
          const startFill = path.getAttribute("fill");
          newPath.setAttribute("fill", startFill);

          const animateElement = document.createElementNS("http://www.w3.org/2000/svg", "animate");
          // 
          animateElement.setAttribute("attributeName", "d");
          animateElement.setAttribute("repeatCount", "indefinite");

          const numFrames = 20;
          const keyTimes = Array.from({ length: numFrames + 1 }, (_, i) =>
            (i / numFrames).toFixed(2)
          ).join(";");

          const pathFrames = Array.from(
            { length: numFrames + 1 },
            (_, frameIndex) => {
              const t = frameIndex / numFrames;
              const { y } = cubicBezier(t, [0.25, 1], [0.25, 1]);
              const interpolator = d3.interpolate(
                startPaths[index].getAttribute("d"),
                endPaths[index].getAttribute("d")
              );
              return interpolator(y);
            }
          );

          animateElement.setAttribute("dur", "4s");
          animateElement.setAttribute("values", pathFrames.join(";"));
          animateElement.setAttribute("keyTimes", keyTimes);

          newPath.appendChild(animateElement);
          animationSVG.appendChild(newPath);
        });
      }
    );
  });

// Cubic Bezier function for easing in easing out animation
function cubicBezier(t, p1, p2) {
  const cp1x = p1[0],
    cp1y = p1[1],
    cp2x = p2[0],
    cp2y = p2[1];
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;

  const x = mt3 * 0 + 3 * mt2 * t * cp1x + 3 * mt * t2 * cp2x + t3 * 1;
  const y = mt3 * 0 + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t3 * 1;
  return { x, y };
}
