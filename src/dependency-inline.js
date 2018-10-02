/*
  Our content security policy disallows inlining JS in the document.body.
  TLDR: Add required auxillary dependency code here
*/

window.dataLayer = window.dataLayer || []

function gtag() {
  dataLayer.push(arguments)
}

gtag('js', new Date())
gtag('config', 'UA-125737569-4')

window.ga =
  window.ga ||
  function() {
    ;(ga.q = ga.q || []).push(arguments)
  }

ga.l = +new Date()

ga('create', 'UA-125737569-4', 'auto')
ga('require', 'eventTracker')
ga('require', 'urlChangeTracker')
ga('require', 'mediaQueryTracker')
ga('require', 'pageVisibilityTracker')
ga('require', 'cleanUrlTracker')
ga('send', 'pageview')
