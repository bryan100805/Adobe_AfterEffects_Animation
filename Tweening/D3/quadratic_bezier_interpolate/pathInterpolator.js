document.addEventListener("DOMContentLoaded", function () {
  const path = document.getElementById("animatedPath");
  const animateElement = path.children[0];
  const svgNamespace = "http://www.w3.org/2000/svg";

  const path1 =
    "M271.38,539.02c18.83-3.61,304.45-136.48,672.5-136.48s647.12,134.29,709.9,135.24c-57.17,38.61-369.63,199.09-689.95,199.09-276.11,0-605.83-149.77-692.46-197.84Z";
  const path2 =
    "M293.16,539.68c15.9-8.39,304.71-158.04,672.77-158.04s614.64,137.87,674.46,156.92c-49.1,47.51-365.38,407.85-685.7,407.85-276.11,0-555.57-290.04-661.53-406.72Z";
  const numFrames = 10;

  // Cubic Bezier function for easing
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

    const x = mt3 * 0 + 3 * mt2 * t * cp1x + 3 * mt * t2 * cp2x + t3 * 1; // Normalized to range from 0 to 1
    const y = mt3 * 0 + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t3 * 1; // Normalized to range from 0 to 1
    return { x, y };
  }

  // Generate interpolations using Bezier easing
  let keyframes = Array.from({ length: numFrames + 1 }, (_, i) => {
    let t = i / numFrames;
    let { y } = cubicBezier(t, [0.25, 1], [0.25, 1]); // Using y for interpolation as it represents the animation's progression
    return d3.interpolate(path1, path2)(y);
  });

  animateElement.setAttribute("values", keyframes.join(";"));

  // Calculate keyTimes
  let keyTimes = Array.from({ length: numFrames + 1 }, (_, i) =>
    (i / numFrames).toFixed(2)
  ).join(";");
  animateElement.setAttribute("keyTimes", keyTimes);

  keyframes.forEach((frameData, index) => {
    console.log(`Frame ${index}:`, frameData)

    // Create a new SVG element for each frame
    const newSvg = document.createElementNS(svgNamespace, "svg");
    newSvg.setAttribute("viewBox", "0 0 1920 1080");
    newSvg.setAttribute("xmlns", svgNamespace);

    const newPath = document.createElementNS(svgNamespace, "path");
    newPath.setAttribute("d", frameData);
    newPath.setAttribute("fill", "#801817");
    newPath.setAttribute("stroke", "none");

    newSvg.appendChild(newPath);

    // Serialize SVG to XML string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(newSvg);

    // Convert string to Blob
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `frame_${index}.svg`;
    link.textContent = `Download Frame ${index}`;
    link.style.display = "block"; // Make each link a new line

    document.body.appendChild(link)
  });
});
