import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import CardGrid from '../components/cardgrid';
import Chart from '../components/test';
export default function Home({ allPostsData }) { 
  return (
    <Layout home>
      <CardGrid></CardGrid>
      {/*<Chart></Chart>*/}
    </Layout>
  );
}