export default function enableGesture(e) {
	let context = {};

	e.addEventListener("touchstart", (event) => {
		event.stopPropagation();

		window.addEventListener("touchmove", move);
		window.addEventListener("touchend", end);

		context = {};

		if (event.changedTouches.length > 1) return;

		Object.assign(context, {
			startX: event.changedTouches[0].clientX,
			startY: event.changedTouches[0].clientY,
			isTap: true,
			timeoutHandler: setTimeout(() => {
				if (context.isTap && !context.isPan) {
					context.isTap = false;
					context.isPress = true;
					newEventDispatch("pressstart", {
						startX: event.changedTouches[0].clientX,
						startY: event.changedTouches[0].clientY,
					});
				}
			}, 500),
		});
	});

	const move = throttle((event) => {
		if (event.changedTouches.length > 1) {
			console.log("resize");
			return;
		}

		const { clientX, clientY } = event.changedTouches[0];

		if ((clientX - context.startX) ** 2 + (clientY - context.startY) ** 2 > 100) {
			if (context.isPan) {
				newEventDispatch("pan", {
					startX: context.startX,
					startY: context.startY,
					clientX,
					clientY,
				});
			} else {
				context.isPan = true;
				newEventDispatch("panstart", {
					clientX: context.startX,
					clientY: context.startY,
				});
			}
		}
	}, 16);

	const end = (event) => {
		if (context.isResize) console.log("resizeend");

		const { clientX, clientY } = event.changedTouches[0];

		if (context.isTap)
			newEventDispatch("tap", {
				startX: context.startX,
				startY: context.startY,
			});
		if (context.isPan)
			newEventDispatch("panend", {
				startX: context.startX,
				startY: context.startY,
				clientX,
				clientY,
			});
		if (context.isPress) newEventDispatch("pressend");

		clearTimeout(context.timeoutHandler);
		window.removeEventListener("touchmove", move);
		window.removeEventListener("touchend", end);
	};

	function newEventDispatch(name, config) {
		const event = document.createEvent("CustomEvent");
		event.initCustomEvent(name, false, false, config);
		e.dispatchEvent(event);
	}
}

function throttle(func, duration) {
	let enable = true;
	return function (...args) {
		if (enable) {
			enable = false;
			func.apply(this, args);
			setTimeout(() => {
				enable = true;
			}, duration);
		}
	};
}
