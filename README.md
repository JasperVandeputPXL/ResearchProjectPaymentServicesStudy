# ResearchProjectPaymentServicesStudy
This repository includes Proof of Concept applications to research and evaluate different payment systems with an online implementation.
Implementations were made for Mollie and Stripe. Both use test-api keys inside an express-js backend with a simple html frontend.

The easiest way to run these proof of concepts is through the docker-composefiles.

To run both versions, open a terminal in this directory. To run one of the two only, open the terminal in its respective directory.

If docker-engine is installed and running on your device, and a terminal is opened in one of the directories mentioned above, enter this command:
```bash
docker compose up -d
```
This will start three containers. The frontend for Mollie is served from an nginx container on http://localhost:80, it communicates with the Mollie backend on http://localhost:4001. Stripe's poc is available on http://localhost:3000. The ports 80, 3000 and 4001 must be available.

It is also possible to run these services locally with the instructions mentioned below, however for the research paper comparison, the Docker implementations will be used.
## Payment Service Providers:
### - [Mollie](https://www.mollie.com/)

#### How to run the POC:

- open the `mollie` directory in a browser (e. g. with http-server)

```
cd mollie_backend
```
```
npm install
```
```
node .
```
### - [Stripe](https://stripe.com/)

#### How to run the POC:

- open the `stripe/server` directory in a browser
```
cd .\stripe\server\
```
- run the command to start the server
```
npm run devStart
```
- surf to: http://localhost:3000/
