# tableau-pulse-embed-sample
Sample of how to embed Tableau Insights (Pulse) into a web app




## Demo Script

```
#   Create the project scaffolding
npx create-next-app@latest my-tableau-app --use-npm --example "https://github.com/vercel/next-learn/tree/main/basics/api-routes-starter"
#   Change into then app directory
cd my-tableau-app
#   Install Material Design UI, vega (for rendering charts), swr (client-side fetching)
npm install @mui/material @emotion/react @emotion/styled react-vega swr
#   Start dev server
npm run dev
```


## Resources/  Links

* [NextJS](https://nextjs.org/docs)
* [Component Docs](https://horizon-ui.com/documentation/docs/introduction?ref=readme-horizon-nextjs)
* [Template Repo](https://github.com/horizon-ui/horizon-ui-chakra-nextjs)
* [React Vega](https://github.com/vega/react-vega/tree/master/packages/react-vega)


## Known Issues
* something triggers the SWR fetch occationally, so multiple API calls are made when they are not necessary
* sometimes the results from the /api/insights call come back with partial results
