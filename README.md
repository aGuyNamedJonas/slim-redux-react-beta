# slim-redux-react 0.2 BETA
[Discord server](https://discord.gg/skqwunW) | [Report bugs](https://github.com/aGuyNamedJonas/slim-redux-react)

![alt text](https://raw.githubusercontent.com/aGuyNamedJonas/slim-redux/master/logo/slim-redux-text-logo-dark.png "slim-redux-logo")

This is the official repository for the beta testing phase of `slim-redux-react 0.2 BETA` 🙌🏻  

*The beta testing phase focuses on the react wrapper, but you're always free to play around with the standalone version of `slim-redux` ([instructions]())*

## Getting Started
* Clone this repository
* `npm install` & `npm start` to start the example app
* Get down and dirty with the example app :)

## Next Steps
▶︎ Read the introduction (scroll down)
▶︎ Join the discussion on our discord server: [https://discord.gg/skqwunW](https://discord.gg/skqwunW)  
▶︎ **Report bugs** by submitting an issue in the `slim-redux-redux` repository [here](https://github.com/aGuyNamedJonas/slim-redux-react)  
▶︎ Test out `slim-redux-react` in your own projects: `npm i --save slim-redux-react@beta`  
▶︎ Not a big react fan? Try out just `slim-redux` **COMING SOON**

----

## Introduction
So why `slim-redux-react`/ `slim-redux`?  
In two words: Less boilerplate.

While I admire the simplicity of the [core concepts of redux](http://redux.js.org/docs/introduction/CoreConcepts.html), I always found working with redux in react to be very overhead-heavy and at times incredibly confusing.  

I felt like it took me way more brain space and time to build react-redux apps than it should, considering the simplicity of redux itself.

`slim-redux` and `slim-redux-react` aim to solve this problem by providing a 100% compatible, but alternative interface for working with redux - standalone and inside react apps.

The basic ideas are as simple as redux itself:  
* **change triggers**: Bundle action and reducer code into on statement
* **subscriptions**: Easily subscribe to changes in a part of your state
* **calculations**: Derive values off of the state, using subscriptions
* **async change triggers**: Write async code which utilizes change triggers

Read on for a detailled **description of the API**, or scroll down to the **example**.

### API Reference (slim-redux-react)

### createSlimReduxStore(initialState, options)
**Description:** Creates and initializes the slim-redux store which is actually a redux store injected with some slim-redux functionality.   
You can use this in your react app like you normally would, using the `<Provider/>` component (see below).

**Parameters:**
- `initialState`: The initial state of the store
- `options`: Object with the following (all optional!) options
  - `rootReducer: (default=dummyReducer)` Existing root reducer, in case slim-redux is used alongside an existing redux setup. Again: This is optional, slim-redux has an internal reducer, you don't need to define any reducer to use slim-redux. This is just to be compatible with your existing redux setup.
  - `middleware: (default=undefined)` Middleware you might want to install (like the redux devtools browser extension)
  - `disableGlobalStore: (default=false)` When set to true, the created store instance will not be saved in the global scope. This means that you will have to manually pass the store instance to change triggers when calling them. This might be useful for server side rendering or when testing etc.

**Returns:**  
Slim-redux store instance which is a redux store, injected with slim-redux functionality.

**Example:**  
```javascript
import { createSlimReduxStore } from 'slim-redux'

// Creating a slim-redux store with initial state and devtools installed
const store = createSlimReduxStore({todos:[]}, {
  middleware: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});
```

###Provider
**Description:** The regular Provider component that you're used to from react-redux. This is actually just a convenience export, directly taken from react-redux, so you can easily provide a store instance to your app.

**Example:**
```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { createSlimReduxStore } from 'slim-redux';
import { Provider } from 'slim-redux-react';

// Creating a slim-redux store with initial state and devtools installed
const store = createSlimReduxStore({todos:[]}, {
  middleware: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});

ReactDOM.render(
  <div>
    <Provider store={store}>
      <App/>
    </Provider>
  </div>  ,
  document.getElementById('root')
);
```

### connect(component, stuff): containerComponent
*(pka `slimReduxReact()`)*  

**Description:** connects a visual react component to slim-redux and returns the containerized component. This function had the name `slimReduxReact()` but was renamed to `connect()` to avoid introducing too many new names.

**Parameters:**
* `component`: The react component to be connected to slim-redux
* `stuff`: An object which contains the subscriptions, caluclations, change triggers, and async change triggers for this component

**Returns:**  
The containerized react component that will get subscriptions, calculations, change triggers and async change triggers as props

**Example:**  
```javascript
// components/TodoList.js
import { connect } from 'slim-redux-react';
import { addTodo } from '../async/todo';
import { visibleTodos } from '../computations/todo';

// The TodoList react component
export const TodoList = (props) => ( /* ... */ );

// Connecting the visual component to the store
export default connect(TodoList, { visibleTodos, addTodo });
```

**HIER WEITERMACHEN!**

### changeTrigger(actionType, reducer, [focusString])
**Description:** Creates a change trigger which conceptually is a side-effect free modification of the state. The beauty of this is action type and reducer function in one statement. Calling `changeTrigger()` will return a change trigger function which you can call to trigger this change in your state.  

You can define custom arguments which will be accepted by your change trigger function.

Add an optional focus string (a subscription-style string, Example: `'state.counter'`) to only have your reducer function modify a part of your state.

**Parameters:**  
* `actionType`: Action type of your string, this is what you will see in your redux devtools.
* `reducer`: Function which modifies the state - this decribes what your change trigger will do to the state. The last argument of this function will receive the state on invocation. So generally this will the `state`, but if you use the optional `focusString`, this will be just the part of the state that the focus string points to.

**Returns:**  
Change trigger function that has the signature of the reducer function (minus the last argument which will receive the state) and will dispatch the change trigger's action, resulting in the internal `slim-redux` reducer to execute your reducer function.  
When called this will return an object containing the action dispatched and the new version of the state.

**Example:**  
```javascript
// changes/todo.js
import { changeTrigger } from 'slim-redux-react';

export const addTodo = changeTrigger('ADD_TODO', (label, todos) => {
  // Reducer function has access to the state
  const newId = todos.map((max, todo) => Math.max(max, todo.id), 0) + 1;
  return [
    ...todos,
    {id: newId, label: label, checked: false},
  ];
}, 'state.todos');

// main.js
import { createSlimReduxStore } from 'slim-redux-react'
import { addTodo } from './changes/todo';

const store = createSlimReduxStore({ todos: [], stuff: 'state' });

const TodoList = ({addTodo}) => ( /*...*/ );

const TodoListContainer = connect(TodoList, { addTodo });

const App = () => (
    <Provider store={store}>
        <TodoListContainer/>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

### subscription(subscriptionString)  
**Description:** Maps a part of your state to the props, using a simple string syntax. Will update the prop anytime this part of your state changes. Uses `reselect` in the background for optimal performance.

**Parameters:**  
* `subscriptionString`: A string of the style `state.subPart.subPart` which points to the part of your state that you want to subscribe to. You can also subscribe to the whole state, using `state`.  

**Example:**  
```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import { createSlimReduxStore, connect, subscription } from 'slim-redux-react';

const store = createSlimReduxStore({ counter: 1, stuff: 'state' });
const counter = subscription('state.counter');

const CounterComponent = ({counter}) => (
  <div>
    Current Counter: ${counter}
  </div>
);

const CounterContainer = connect(Counter, { counter });

const App = () => (
    <Provider store={store}>
        <CounterContainer/>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

### asyncChangeTrigger(changeTriggers, triggerFunction, [{store: storeInstance}])
**Description:** Change triggers are always synchronous, as is the norm in redux (store.dispatch() and the reducers are actually synchronous). To allow for asynchronous code to take care of state changes, in slim-redux asyncChangeTrigger() is provided. The name might be slightly confusing at first, but the idea is that your async code gets provided with change triggers (synchronous) which you can call out of your async callbacks / promises etc. Async change triggers are of course not guaranteed to actually make a state change, but when they do, it's through a regular, synchronous change trigger.  
Note that this does not have an action type, as only change triggers have an action type. This is to make sure that whenever you see an action in your redux devtools, they actually represent a state change, not any pseudo actions that are only there to trigger async code.

**Parameters:**  
* `changeTriggers`: Object which contains all the change triggers that this async change trigger needs. Can be regular change triggers or async change triggers. Object keys are the names under which the change triggers will be available inside the `triggerFunction`, the value are the change triggers themselves. It's recommended to use the ES6 shorthand - **Example**:   
`export const addTodoServerSync = asynChangeTrigger({ addTodo, addTodoSuccess, addTodoFailed }, (name) => { /* ... */ })`
* `triggerFunction`: A function which receives all the parameters that this async change trigger needs, and will have access to the state and to the change triggers from the first argument. This is called the trigger function, because unlike in the `changeTrigger()` API call, this function is not a reducer. The only way for it to change state is to invoke change triggers. **The signature of this function can be empty!**
* `(optional) Object with store instance in it` In case you set the `disableGlobalStore=true` option when you invoked `createSlimReduxStore()` you have to pass the store instance to your change triggers manually. When you pass this in for asyncChangeTrigger it will automatically be set for the change triggers called from within.

**Returns:**  
A change trigger function which can be called, passing in the parameters that the `triggerFunction` expects. When calling the trigger function, it will return a promise (since hoChangeTrigger are rather asynchronous in nature) which contains all the actions dispatched and access to the state.

**Example:**  
```javascript
// async/todo.js
import { asyncChangeTrigger } from 'slim-redux-react';
import { addTodo, addTodoSuccess } from '../changes/todo';

// First argument is a change trigger mapping like in slimReduxReact()
export const addTodoServerSync = asyncChangeTrigger({ addTodo, addTodoSuccess }, (name) => {
  // Notice how we have access to the state inside of the reducer function
  const newId = state.todos.filter((max, value) => Math.max(max, value), 0) + 1;

  // Call our first change trigger (also notice how change triggers now take arguments!)
  addTodo(newId, title);

  fetch(`/v1/todos`, {
    method: 'post',
    /* ... */
  ).then(data => {
    // Calling our second change trigger to confirm we added the task on the server
    addTodoConfirmed(newId);
  })
});

// main.js
import { createSlimReduxStore } from 'slim-redux'
import { addTodoServerSync } from './async/todo';

const store = createSlimReduxStore({todos:[]});

// Notice how we don't need any sort of registration here.
// We just call this asynchronous change trigger and pass it the name
// of our new todo. The rest is taken care of by the async change
// trigger and will lead to a new todo which is persitetd to the server
addTodoServerSync('Get Milk');
```

### subscription(subscriptionString, changeCallback, [{store: storeInstance}])  
**Description:** Function which lets you react to state changing in very specific areas (so whatever you subscribed to). The changeCallback is called anytime the subscribed to part of the state changes, and will receive the subscribed to value and the state as arguments.  
This API function is only neccessary when exclusively working with slim-redux. In slim-redux-react, this function is used internally to provide subscriptions.

**Prameters:**  
* `subscriptionString`: String which addresses (a part of) the state tree. For example: `state.todos.filter`.
* `changeCallback`: This is called anytime the subscribed-to part of the state changes. The callback will receive the subscribed to part of the state and the state itself as arguments.
* `(optional) storeInstance`: With this parameter you can specify which store instance to register this calculation with. Default is the global instance.

**Returns:**  
True, if subscription was successfully created, throws exception when the subscription string did not match anything in the state or a store instance could not be found.

### calculation(calcFunction, subscriptionMap, [changeCallback], [{store: storeInstance}])
**Description:** Calculations are a great way to compute derived values off of the state. calculation() returns the computed value and internally uses redux-reselect, so the value you get might be cached which makes this efficient.  
Also you can pass in a callback into calculation() which gets invoked AFTER any of the subscribed-to values has changed and the new result has been computed. Like that this is a powerful way to react to state changes in a very specific and granular way.

**Parameters:**  
* `calcFunction`: Function which takes the subscriptions as an argument and then returns a calculated value off of these subscriptions. Anytime any of these subscriptions change, the `calcFunction` is re-invoked.
* `subscriptionMap`: An object mapping a part of the state to values that will be passed in to the `calcFunction` as arguments.
* `changeCallback`: Optional callback which is called whenever the calculation was retriggered. Function receives whatever the calculation returns as arguments and the state as the last argument
* `(optional) storeInstance`: With this parameter you can specify which store instance to register this calculation with. Default is the global instance.

**Returns:**  
The calculated value. As this is based on redux-reselect, calling a calculation might very well return a cached result - it does not recalculate if it doesn't have to. Like that this is also a very efficient way to access computed values that are derived from the state. Throws error whenever one of the subscriptions could not be found inside the state.

**Example:**  
```javascript
import { calculation } from 'slim-redux';

const todos = 'state.todos';
const filter = 'state.todos.visbilityFilter';

export const visibleTodos = calculation((todos, filter) => (
  todos.filter(todo => (
    filter === 'all' ||
    filter === 'open' && !todo.checked ||
    filter === 'done' && todo.checked
  ));
), { todos, filter });
```

### Simple Example
This is actually just the `src/index.js` file that you also find in this repository. Imagine how slim this is without the comments though! ❤️

```javascript
```