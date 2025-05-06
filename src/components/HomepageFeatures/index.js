import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Simple, Declarative Configuration',
    description: (
      <>
        Wake uses a simple JSON configuration file with just
        the barebones information needed to build your images.
      </>
    ),
  },
  {
    title: 'Optimize Build Process',
    description: (
      <>
        When building images, Wake carefully manages user-defined dependencies to
        ensure that only the necessary layers are rebuilt.
      </>
    ),
  },
  {
    title: 'Push to Any Registry',
    description: (
      <>
        Wake comes with tag and push commands that allow you to store select images in
        a registry of your choice.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
