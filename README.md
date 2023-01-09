# Privacy Control

A website privacy manager which focuses on good UX, sane defaults and forgets about cookies.


## Overview

This isn't just another generic cookie banner. The aims of this library are:

- Interrupt the user as little as possible.
- Ask for consent only when it is immediately required.
- Provide simple and accessible UI.
- Focus on the third parties data is sent to rather than cookies


## Installation

```
yarn add freshleafmedia/privacy-banner
```

Once bundled add the script to the end of the `<body>` element.


## Usage

There are 4 parts:

1. Declare Data Processors
2. Banner
3. Data Processor Scripts
4. Opt-in Content


### Declare Data Processors

Each of the ways your site processes private data is defined as a `<private-data-processor>` element.

```html
<private-data-processor
    key="google-recaptcha"
    name="Google reCAPTCHA"
    description="Used to prevent SPAM form submissions"
/>
```

```html
<private-data-processor
    key="google-analytics"
    name="Google Analytics"
    description="Used to asses how the website is used by visitors"
    omnipresent
/>
```

- **key** - This is the value the data processor is referenced by
- **name** - The full name of the data processor
- **description** - What is the data processor being used for, why is it there
- **omnipresent** - Whether the data processor is required on all pages. This is for things like analytics scripts



### Banner

![consent banner example](assets/banner.png)

The banner should be added to the end of every page. If you have no 'omnipresent' private-data-processors your users will never see this :tada:

```html
<privacy-banner hidden>
    <privacy-banner-message>
        This website uses cookies and third-party services which may process your personal information.
        For more information, see our <a href="/privacy">privacy policy</a>.
    </privacy-banner-message>
    <privacy-banner-actions>
        <button class="optIn">Allow all</button>
        <button class="optOut">Reject non-essential</button>
    </privacy-banner-actions>
</privacy-banner>
```


### Data Processor Scripts

When you have scripts which will process private data they need to be replaced with `<privacy-aware-script>`.
Once consent for that processor has been obtained the script will load like normal.

```html
<privacy-aware-script data-processor-key="google-recaptcha" src="path/to/your/script.js" async />
```

- **data-processor-key** - This is the key of the related processor
- All other properties are passed directly to the `<script>` when it is injected. Eg `async` `defer` etc


### Opt-in content

When there is content which relies on a third party to function at all (eg YouTube embed) it should be wrapped in a `privacy-overlay`:

```html
<privacy-overlay data-processor-key="google-recaptcha">
    <privacy-overlay-message>
        <p>This form uses Google reCAPTCHA for spam prevention. Your permission is required to activate it as information may be shared with Google.</p>
        
        <p>For more information, please see Google's
            <a href="https://policies.google.com/privacy">privacy policy</a> and
            <a href="https://policies.google.com/terms">terms of service</a>.
        </p>
        
        <p>
            <button type="button">Allow reCAPTCHA and continue</button>
        </p>
    </privacy-overlay-message>
    
    <privacy-aware-content>
        Your content here...
    </privacy-aware-content>
</privacy-overlay>
```

- **data-processor-key** - This is the key of the related data processor

![Contact form with a privacy overlay asking the user for consent](assets/overlay.png)


## Examples

### Form with reCATPCHA

```html
<privacy-overlay data-processor-key="google-recaptcha">
    <privacy-overlay-message>
        <p>This form uses Google reCAPTCHA for spam prevention. Your permission is required to activate it as information may be shared with Google.</p>

        <p>For more information, please see Google's
            <a href="https://policies.google.com/privacy">privacy policy</a> and
            <a href="https://policies.google.com/terms">terms of service</a>.
        </p>

        <p>
            <button type="button">Allow reCAPTCHA and continue</button>
        </p>
    </privacy-overlay-message>

    <privacy-aware-content>
        <form>
            ...
        </form>
    </privacy-aware-content>
</privacy-overlay>

<privacy-banner hidden>
    <privacy-banner-message>
        <p>
            This website uses cookies and third-party services which may process your personal information.
            For more information, see our <a href="/privacy">privacy policy</a>.
        </p>
    </div>
    <privacy-banner-actions>
        <button class="optIn">Allow all</button>
        <button class="optOut">Reject non-essential</button>
    </div>
</privacy-banner>

<private-data-processor
    key="google-recaptcha"
    name="Google reCAPTCHA"
    description="Used to prevent SPAM form submissions"
/>

<privacy-aware-script data-processor-key="google-recaptcha" src="path/to/recaptcha.js" />
```

### Google Analytics

```html
<privacy-banner hidden>
    <privacy-banner-message>
        <p>
            This website uses cookies and third-party services which may process your personal information.
            For more information, see our <a href="/privacy">privacy policy</a>.
        </p>
    </privacy-banner-message>
    <privacy-banner-actions>
        <button class="optIn">Allow all</button>
        <button class="optOut">Reject non-essential</button>
    </privacy-banner-actions>
</privacy-banner>


<private-data-processor
    key="google-analytics"
    name="Google Analytics"
    description="Used to asses how the website is used by visitors"
    omnipresent
/>

<script>
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-XXXXXXX-X']);
    _gaq.push(['_trackPageview']);
</script>

<privacy-aware-script data-processor-key="google-analytics" src="https://ssl.google-analytics.com/ga.js" />
```


## Styles

You may edit the text content and style all the elements however you wish.
The [included styles](src/styles.scss), are intentionally left plain and designed to be a good starting point.


## How it works

The `<privacy-banner>` element acts as the 'source of truth' of which data processors there are and if they are enabled.

Whenever a data processor is enabled, either via the banner or an overlay, events are fired. These events are listened
for by all elements which can be affected. They then adjust their state accordingly.


## License

See [LICENSE](LICENSE)
