"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Extension = void 0;
const { ok } = require('node:assert');
const { join } = require('node:path');
const { getHooks } = require('@diplodoc/cli/lib/program');
const { getBuildHooks, getEntryHooks } = require('@diplodoc/cli');

/**
 * Diplodoc extension: page-footer-text
 * Injects a text/html block right after the element with class `dc-doc-page__body`.
 */
class Extension {
	apply(program) {

		getHooks(program).Config.tap('PageFooterText', (config) => {
			const value = config.pageFooterText;
			if (!value || typeof value === 'boolean') {
				return config;
			}
			if (typeof value === 'string') {
				ok(value.trim() !== '', 'pageFooterText must be a non-empty string');
				return config;
			}
			ok(typeof value === 'object', 'pageFooterText must be string or object');
			ok((value.html ?? '').trim() !== '', 'pageFooterText.html must be non-empty');
			return config;
		});


		getBuildHooks(program).BeforeRun.for('html').tap('PageFooterText', (run) => {
			if (!program.config.pageFooterText) {
				return;
			}
			getEntryHooks(run.entry).Page.tap('PageFooterText', (template) => {
				const extConfig = program.config.pageFooterText === true ? {} : program.config.pageFooterText;
				template.addScript('_extensions/page-footer-text-extension.js', {
					position: 'leading',
					attrs: { defer: void 0 }
				});
				const initPayload = typeof extConfig === 'string' ? { html: extConfig } : (extConfig || {});
				template.addScript(
					`window.pageFooterTextOptions = ${JSON.stringify(initPayload)};\nwindow.pageFooterTextExtensionInit && window.pageFooterTextExtensionInit(window.pageFooterTextOptions);`,
					{
						position: 'state',
						inline: true,
					}
				);
			});
		});

		getBuildHooks(program).AfterRun.for('html').tapPromise('PageFooterText', async (run) => {
			if (!program.config.pageFooterText) {
				return;
			}
			const extensionFilePath = join(__dirname, 'resources', 'page-footer-text-extension.js');
			try {
				await run.copy(extensionFilePath, join(run.output, '_extensions', 'page-footer-text-extension.js'));
			} catch (error) {
				run.logger.warn(`Unable to copy the page-footer-text extension script ${extensionFilePath}.`, error);
			}
		});
	}
}
exports.Extension = Extension;
