# [DataDev Day Fall 2023](https://www.tableau.com/learn/webinars/datadev-day-2023-11-02): Embed insights into your web app, using Tableau Pulse APIs
This repository holds code used for a session on embedding Tableau Pulse insights into 3rd party web apps.  Tableau offers web components ```<tableau-pulse>``` for embedding metrics/insights into your web app, but this session shows how to use the REST API to fetch the *data* behind the metrics/insights and render it however you like within your web app.  Since this is a Tableau session the majority of our time is spent going over the REST API calls (server side) needed to fetch the data, and we skip over the web app (client side) creation.  We are providing this repository, so that people can see the full example and not just what we covered in our DataDev Day session.
![Pulse Embedded Example Screenshot](/screenshots/pulse-embedded.png)

## Deploy this project
If you'd like to just deploy this sample web app as-is, you can do so by following the below steps:

```
#   Clone the github repo
git clone https://github.com/takashibinns/tableau-pulse-embed-sample.git

#   Change into the web app directory
cd my-tableau-app

#   Install dependencies
npm install

#################################################
#   Edit /my-tableau-app/pages/api/insights.js  #
#   Replace the tableau variable with your      #
#   site's details & personal access token      #
#################################################

#   Start the web server on port 3000
npm run dev
```

## Demo Script
During the session, we created a scaffolding for our web app.  To get to the same starting point, run the below commands:

```
#   Create the project scaffolding
npx create-next-app@latest my-tableau-app --use-npm --example "https://github.com/vercel/next-learn/tree/main/basics/api-routes-starter"

#   Change into then app directory
cd my-tableau-app

#   Install Material Design UI, swr (client-side fetching), uuid (generating unique ids), and vega (for rendering vega charts)
npm install @mui/material @emotion/react @emotion/styled swr uuid vega vega-lite vega-tooltip vega-interpreter

#   Start dev server
npm run dev
```


## Resources/  Links

* [NextJS](https://nextjs.org/docs)
* [Template Repo](https://github.com/vercel/next-learn/tree/main/basics/api-routes-starter)
* [Material UI Docs](https://mui.com/material-ui/getting-started/usage/)
* [Vega Chart Specs](https://vega.github.io/vega/docs/specification/)


## Known Issues
* Using "use client" in pages or components results in multiple API calls being made, so I removed that flag resulting in server-side rendering