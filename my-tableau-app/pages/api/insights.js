
const tableau = {
    url: 'https://us-west-2a.online.tableau.com',
    site: 'pulseinternal',
    apiVersion: '3.18',
    pat: {
        name: 'takashi-test',
        secret: 'D7f8iW1HSkCDqS7mxA6ENA==:7AOE2FwChb2TwMxx7WKWTulafY4uspOh'
    }
}

async function tableauAuth() {

    const url = `${tableau.url}/api/${tableau.apiVersion}/auth/signin`;
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify({
            "credentials": {
                "personalAccessTokenName": tableau.pat.name,
                "personalAccessTokenSecret": tableau.pat.secret,
                "site": {
                    "contentUrl": tableau.site
                }
            }
        })
    }

    const resp = await fetch(url,options);

    if (resp.ok) {
        const data = await resp.json();
        return {
            'apiToken': data.credentials.token,
            'userId': data.credentials.user.id
        };
    } else {
        return null;
    }
}

async function getSubscribedMetrics(apiToken, userId) {

    const pageSize = 50;
    const url = `${tableau.url}/api/-/subscriptionservice/subscriptions?user_id=${userId}&page_size=${pageSize}`;
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept":"application/json",
            "X-Tableau-Auth": apiToken
        }
    }

    const resp = await fetch(url, options);

    if (resp.ok){
        const data = await resp.json();
        return data.subscriptions;
    } else {
        return [];
    }
}

async function getMetricDefinitions(apiToken, core, metricIds) {

    const endpoint = core ? 'coreMetrics:batchGet?core' : 'scopedMetrics:batchGet?scoped';
    const url = `${tableau.url}/api/-/metricservice/${endpoint}_metric_ids=${metricIds.join(',')}`;
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept":"application/json",
            "X-Tableau-Auth": apiToken
        }
    }
    const resp = await fetch(url, options);
    if (resp.ok){
        const data = await resp.json();
        return core ? data['core_metrics'] : data['scoped_metrics'];
    } else {
        return [];
    }
}

function getMetric(apiToken, scopedMetric, coreMetric, type){
    const title = scopedMetric.name ? scopedMetric.name : coreMetric.metadata.name;
    const payload = {
        "type": type,
        "version": 1,
        "input": {
            "metric": {
                "definition": coreMetric.definition,
                "scope": {
                    "name": title,
                    "definition": scopedMetric.definition
                },
                "representation_options": coreMetric.representation_options,
                "scoping_parameters": coreMetric.scoping_parameters,
                "metadata": {
                    "name": title
                }
            }
        },
        "options": {
            "output_format": "OUTPUT_FORMAT_HTML",
            "time_zone": "America/Vancouver"
        }
    }
    
    const url = `${tableau.url}/api/-/insights/v1/insights`;
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept":"application/json",
            "X-Tableau-Auth": apiToken
        },
        body: JSON.stringify(payload)
    }

    return fetch(url, options).then(async (res) => {
        let data = await res.json();
        data.title = title;
        return data;
    });
}

export default async function handler(req, res) {

    //  Authenticate to Tableau Cloud
    const {apiToken, userId} = await tableauAuth();
    
    //  Get a list of metrics that i've subscribed to
    const subscriptions = await getSubscribedMetrics(apiToken, userId);

    //  Create an array of just the metric IDs
    const scopedMetricIds = subscriptions.map( function(metric) {
        return metric.scope_id;
    })

    //  Fetch the definitions for all scoped metrics
    const scopedMetrics = await getMetricDefinitions(apiToken,false, scopedMetricIds);

    //  Get the core metric ID from every scoped metric
    const coreMetricIds = scopedMetrics.map( function(metric){
        return metric.core_metric_id
    })

    //  Fetch the definition of all core metrics
    const coreMetrics = await getMetricDefinitions(apiToken,true, coreMetricIds);

    //  Conver the array of core metrics into a dictionary using the core metric id for the key
    const coreMetricsDict = Object.assign({}, ...coreMetrics.map((metric) => ({[metric.metadata.id]:metric})))

    //  Create an array of Fetch promises, and wait for all of them to complete
    let insights = [];
    scopedMetrics.forEach( function(scopedMetric){
        //  One API call for the BAN
        //insights.push(getMetric(apiToken, scopedMetric, coreMetricsDict[scopedMetric.core_metric_id], 'ban'));
        //  Second API call for the springboard
        insights.push(getMetric(apiToken, scopedMetric, coreMetricsDict[scopedMetric.core_metric_id], 'springboard'));
    })

    //  Combine BAN and Springboard results into a single object
    
    //  Wait until all API calls have completed
    const metrics = await Promise.all(insights);

    //  Return the metric data
    res.status(200).json(metrics);
}