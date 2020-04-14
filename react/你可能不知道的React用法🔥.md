## 前言

React 作为前端最 🔥 的框架之一，但是有的时候我们仅限于能用的阶段，有一些高级用法，我们在日常开发中却很少涉足。但是一旦用起来，我们就能发现它的方便和强大之处，我们就会越来越发现我们已经离不开它了！这就像是刚用 React 时，我内心是拒绝的，但是现在我已经离不开它了，越来越不能理解以前自己为什么抱着 JQuery 不放呢！

今天我们重点讲一下 Context 这个高级 API，以及如何封装它，让它更加易用！

## Context 简介

Context 通过组件树提供了一个传递数据的方法，从而避免了在每一个层级手动的传递 props 属性。

在一个典型的 React 应用中，数据是通过 props 属性由上向下（由父及子）的进行传递的，但这对于某些类型的属性而言是极其繁琐的（例如：地区偏好，UI 主题），这是应用程序中许多组件都所需要的。 Context 提供了一种在组件之间共享此类值的方式，而不必通过组件树的每个层级显式地传递 props 。

简单说就是，当你不想在组件树中通过逐层传递 props 或者 state 的方式来传递数据时，可以使用 Context 来实现跨层级的组件数据传递。

假设我们有一种场景，我们有一个业务容器 App，里面有一个组件容器 Container，Container 组件内包含一个 Form 表单，Form 表单里面有一个提交按钮 SubmitButton。假如使用 props 传递，我们就不得不传递四层。

![](https://user-gold-cdn.xitu.io/2018/12/27/167efe782cbf9ae7)

![](https://user-gold-cdn.xitu.io/2018/12/27/167effade1841d17?w=1079&h=666&f=png&s=46296)

看到了吗？很方便吧！这里我们使用 Context，在<SubmitButton />组件可以直接通过 context 获取最顶层绑定的值，避免了一层层传递 props 的麻烦，也减少出错的可能性。

### 如何使用 Context

如果要 Context 发挥作用，需要用到两种组件，一个是 Context 生产者(Provider)，通常是一个父节点，另外是一个 Context 的消费者(Consumer)，通常是一个或者多个子节点。所以 Context 的使用基于生产者消费者模式。

Context 设计目的是为共享那些被认为对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。例如，在下面的代码中，我们通过一个“theme”属性手动调整一个按钮组件的样式，使用 context，我们可以避免通过中间元素传递 props。

```javascript
// 创建一个 theme Context,  默认 theme 的值为 light
const ThemeContext = React.createContext('light');

function ThemedButton(props) {
  // ThemedButton 组件从 context 接收 theme
  return (
    <ThemeContext.Consumer>
      {(theme) => <Button {...props} theme={theme} />}
    </ThemeContext.Consumer>
  );
}

// 中间组件
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class App extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}
```

## 一种更简单的使用方式

看了上面的使用方式，有没有觉得还是有一些不爽，有没有简单一点的方式呢，或者能不能帮我封装一下呢？
当然可以，Javascript 工程师是无所不能的！！！

首先是我们的 provider.js，这个就是我们封装的 context 使用工具

```javascript
import React, { Component } from 'react';

export const Context = React.createContext();

export class ContextProvider extends Component {
  render() {
    return (
      <Context.Provider value={this.props.context}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

/**
 * 用注解的方式给子组件注入属性
 */

export const injectContext = (contexts) => (RealComponent) => {
  return class extends Component {
    render() {
      return (
        <Context.Consumer>
          {(context) => {
            // 将顶层的context分发到各层
            let mapContext = {};
            if (Array.isArray(contexts)) {
              contexts.map((item) => {
                mapContext[item] = context[item];
              });
            }
            return <RealComponent {...mapContext} {...this.props} />;
          }}
        </Context.Consumer>
      );
    }
  };
};
```

还是举个栗子，来让大家明白上述封装的方法的方便之处。
假如要实现<font color="red">GrandParent -> Parent -> Son</font>，从 GrandParent 组件传递属性到 GrandSon 组件，每个组件都有一个独立的文件。

先看入口文件，我们在入口文件进行绑定上下文，使用 provider 里面的 ContextProvider 类，这里我们主要绑定了 propA 和 propB。

```javascript
// 入口文件

import React, { PureComponent } from 'react';
import { ContextProvider } from './provider';
import GrandParent from './GrandParent';

class Index extends PureComponent {
  render() {
    return (
      <ContextProvider
        context={{
          propA: 'propA',
          propB: 'propB',
        }}
      >
        <GrandParent />
      </ContextProvider>
    );
  }
}
```

Parent 组件没什么特殊的

```javascript
import React, { PureComponent } from 'react';
import Son from './Son';

class Index extends PureComponent {
  render() {
    return <Son />;
  }
}
```

Son 组件是真正使用属性 propA 和 propB 的地方，我们通过 ES6 的 Decorator 实现，非常方便。注入后，可以像 props 一样使用。

```javascript
import React, { PureComponent } from 'react';
import { injectContext } from './provider';
import Son from './Son';

@injextContext(['propA', 'propB'])
class Index extends PureComponent {
  render() {
    return (
      <div>
        <span>propA为{this.props.propA}</span>
        <span>propB为{this.props.propB}</span>
      </div>
    );
  }
}
```

## 后记

在这一小节中，我们主要讲了 React 的一个高级语法 Context，而且为了使用方便，我们封装了 ContextProvider 类和 injextContext 方法，使用时利用 ES6 的 Decorator 语法糖，非常简便。大家在日常开发中，也可以封装出一些这样的小工具，可以极大提升开发效率。

最后元旦快到了，祝大家新年快乐！！！

> @Author: WaterMan
