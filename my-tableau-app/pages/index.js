import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import CardGrid from '../components/cardgrid';
export default function Home({ allPostsData }) { 
  return (
    <Layout home>
      <CardGrid></CardGrid>
    </Layout>
  );
}