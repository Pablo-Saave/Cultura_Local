import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ 
  title, 
  description, 
  keywords,
  image,
  type = 'website',
  url
}) => {
  const siteTitle = 'Cultura Local';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Plataforma de gestión y difusión de prácticas culturales locales en Chile. Descubre eventos, proyectos y publicaciones sobre cultura local.';
  const defaultKeywords = 'cultura local, Chile, eventos culturales, proyectos culturales, prácticas culturales, patrimonio cultural';
  const defaultImage = 'https://www.culturalocal.cl/img/og-image.jpg';
  const siteUrl = 'https://www.culturalocal.cl';

  return (
    <Helmet>
      {/* Meta tags básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Otros meta tags importantes */}
      <meta name="author" content="Cultura Local" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Spanish" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={url || siteUrl} />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  url: PropTypes.string
};

export default SEO;
