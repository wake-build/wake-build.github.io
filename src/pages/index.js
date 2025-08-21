import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <img src="/img/logo.png" alt="Wake Logo" />
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className={`button button--lg ${styles.heroButtonPrimary}`}
            to="/docs/quick-start">
            🚀 Get Started
          </Link>
          <Link
            className={`button button--lg ${styles.heroButtonSecondary}`}
            to="/what-is-wake">
            📖 Learn More
          </Link>
          <Link
            className={`button button--lg ${styles.heroButtonOutline}`}
            to="/docs/category/-tutorial">
            📚 Tutorial
          </Link>
        </div>
        <div className={styles.quickDemo}>
          <p className="hero__subtitle" style={{marginTop: '2rem', fontSize: '1rem', opacity: 0.8}}>
            Simple as: <code>pip install wake-build && wake all</code>
          </p>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Container Build Orchestration`}
      description="Wake is a container build orchestration tool with intelligent dependency resolution. Build multiple Docker images in the correct order with a simple configuration file.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
