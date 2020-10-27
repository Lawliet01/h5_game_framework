export function runAnimation(frameFunc) {
	let lastTime = null;
	function frame(time) {
		if (lastTime != null) {
			let timeStep = Math.min(time - lastTime, 100) / 1000;
			if (frameFunc(timeStep) === false) return;
		}
		lastTime = time;
		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}
