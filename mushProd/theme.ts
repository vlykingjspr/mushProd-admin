
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
	name: 'my-custom-theme',
	properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-color-base": "var(--color-tertiary-900)",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "12px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "2px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "var(--color-tertiary-900)",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "255 255 255",
		"--on-success": "0 0 0",
		"--on-warning": "var(--color-tertiary-900)",
		"--on-error": "var(--color-tertiary-900)",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #38B6FF 
		"--color-primary-50": "225 244 255", // #e1f4ff
		"--color-primary-100": "215 240 255", // #d7f0ff
		"--color-primary-200": "205 237 255", // #cdedff
		"--color-primary-300": "175 226 255", // #afe2ff
		"--color-primary-400": "116 204 255", // #74ccff
		"--color-primary-500": "56 182 255", // #38B6FF
		"--color-primary-600": "50 164 230", // #32a4e6
		"--color-primary-700": "42 137 191", // #2a89bf
		"--color-primary-800": "34 109 153", // #226d99
		"--color-primary-900": "27 89 125", // #1b597d
		// secondary | #387EFF 
		"--color-secondary-50": "225 236 255", // #e1ecff
		"--color-secondary-100": "215 229 255", // #d7e5ff
		"--color-secondary-200": "205 223 255", // #cddfff
		"--color-secondary-300": "175 203 255", // #afcbff
		"--color-secondary-400": "116 165 255", // #74a5ff
		"--color-secondary-500": "56 126 255", // #387EFF
		"--color-secondary-600": "50 113 230", // #3271e6
		"--color-secondary-700": "42 95 191", // #2a5fbf
		"--color-secondary-800": "34 76 153", // #224c99
		"--color-secondary-900": "27 62 125", // #1b3e7d
		// tertiary | #001E45 
		"--color-tertiary-50": "217 221 227", // #d9dde3
		"--color-tertiary-100": "204 210 218", // #ccd2da
		"--color-tertiary-200": "191 199 209", // #bfc7d1
		"--color-tertiary-300": "153 165 181", // #99a5b5
		"--color-tertiary-400": "77 98 125", // #4d627d
		"--color-tertiary-500": "0 30 69", // #001E45
		"--color-tertiary-600": "0 27 62", // #001b3e
		"--color-tertiary-700": "0 23 52", // #001734
		"--color-tertiary-800": "0 18 41", // #001229
		"--color-tertiary-900": "0 15 34", // #000f22
		// success | #38FF7C 
		"--color-success-50": "225 255 235", // #e1ffeb
		"--color-success-100": "215 255 229", // #d7ffe5
		"--color-success-200": "205 255 222", // #cdffde
		"--color-success-300": "175 255 203", // #afffcb
		"--color-success-400": "116 255 163", // #74ffa3
		"--color-success-500": "56 255 124", // #38FF7C
		"--color-success-600": "50 230 112", // #32e670
		"--color-success-700": "42 191 93", // #2abf5d
		"--color-success-800": "34 153 74", // #22994a
		"--color-success-900": "27 125 61", // #1b7d3d
		// warning | #FFFB38 
		"--color-warning-50": "255 254 225", // #fffee1
		"--color-warning-100": "255 254 215", // #fffed7
		"--color-warning-200": "255 254 205", // #fffecd
		"--color-warning-300": "255 253 175", // #fffdaf
		"--color-warning-400": "255 252 116", // #fffc74
		"--color-warning-500": "255 251 56", // #FFFB38
		"--color-warning-600": "230 226 50", // #e6e232
		"--color-warning-700": "191 188 42", // #bfbc2a
		"--color-warning-800": "153 151 34", // #999722
		"--color-warning-900": "125 123 27", // #7d7b1b
		// error | #FF383F 
		"--color-error-50": "255 225 226", // #ffe1e2
		"--color-error-100": "255 215 217", // #ffd7d9
		"--color-error-200": "255 205 207", // #ffcdcf
		"--color-error-300": "255 175 178", // #ffafb2
		"--color-error-400": "255 116 121", // #ff7479
		"--color-error-500": "255 56 63", // #FF383F
		"--color-error-600": "230 50 57", // #e63239
		"--color-error-700": "191 42 47", // #bf2a2f
		"--color-error-800": "153 34 38", // #992226
		"--color-error-900": "125 27 31", // #7d1b1f
		// surface | #09537E 
		"--color-surface-50": "218 229 236", // #dae5ec
		"--color-surface-100": "206 221 229", // #cedde5
		"--color-surface-200": "194 212 223", // #c2d4df
		"--color-surface-300": "157 186 203", // #9dbacb
		"--color-surface-400": "83 135 165", // #5387a5
		"--color-surface-500": "9 83 126", // #09537E
		"--color-surface-600": "8 75 113", // #084b71
		"--color-surface-700": "7 62 95", // #073e5f
		"--color-surface-800": "5 50 76", // #05324c
		"--color-surface-900": "4 41 62", // #04293e

	}
}