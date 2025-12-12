"use strict";
(function(){
	let initialized = false;
	const safeInit = (opts) => {
		if (initialized) return;
		initialized = true;
		window.pageFooterTextExtensionInit(opts);
	};

	if (window.pageFooterTextOptions) {
		if (document.readyState === 'loading' || document.readyState === 'interactive') {
			document.addEventListener('DOMContentLoaded', () => safeInit(window.pageFooterTextOptions), { once: true });
		} else {
			safeInit(window.pageFooterTextOptions);
		}
	}
})();

window.pageFooterTextExtensionInit = (options) => {
	const cfg = Object.assign({
		html: '',
		className: 'dc-page-footer-text',
		style: 'box-shadow: 0px 4px 24px var(--pc-color-sfx-shadow),0px 2px 8px var(--pc-color-sfx-shadow); display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 20px; width: 100%; padding: 26px; border-radius: 8px;'
	}, options || {});

	const insertAfterBody = () => {
		const bodyEl = document.querySelector('.dc-doc-page__body');
		if (!bodyEl) {
			return false;
		}
		const container = document.createElement('div');
		if (cfg.className) {
			container.className = cfg.className;
		}
		if (cfg.style && typeof cfg.style === 'string') {
			container.style.cssText = cfg.style;
		}
		container.innerHTML = cfg.html;
		if (bodyEl.nextSibling) {
			bodyEl.parentNode.insertBefore(container, bodyEl.nextSibling);
		} else {
			bodyEl.parentNode.appendChild(container);
		}
		return true;
	};

	const apply = () => {
		if (!cfg.html || String(cfg.html).trim() === '') {
			return;
		}

		if (insertAfterBody()) {
			return;
		}

		const observer = new MutationObserver(() => {
			if (insertAfterBody()) {
				observer.disconnect();
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });
	};

	if (document.readyState === 'loading' || document.readyState === 'interactive') {
		document.addEventListener('DOMContentLoaded', apply, { once: true });
	} else {
		apply();
	}
};
