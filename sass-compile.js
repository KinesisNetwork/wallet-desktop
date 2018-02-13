const sass = require('node-sass')
const fs = require('fs')
const target = './src/style.css'

sass.render({
  file: './src/style.scss',
  outFile: target
}, (err, result) => {
  if (err) return console.error(err)
  fs.writeFileSync(target, result.css)
  console.log('CSS compiled')
})
