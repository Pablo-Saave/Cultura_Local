/**
 * Blog.jsx - P�gina de blog
 * P�gina de blog/noticias con art�culos culturales y novedades.
 */
function Blog() {
  return (
    <div className="min-h-screen py-20 px-4 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary dark:text-primary-light mb-6">
          Blog Cultural
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl">
          Lee las últimas noticias, reflexiones y análisis sobre cultura local, 
          patrimonio y participación comunitaria.
        </p>
        
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">
            Próximamente: artículos del blog
          </p>
        </div>
      </div>
    </div>
  )
}

export default Blog
