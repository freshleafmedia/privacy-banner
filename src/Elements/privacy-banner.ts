import {PrivateDataProcessor} from "./private-data-processor";

export class PrivacyBanner extends HTMLElement
{
    protected dataProcessors: PrivateDataProcessor[] = [];

    connectedCallback() {
        this.dataProcessors = Array.from(document.querySelectorAll('private-data-processor'));

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
        const choicesPending = this.dataProcessors
                .find((dataProcessor: PrivateDataProcessor): boolean => dataProcessor.isPendingChoice() && dataProcessor.omnipresent)
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

    public dataProcessorIsEnabled(processerKey: string): boolean {
        return this
            .getServiceByKey(processerKey)
            .isEnabled()
    }

    public optIn(processerKey: PrivateDataProcessor): Promise<void> {
        const promise = processerKey.optIn()

        promise.then(() => {
            this.dispatchEvent(new CustomEvent('optIn', {detail: {dataProcessor: processerKey}}))
        })

        return promise;
    }

    public optInAll(): Promise<void[]> {
        const promises = this.dataProcessors
            .map((dataProcessor: PrivateDataProcessor): Promise<void> => this.optIn(dataProcessor))

        return Promise.all(promises);
    }

    public optInByKey(dataProcessorKey: string): Promise<void> {
        return this.optIn(this.getServiceByKey(dataProcessorKey));
    }

    public optOut(dataProcessor: PrivateDataProcessor): Promise<void> {
        const promise = dataProcessor.optOut()

        promise.then(() => {
            this.dispatchEvent(new CustomEvent('optOut', {detail: {dataProcessor: dataProcessor}}))
        })

        return promise;
    }

    public optOutAll(): Promise<void[]> {
        const promises = this.dataProcessors
            .map((dataProcessor: PrivateDataProcessor): Promise<void> => this.optOut(dataProcessor))

        return Promise.all(promises);
    }

    public optOutByKey(dataProcessorKey: string): Promise<void> {
        return this.optOut(this.getServiceByKey(dataProcessorKey));
    }

    public optOutOfAllServicesPendingChoice(): Promise<void[]> {
        const promises = this.dataProcessors
            .filter((dataProcessor: PrivateDataProcessor): boolean => dataProcessor.isPendingChoice())
            .map((dataProcessor: PrivateDataProcessor): Promise<void> => this.optOut(dataProcessor))

        return Promise.all(promises);
    }

    protected getServiceByKey(key: string): PrivateDataProcessor {
        const dataProcessor = this.dataProcessors
            .find((dataProcessor: PrivateDataProcessor): boolean => dataProcessor.key === key);

        if (typeof dataProcessor === 'undefined') {
            throw new Error(`Unknown data processor key ${key}`);
        }

        return dataProcessor;
    }
}

customElements.define('privacy-banner', PrivacyBanner);
