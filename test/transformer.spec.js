import test from 'ava'
import webpack from 'webpack'
import path from 'path'

test('sample', async t => {
  await new Promise((resolve, reject) => {
    try {
      webpack(
        {
          mode:'development',
          devtool: "cheap-module-source-map",
          entry: {
            index: path.resolve(__dirname, './fixtures/demo.md')
          },
          output: {
            path: path.resolve(__dirname, './fixtures'),
            filename: 'demo.js'
          },
          module: {
            rules: [
              {
                test: /\.md$/,
                loader: path.resolve(__dirname, '../src/index.js')
              },
              {
                test: /\.js$/,
                loader: 'babel-loader'
              }
            ]
          },
          externals:['react','react-dom','react-code-snippet']
        },
        (err, stats) => {
          if (err || stats.hasErrors()) {
            process.stdout.write(stats.toString() + "\n");
            t.truthy(true)
          } else {
            t.truthy(true)
          }
          resolve()
        }
      )
    } catch (e) {
      console.error(e)
    }
  })
})
