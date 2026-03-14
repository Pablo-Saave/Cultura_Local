import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SchemaMarkup = ({ type = 'Organization' }) => {
  // Organización
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fundación Cultura Local',
    url: 'https://www.culturalocal.cl',
    logo: 'https://www.culturalocal.cl/img/logo.png',
    description: 'Plataforma de gestión y difusión de prácticas culturales locales en Chile',
    sameAs: [
      'https://www.facebook.com/culturalocal',
      'https://www.instagram.com/culturalocal',
      'https://www.twitter.com/culturalocal'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contacto@culturalocal.cl',
      url: 'https://www.culturalocal.cl/contacto'
    }
  };

  // Página local de negocio (si aplica)
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Fundación Cultura Local',
    url: 'https://www.culturalocal.cl',
    image: 'https://www.culturalocal.cl/img/logo.png',
    description: 'Potenciamos la cultura local a través de la participación juvenil',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL'
    }
  };

  const schema = type === 'Organization' ? organizationSchema : localBusinessSchema;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

SchemaMarkup.propTypes = {
  type: PropTypes.string
};

export default SchemaMarkup;
