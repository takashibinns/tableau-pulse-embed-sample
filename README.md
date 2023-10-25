# DataDev Day Fall 2023: Embed insights into your web app, using Tableau Pulse APIs
This repository holds code used for a session on embedding Tableau Pulse insights into 3rd party web apps.  Tableau offers web components ```<tableau-pulse>``` for embedding metrics/insights into your web app, but this session shows how to use the REST API to fetch the *data* behind the metrics/insights and render it however you like within your web app.  Since this is a Tableau session the majority of our time is spent going over the REST API calls (server side) needed to fetch the data, and we skip over the web app (client side) creation.  We are providing this repository, so that people can see the full example and not just what we covered in our DataDev Day session.
![Pulse Embedded Example Screenshot](/screenshots/pulse-embedded.png)

## Demo Script

```
#   Create the project scaffolding
npx create-next-app@latest my-tableau-app --use-npm --example "https://github.com/vercel/next-learn/tree/main/basics/api-routes-starter"

#   Change into then app directory
cd my-tableau-app

#   Install Material Design UI, swr (client-side fetching), uuid (generating unique ids)
npm install @mui/material @emotion/react @emotion/styled swr uuid vega vega-lite vega-tooltip vega-interpreter

#   Start dev server
npm run dev
```


## Resources/  Links

* [NextJS](https://nextjs.org/docs)
* [Component Docs](https://horizon-ui.com/documentation/docs/introduction?ref=readme-horizon-nextjs)
* [Template Repo](https://github.com/horizon-ui/horizon-ui-chakra-nextjs)
* [React Vega](https://github.com/vega/react-vega/tree/master/packages/react-vega)


## Known Issues
* Using "use client" in pages or components results in multiple API calls being made, so i removed that flag resulting in server-side rendering