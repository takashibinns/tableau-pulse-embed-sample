'use client';

import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import CardGrid from '../components/cardgrid';
import Chart from '../components/test';

import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';
import { useCallback, useEffect, useState } from "react"; 
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { VegaLite } from 'react-vega'

const fetchApiData = async (...args) => {

  //  Fetch the metric data via API
  const response = await fetch("/api/insights");

  //  Convert the response to JSON
  const data = await response.json();

  let metrics = [];
  data.forEach( function(metric, index){    

    //  Define the top layer of the card
    let card = {
      title: metric.title,
      subtitle: '',
      key: `tableau-card-${index}`,
      main: [],
      extra: []
    }

    //  Split out the insight groups
    const ban = metric.result.insight_groups.filter((ig) => { return ig.type === 'ban' })[0];
    const top = metric.result.insight_groups.filter((ig) => { return ig.type === 'top' })[0];

    //  Define 1 or more insights for the main section of the card
    for (let i = 0; i<ban.insights.length; i++) {
      const insight = ban.insights.length>0 ? ban.insights[0].result : {};
      const summary = ban.summaries.length>0 ? ban.summaries[0].result : {};

      //  Provide some general info for the card header
      card.subtitle = insight.facts?.target_time_period?.label;

      //  Define the metric's name and markup (from api)
      let myMetric = {
        key: insight.id,
        markup: insight.markup,
        vega: null
      };

      //  If the metric also has an image, include that oo
      if (summary.viz && Object.keys(summary.viz).length > 0){
        myMetric.vega = summary.viz;
      }

      // Save to an array
      card.main.push(myMetric)
    }

    //  Define 1 or more insights that should be hidden by default within the card
    for (let i = 0; i<top.insights.length; i++) {
      const insight = top.insights.length>0 ? top.insights[0].result : {};
      const summary = top.summaries.length>0 ? top.summaries[0].result : {};

      if (insight) {
        //  Provide some general info for the card header
        card.subtitle = insight.facts?.target_time_period?.label;

        //  Define the metric's name and markup (from api)
        let myMetric = {
          key: insight.id,
          markup: insight.markup,
          vega: null
        };

        //  If the metric also has an image, include that oo
        if (summary.viz && Object.keys(summary.viz).length > 0){
          myMetric.vega = summary.viz;
        }
        
        // Save to an array
        card.extra.push(myMetric)
      }
    }
    
    //  Save a reference to this card
    metrics.push(card);
  })
  
  //  Set the new
  return metrics;
};

export default function Home({ allPostsData }) {

  
  //const [isLoading, setIsLoading] = useState(true);
  //const { metrics } = useSWR('/api/insights', fetchApiData);

  /*
    const [metrics, setMetrics] = useState([]);           // Populated from REST API
    const fetchMetrics = async () => {
      //  Fetch the metric data via API
      const response = await fetch("/api/insights");
      //  Convert the response to JSON
      const data = await response.json();

      let metrics = [];
      data.forEach( function(metric, index){    

        //  Define the top layer of the card
        let card = {
          title: metric.title,
          subtitle: '',
          key: `tableau-card-${index}`,
          main: [],
          extra: []
        }

        //  Split out the insight groups
        const ban = metric.result.insight_groups.filter((ig) => { return ig.type === 'ban' })[0];
        const top = metric.result.insight_groups.filter((ig) => { return ig.type === 'top' })[0];

        //  Define 1 or more insights for the main section of the card
        for (let i = 0; i<ban.insights.length; i++) {
          const insight = ban.insights.length>0 ? ban.insights[0].result : {};
          const summary = ban.summaries.length>0 ? ban.summaries[0].result : {};

          //  Provide some general info for the card header
          card.subtitle = insight.facts?.target_time_period?.label;

          //  Define the metric's name and markup (from api)
          let myMetric = {
            key: insight.id,
            markup: insight.markup,
            vega: null
          };

          //  If the metric also has an image, include that oo
          if (summary.viz && Object.keys(summary.viz).length > 0){
            myMetric.vega = summary.viz;
          }

          // Save to an array
          card.main.push(myMetric)
        }

        //  Define 1 or more insights that should be hidden by default within the card
        for (let i = 0; i<top.insights.length; i++) {
          const insight = top.insights.length>0 ? top.insights[0].result : {};
          const summary = top.summaries.length>0 ? top.summaries[0].result : {};

          if (insight) {
            //  Provide some general info for the card header
            card.subtitle = insight.facts?.target_time_period?.label;

            //  Define the metric's name and markup (from api)
            let myMetric = {
              key: insight.id,
              markup: insight.markup,
              vega: null
            };

            //  If the metric also has an image, include that oo
            if (summary.viz && Object.keys(summary.viz).length > 0){
              myMetric.vega = summary.viz;
            }
            
            // Save to an array
            card.extra.push(myMetric)
          }
        }
        
        //  Save a reference to this card
        metrics.push(card);
      })
      
      //  Set the new
      setMetrics(metrics);
      setIsLoading(false);
    };
    useEffect(() => {
      fetchMetrics();
    }, [metrics, isLoading])

  */
  
    /*
  function renderCard(metric) {
    return 
      <Card sx={{ maxWidth: 345 }} key={metric.key}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} src='/images/tableau.webp' />
          }
          title={metric.title}
          subheader={metric.subtitle}
        />
        {metric.main.map((insight) => (
          <CardContent key={insight.key}>
            <VegaLite spec={insight.vega.spec} />
            <p dangerouslySetInnerHTML={{__html: insight.markup}} />
          </CardContent>
        ))}
      </Card>
  }

  let content;
  if (!metrics){
    content = <CircularProgress />;
  } else {
    content = <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <ul className={utilStyles.list}>
                  { metrics.map((metric) => ( renderCard(metric) )) }
                </ul>
              </section>
  }
  */

  //  <CardGrid></CardGrid>
  //  <Chart></Chart>
  return (
    <Layout home>
      <CardGrid></CardGrid>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
