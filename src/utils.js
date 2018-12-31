const fs = require("fs-extra")
const ReactPropsTable = require("react-props-table")
const React = require("react")
const docGen = require("react-docgen")
const ReactDOMServer = require("react-dom/server")

export const renderTablePropsToFile = async (
  filePath,
  componentPath,
  startOffset,
  endOffset
) => {
  await fs.access(filePath)
  await fs.access(componentPath)
  const component = await fs.readFile(componentPath, "utf-8")
  const file = await fs.readFile(filePath, "utf-8")
  const __docgenInfo = docGen.parse(component)
  const newContent =
    file.slice(0, startOffset) +
    "\n" +
    ReactDOMServer.renderToString(
      React.createElement(ReactPropsTable, {
        of: { __docgenInfo }
      })
    ) +
    "\n" +
    file.slice(endOffset)
  if (newContent !== file) {
    await fs.writeFile(filePath, newContent)
  }
}
