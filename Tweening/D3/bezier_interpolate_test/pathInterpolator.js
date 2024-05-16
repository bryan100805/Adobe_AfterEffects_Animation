document.addEventListener("DOMContentLoaded", function () {
  const path = document.getElementById("animatedPath");
  const animateElement = path.children[0];
  const svgNamespace = "http://www.w3.org/2000/svg";

  const path1 =
    "M473.51,523.54l88.15-10.79,17.7-38.74-1.18,37.53,105.76-27.81,13.77-32.92,4.92,32.93,120.95-5.23,7.86-49.39,3.93,49.39,132.75,4.84,9.5-55.2,8.67,55.2h124.42l10.82-55.2,5.42,51.09,118.81-6.13,9.14-25.91,10.81,26.48,94.06,29.32.83-23.43,25.61,24.31,85.6,18.7-10.03-41.94s-378.56-118.26-496.56-117.96c-107.26-3.74-461.59,111.06-491.7,120.18v40.67Z";
  const path2 =
    "M470.03,469.74l88.15-10.79,17.7-38.74-1.18,37.53,105.76-27.81,13.77-32.92,4.92,32.93,120.95-5.23,7.86-49.39,3.93,49.39,132.75-.54,9.5-49.82,8.67,49.79,124.42,1.43,10.82-51.22,5.42,51.09,118.81-6.13,9.14-25.91,10.81,26.48,94.06,29.32.83-23.43,25.61,24.31,85.6,18.7-10.03-41.94s-378.56-118.26-496.56-117.96c-107.26-3.74-461.59,111.06-491.7,120.18v40.67Z";
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
