import {getCookie, setCookie} from "typescript-cookie";
import {cookieOptions, cookiePrefix} from "../config";
import {PrivacyAwareScript} from "./privacy-aware-script";

export class PrivacyService extends HTMLElement
{
    public key: string;
    public name: string;
    public description: string;
    public omnipresent: boolean;
    protected cookieName: string;

    connectedCallback() {
        this.key = this.getAttribute('key');
        this.name = this.getAttribute('name');
        this.description = this.getAttribute('description');
        this.omnipresent = this.hasAttribute('omnipresent');
        this.cookieName = `${cookiePrefix}-${this.getAttribute('key')}`
    }

    public optIn(): Promise<void> {
        return new Promise<void>(
            (resolve) => {
                setCookie(this.cookieName, 'true', cookieOptions);
                this.enable();

                resolve();
            }
        )
    }

    public optOut(): Promise<void> {
        return new Promise<void>(
            (resolve) => {
                setCookie(this.cookieName, 'false', cookieOptions);
                this.disable();

                resolve();
            }
        )
    }

    public isPendingChoice(): boolean {
        return typeof getCookie(this.cookieName) === 'undefined';
    }

    public enable(): void {
        document.querySelectorAll<PrivacyAwareScript>(`privacy-aware-script[servicekey = "${this.key}"]`)
            .forEach((privacyAwareScriptEl): void => privacyAwareScriptEl.enable());
    }

    public disable(): void {
        document.querySelectorAll<PrivacyAwareScript>(`privacy-aware-script[servicekey = "${this.key}"]`)
            .forEach((privacyAwareScriptEl): void => privacyAwareScriptEl.disable());
    }

    public isEnabled(): boolean {
        return this.isDisabled() === false;
    }

    public isDisabled(): boolean {
        return this.isPendingChoice() || getCookie(this.cookieName) !== 'true';
    }
}

customElements.define('privacy-service', PrivacyService);
