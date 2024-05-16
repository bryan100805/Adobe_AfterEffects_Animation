function downloadFrames(pathFrames, numFrames, startPaths) {
    for (let frameIndex = 0; frameIndex <= numFrames; frameIndex++) {
        const frameSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        frameSvg.setAttribute("viewBox", "0 0 1920 1080");
        frameSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        startPaths.forEach((path, index) => {
            const newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            newPath.setAttribute("d", pathFrames[index][frameIndex]);
            newPath.setAttribute("fill", path.getAttribute("fill")); // Use the same fill color as the original path
            frameSvg.appendChild(newPath);
        });

        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(frameSvg)], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `frame_${frameIndex+1}.svg`;
        link.textContent = `Download Frame ${frameIndex+1}`;
        link.style.display = "block";
        document.body.appendChild(link);
    }
}
