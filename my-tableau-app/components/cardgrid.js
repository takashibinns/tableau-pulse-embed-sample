
import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';

import useSWR from 'swr'

import utilStyles from '../styles/utils.module.css';
import Stack from '@mui/material/Stack'; 
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';

import VegaLiteViz from './vegaliteviz';

//  Function to determine if 
const isEmpty = (obj,propname) => {
    //  Check for null/undefined object
    if (!obj) return true;
    //  Could be an object with no properties
    if (Object.keys(obj).length == 0) return true;
    //  Check a property of the object, too
    if (propname) {
        if (Object.keys(obj[propname]).length == 0) return true;
    }
    //  Passed all the tests, object is not empty
    return false;
}

//  Fetcher function for SWR - executes the FETCH API call, and returns the response's data as JSON
const fetcher = (...args) => fetch(...args).then((res) => res.json());

//  Function to organize the results of an InsightGroup
const parseInsights = (insightGroup) => {

    //  Define 1 or more insights for the main section of the card
    let metrics = [];
    for (let i = 0; i<insightGroup.insights.length; i++) {

        //  Assume insights/summaries have a single item for now
        const insight = insightGroup.insights?.[0]?.result;
        const summary = insightGroup.summaries?.[0]?.result;
  
        if (insight) {
            //  Define the metric's name and markup (from api)
            let myMetric = {
                key: insight.id,
                markup: insight.markup,
                vega: null
            }; 
    
            //  Sometimes the viz is in the insight, other times it's in the summary
            if (!isEmpty(summary,'viz')){
                myMetric.vega = summary.viz;
            } else if (!isEmpty(insight,'viz')){
                myMetric.vega = insight.viz;
            }
    
            // Save to an array
            metrics.push(myMetric)
        }
    }

    //  Return the array of metrics
    return metrics;
}

//  
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

    const renderViz = (spec) => {
        if (spec){
            return <VegaLiteViz height={104} spec={spec}></VegaLiteViz>
        } else {
            return <></>
        }
    }
    
    //  HTML to render
    return (
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
            <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                { metrics.map((metric) => ( 
                    <Card key={metric.key}>
                        <CardHeader
                        avatar={
                            <Avatar src='/images/tableau.webp' />
                        }
                        title={metric.title}
                        subheader={metric.subtitle}
                        />
                        { metric.main.map((insight) => (
                            <CardContent key={insight.key} className='main'>
                                {renderViz(insight.vega)}
                                <p dangerouslySetInnerHTML={{__html: insight.markup}} />
                            </CardContent>
                        ))}
                        <Divider />
                        { metric.extra.map((insight) => (
                            <CardContent key={insight.key} className='extra'>
                                {renderViz(insight.vega)}
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
