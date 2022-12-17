import {PrivacyService} from "./privacy-service";

export class PrivacyBanner extends HTMLElement
{
    protected services: PrivacyService[] = [];

    connectedCallback() {
        this.services = Array.from(document.querySelectorAll('privacy-service'));

        if (this.hasAttribute('do-not-track') === true) {
            this.optOutAll();

            return;
        }

        this.setVisibility();

        this.addEventListener('optIn', () => this.setVisibility());
        this.addEventListener('optOut', () => this.setVisibility());

        this.querySelector('button.optIn')!
            .addEventListener('click', () => {
                this.optInAll()
                    .then(() => this.setVisibility())
            })

        this.querySelector('button.optOut')!
            .addEventListener('click', () => {
                this.optOutAll()
                    .then(() => this.setVisibility())
            })
    }

    public setVisibility(): void {
        const choicesPending = this.services
                .find((service: PrivacyService): boolean => service.isPendingChoice() && service.omnipresent)
            !== undefined

        if (choicesPending === true) {
            this.show();
        } else {
            this.hide();
        }
    }

    protected show(): void {
        this.removeAttribute('hidden');
    }

    protected hide(): void {
        this.setAttribute('hidden', 'true');
    }

    public serviceIsEnabled(serviceKey: string): boolean {
        return this
            .getServiceByKey(serviceKey)
            .isEnabled()
    }

    public optIn(service: PrivacyService): Promise<void> {
        const promise = service.optIn()

        promise.then(() => {
            this.dispatchEvent(new CustomEvent('optIn', {detail: {service: service}}))
        })

        return promise;
    }

    public optInAll(): Promise<void[]> {
        const promises = this.services
            .map((service: PrivacyService): Promise<void> => this.optIn(service))

        return Promise.all(promises);
    }

    public optInByKey(serviceKey: string): Promise<void> {
        return this.optIn(this.getServiceByKey(serviceKey));
    }

    public optOut(service: PrivacyService): Promise<void> {
        const promise = service.optOut()

        promise.then(() => {
            this.dispatchEvent(new CustomEvent('optOut', {detail: {service: service}}))
        })

        return promise;
    }

    public optOutAll(): Promise<void[]> {
        const promises = this.services
            .map((service: PrivacyService): Promise<void> => this.optOut(service))

        return Promise.all(promises);
    }

    public optOutByKey(serviceKey: string): Promise<void> {
        return this.optOut(this.getServiceByKey(serviceKey));
    }

    public optOutOfAllServicesPendingChoice(): Promise<void[]> {
        const promises = this.services
            .filter((service: PrivacyService): boolean => service.isPendingChoice())
            .map((service: PrivacyService): Promise<void> => this.optOut(service))

        return Promise.all(promises);
    }

    protected getServiceByKey(key: string): PrivacyService {
        const service = this.services
            .find((service: PrivacyService): boolean => service.key === key);

        if (typeof service === 'undefined') {
            throw new Error(`Unknown service key ${key}`);
        }

        return service;
    }
}

customElements.define('privacy-banner', PrivacyBanner);
