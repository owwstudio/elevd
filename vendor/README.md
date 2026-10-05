# Elevd motion dependencies

These packages are served from Shopify theme assets rather than a third-party script CDN. No build step or runtime package manager is required.

| Package | Version | Files | Source |
| --- | --- | --- | --- |
| GSAP | 3.15.0 | `assets/gsap-3.15.0.min.js` | https://registry.npmjs.org/gsap/-/gsap-3.15.0.tgz |
| GSAP ScrollTrigger | 3.15.0 | `assets/ScrollTrigger-3.15.0.min.js` | Same GSAP package |
| Lenis | 1.3.26 | `assets/lenis-1.3.26.min.js`, `assets/lenis-1.3.26.css` | https://registry.npmjs.org/lenis/-/lenis-1.3.26.tgz |

Both package archives were checked against the registry’s SHA-512 integrity values before extraction. Files retain upstream content and copyright/license headers. Lenis’s license is copied to `Lenis-LICENSE.txt`. The GSAP distribution links its license terms at https://gsap.com/standard-license.

Integration references:

- [Lenis + GSAP ScrollTrigger](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger)
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)
