# Himanshu’s developer portfolio

React, TypeScript, and Vite portfolio with a Formik + Zod contact form. Contact inquiries are sent from the browser through the official EmailJS SDK.

## Configure EmailJS

1. Create an EmailJS account and connect an email service. Verify the sender address required by your provider.
2. Create an EmailJS template. Set **To Email** to your own inbox as a fixed dashboard value; do not use a form variable for the recipient. Set **Reply-To** to `{{reply_to}}` so replies go to the visitor.
3. Use these template variables in the subject/body:
   - `{{from_name}}`
   - `{{reply_to}}`
   - `{{estimated_budget}}`
   - `{{project_type}}`
   - `{{project_details}}`
4. In EmailJS, restrict allowed origins to the portfolio's production domain and the local development origin you use. Keep EmailJS's account/template rate limits enabled. The form also has a honeypot and an in-flight duplicate-request guard; the SDK blocks headless browsers.
5. Copy `.env.example` to `.env.local` and fill in the service ID, template ID, and **public key** from the EmailJS dashboard:

   ```dotenv
   VITE_EMAILJS_SERVICE_ID=service_...
   VITE_EMAILJS_TEMPLATE_ID=template_...
   VITE_EMAILJS_PUBLIC_KEY=...
   ```

   Vite exposes `VITE_` values in the browser bundle. Use only the EmailJS public key here—never put an EmailJS private key or email-provider credentials in this file. `.env.local` is ignored by Git. Restart Vite after changing it.

6. Run `npm run dev`, submit a valid inquiry, and confirm receipt in the fixed inbox configured in the template. EmailJS's dashboard history can help diagnose rejected requests.

Without all three variables, the app displays a configuration error instead of claiming an inquiry was sent.

### Optional CAPTCHA

For a public, high-traffic deployment, configure EmailJS reCAPTCHA v2 on the template and add its client-side widget/token handling to the form. EmailJS requires both the solved token and dashboard-side CAPTCHA configuration; enabling only one side will reject sends.

## Development and checks

```sh
npm install
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

The tests mock EmailJS and never send real messages.
