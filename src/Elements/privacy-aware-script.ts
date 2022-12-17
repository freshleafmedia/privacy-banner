import {PrivacyBanner} from "./privacy-banner";

export class PrivacyAwareScript extends HTMLElement
{
    protected enabled = false;
    protected serviceKey: string;
    protected privacyBannerEl: PrivacyBanner;

    connectedCallback() {
        this.serviceKey = this.getAttribute('servicekey')!;
        this.privacyBannerEl = document.querySelector<PrivacyBanner>(`privacy-banner`)!

        if (this.privacyBannerEl.serviceIsEnabled(this.serviceKey)) {
            this.enable();
        }
    }

    public enable(): void {
        if (this.enabled === true) {
            return;
        }

        const scriptEl = document.createElement('script');

        scriptEl.innerText = this.innerText;

        this.getAttributeNames()
            .forEach((attributeName): void => {
                scriptEl.setAttribute(attributeName, this.getAttribute(attributeName)!);
            })

        this.appendChild(scriptEl);

        this.enabled = true;
    }

    public disable(): void {
        const scriptEl = this.querySelector('script');

        if (scriptEl === null) {
            return;
        }

        scriptEl.remove();

        this.enabled = false;
    }

}

customElements.define('privacy-aware-script', PrivacyAwareScript);
