import {PrivacyBanner} from "./privacy-banner";

export class PrivacyOverlay extends HTMLElement
{
    protected serviceKey: string;
    protected privacyBannerEl: PrivacyBanner;
    protected messageEl: HTMLElement;

    connectedCallback() {
        this.serviceKey = this.getAttribute('servicekey')!;
        this.privacyBannerEl = document.querySelector<PrivacyBanner>(`privacy-banner`)!
        this.messageEl = this.querySelector(`privacy-overlay-message`)!

        this.addEventListener('click', e => e.stopPropagation());

        this.setVisibility();
        this.privacyBannerEl.addEventListener('optIn', () => this.setVisibility());
        this.privacyBannerEl.addEventListener('optOut', () => this.setVisibility());

        this.messageEl
            .querySelector('button')!
            .addEventListener('click', (e) => {
                this.privacyBannerEl.optInByKey(this.serviceKey);
            });
    }

    public setVisibility(): void {
        if (this.privacyBannerEl.serviceIsEnabled(this.serviceKey) === true) {
            this.hide();

            return;
        }

        if (this.privacyBannerEl.serviceIsEnabled(this.serviceKey) === false) {
            this.show();

            return;
        }
    }

    protected show(): void {
        this.removeAttribute('hidden');

        this.querySelectorAll(':scope > privacy-aware-content')
            .forEach((element) => element.setAttribute('inert', ''));
    }

    protected hide(): void {
        this.setAttribute('hidden', 'true');

        this.querySelectorAll(':scope > privacy-aware-content')
            .forEach((element) => element.removeAttribute('inert'));
    }
}

customElements.define('privacy-overlay', PrivacyOverlay);
