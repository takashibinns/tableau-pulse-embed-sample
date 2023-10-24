# tableau-pulse-embed-sample
Sample of how to embed Tableau Insights (Pulse) into a web app




## Demo Script
```
#   Create the project scaffolding (and specify my-tableau-app for the project name)
npx create-next-app --js --app --use-npm --example https://github.com/horizon-ui/horizon-ui-chakra-nextjs

#   Build/start the web app
cd my-tableau-app
npm run dev
```


```
#   Create the project scaffolding
npx create-next-app@latest my-tableau-app --use-npm --example "https://github.com/vercel/next-learn/tree/main/basics/api-routes-starter"
#npx create-next-app --js --app --use-npm
#   Change into then app directory
cd my-tableau-app
#   Install Material Design UI and vega (for rendering charts)
npm install @mui/material @emotion/react @emotion/styled react-vega
#   Start dev server
npm run dev
```


## Resources/  Links

* [NextJS](https://nextjs.org/docs)
* [Component Docs](https://horizon-ui.com/documentation/docs/introduction?ref=readme-horizon-nextjs)
* [Template Repo](https://github.com/horizon-ui/horizon-ui-chakra-nextjs)