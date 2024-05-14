document.addEventListener("DOMContentLoaded", function () {
  const path = document.getElementById("animatedPath");
  const animateElement = path.children[0];

  const path1 =
    "M271.38,539.02c18.83-3.61,304.45-136.48,672.5-136.48s647.12,134.29,709.9,135.24c-57.17,38.61-369.63,199.09-689.95,199.09-276.11,0-605.83-149.77-692.46-197.84Z";
  const path2 =
    "M293.16,539.68c15.9-8.39,304.71-158.04,672.77-158.04s614.64,137.87,674.46,156.92c-49.1,47.51-365.38,407.85-685.7,407.85-276.11,0-555.57-290.04-661.53-406.72Z";
  const numFrames = 10;
  // Generate interpolations
  var interpolator = d3.interpolate(path1, path2);

  // Calculate values for each keyframe
  let keyframes = Array.from({ length: numFrames + 1 }, (_, i) =>
    interpolator(i / numFrames)
  );

  // Log each interpolated path
  keyframes.forEach((frame, index) => {
    console.log(`Frame ${index}: ${frame}`);
  });

  animateElement.setAttribute("values", keyframes.join(";"));

  // Calculate keyTimes
  let keyTimes = Array.from({ length: numFrames + 1 }, (_, i) =>
    (i / numFrames).toFixed(2)
  ).join(";");
  animateElement.setAttribute("keyTimes", keyTimes);
});
