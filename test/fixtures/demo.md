# Hello world

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

export default ()=><div>Hello world，这是一个文档插件</div>
```

这是一个文档，它可以完全转换为js代码

```jsx
import React from 'react'
import {render as renderDOM} from 'react-dom'

renderDOM(<div>这是第二个文档</div>, mountNode)
```