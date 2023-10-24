
import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';

import useSWR from 'swr'

import utilStyles from '../styles/utils.module.css';
import Stack from '@mui/material/Stack'; 
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import { VegaLite } from 'react-vega'

//  Fetcher function
const fetcher = (...args) => fetch(...args).then((res) => res.json());

//  Function to organize the results
const parseInsights = (insightGroup) => {

    //  Define 1 or more insights for the main section of the card
    let metrics = [];
    for (let i = 0; i<insightGroup.insights.length; i++) {
        const insight = insightGroup.insights.length>0 ? insightGroup.insights[0].result : {};
        const summary = insightGroup.summaries.length>0 ? insightGroup.summaries[0].result : {};
  
        if (insight) {
            //  Define the metric's name and markup (from api)
            let myMetric = {
            key: insight.id,
            markup: insight.markup,
            vega: null
            }; 
    
            //  If the metric also has an image, include that oo
            if (summary && summary.viz && Object.keys(summary.viz).length > 0){
                myMetric.vega = summary.viz;
            }
    
            // Save to an array
            metrics.push(myMetric)
        }
    }

    //  Return the array of metrics
    return metrics;
}

const CardGrid = () => {

    //  Fetch data from the API
    const { data } = useSWR('http://localhost:3000/api/insights',fetcher,{
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });    

    //  What to draw while the API call is running
    if (!data || data.length==0) return <CircularProgress />;

    //  Parse the data, into a structure we can use
    let metrics = [];
    data.forEach( function(metric, index){    

        //  Split out the insight groups
        const ban = metric.result.insight_groups.filter((ig) => { return ig.type === 'ban' })[0];
        const top = metric.result.insight_groups.filter((ig) => { return ig.type === 'top' })[0];
  
        //  Define the top layer of the card
        let card = {
            title: metric.title,
            subtitle: ban.result?.facts?.target_time_period?.label,
            key: `tableau-card-${index}`,
            main: parseInsights(ban),
            extra: parseInsights(top)
        }
      
        //  Save a reference to this card
        metrics.push(card);
    })
    
    //  HTML to render
    return (
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                { metrics.map((metric) => ( 
                    <Card key={metric.key}>
                        <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} src='/images/tableau.webp' />
                        }
                        title={metric.title}
                        subheader={metric.subtitle}
                        />
                        { metric.main.map((insight) => (
                            <CardContent key={insight.key} className='main'>
                                <VegaLite spec={insight.vega?.spec} data={insight.vega?.spec?.data}/>
                                <p dangerouslySetInnerHTML={{__html: insight.markup}} />
                            </CardContent>
                        ))}
                        <Divider />
                        { metric.extra.map((insight) => (
                            <CardContent key={insight.key} className='extra'>
                                <VegaLite spec={insight.vega?.spec} data={insight.vega?.spec?.data}/>
                                <p dangerouslySetInnerHTML={{__html: insight.markup}} />
                            </CardContent>
                        ))}
                    </Card>
                 )) }
            </Stack>
        </section>
    )
}
export default CardGrid;
