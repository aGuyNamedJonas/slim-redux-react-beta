# slim-redux-react 0.2 BETA
[Discord server](https://discord.gg/skqwunW) | [Report bugs](https://github.com/aGuyNamedJonas/slim-redux-react) | **End of beta phase**: Sun, 16th July 2017

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
Why `slim-redux-react`/ `slim-redux`?  
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

To provide your react components access to this store, use the `<Provider/>` component (see below).

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

**Description:** connects a visual react component to `slim-redux` and returns the containerized component. This function had the name `slimReduxReact()` but was renamed to `connect()` to avoid introducing too many new names.

**Parameters:**
* `component`: The react component to be connected to slim-redux
* `stuff`: An object which contains the subscriptions, caluclations, change triggers, and async change triggers for this component. The key names of this object are the prop names under which your component can use the respective subscriptions, change triggers, etc.

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

### changeTrigger(actionType, reducer, [focusString])
**Description:** Creates a change trigger which should always represent a side-effect free state modification. The beauty of this is action type and reducer function in one statement. Calling `changeTrigger()` will return a change trigger function which you can call to trigger this change in your state.  

You can define custom arguments which will be accepted by your change trigger function.

Add an optional focus string (a subscription-style string, Example: `'state.counter'`) to only have your reducer function modify a part of your state.

**Parameters:**  
* `actionType`: Action type of your change trigger, this is what you will see in your redux devtools.
* `reducer`: Function which modifies the state - this decribes how your change trigger will modify the state, given the change trigger function arguments. The last argument of this function will receive the state on invocation. So generally this will be the `state`, but if you use the optional `focusString`, this will be just the part of the state that the focus string points to.

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

const TodoList = ({addTodo}) => (
  <div>
    <button onClick={e => props.addTodo('NEW TODO'))}>Add task 'NEW TODO'</button>
  </div>
);

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

### asyncChangeTrigger(changeTriggers, triggerFunction)
**Description:** Async change triggers allow you to use existing change triggers in asynchronous code. The `triggerFunction` will receive an object as the last argument which contains the state and all the change triggers.  

Note that async change triggers don't have action types, as they rely on the change triggers passed in for state modifications.

**Parameters:**  
* `changeTriggers`: Object which contains all the change triggers that you want to use in this async change trigger. 
* `triggerFunction`: The trigger function which can have custom arguments. Note that the last argument of this function will receive an object, containing the state and the passed in change triggers.

**Example:**  
```javascript
// async/todo.js
import { asyncChangeTrigger } from 'slim-redux-react';
import { addTodo, addTodoSuccess } from '../changes/todo';

// First argument is a change trigger mapping like in slimReduxReact()
export const addTodoServerSync = asyncChangeTrigger({ addTodo, addTodoSuccess }, (name, ct) => {
  // Notice how we have access to the state inside of the reducer function
  const newId = ct.state.todos.filter((max, value) => Math.max(max, value), 0) + 1;

  // Call our first change trigger (also notice how change triggers now take arguments!)
  ct.addTodo(newId, title);

  fetch(`/v1/todos`, {
    method: 'post',
    /* ... */
  ).then(data => {
    // Calling our second change trigger to confirm we added the task on the server
    ct.addTodoConfirmed(newId);
  })
});

// main.js
import { createSlimReduxStore } from 'slim-redux-react'
import { addTodoServerSync } from './async/todo';

const store = createSlimReduxStore({ todos: [], stuff: 'state' });

const TodoList = ({addTodo}) => (
  <div>
    <button onClick={e => props.addTodo('NEW TODO'))}>Add task 'NEW TODO'</button>
  </div>
);

const TodoListContainer = connect(TodoList, { addTodo: addTodoServerSync });

const App = () => (
    <Provider store={store}>
        <TodoListContainer/>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

### Simple Example
This is actually just the `src/index.js` file that you also find in this repository. Imagine how slim this is without the comments though! ❤️

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import { createSlimReduxStore, connect, subscription, calculation, changeTrigger, asyncChangeTrigger, Provider } from 'slim-redux-react';

const store = createSlimReduxStore(
    { counter: 1, stuff: 'state' }, 
    { middleware: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() }
);


/*
    subscription(subscriptionString)
    Subscription to a part of your state. Will update when that part of the state changes.
*/ 
const counter      = subscription('state.counter'),
      currentState = subscription('state');

/*
    changeTrigger(actionType, reducerFunction [, focusString])
    The magic of slim-redux-react: Combine your action types and reducer code into a single statement!
    You can use an optional focus string which lets you choose which part of the state youw ant to modify.
*/
const inc = changeTrigger('INCREMENT_COUNTER', (value, counter) => counter + value, 'state.counter'),
      dec = changeTrigger('DECREMENT_COUNTER', (value, state) => ({ ...state, counter: state.counter - value }) );

/*
    asyncChangeTrigger(changeTriggers, changeTriggerFunction)
    The higher order concept to change triggers: Reuse change triggers in async code.
    This could be a network request for example, here exemplified through a timeout.
*/
const asyncInc = asyncChangeTrigger({ inc }, (value, ct) => {
    setTimeout(() => ct.inc(value), 2000);
});

/*
    calculation(subscriptions, calculationFunction)
    Derive values off of your state. calculationFunction will receive the subscription values, and 
    can only rely on those for its calculation.
    The props that you map this to will be updated whenever the value of the calculation changes.
*/
const counterPlus = calculation(['state.counter'], counter => counter + 5);


// Visual component
// It's recommended you make your visual components the named export....
const Counter = ({ counter, inc, dec, asyncInc, counterPlus, currentState }) => (
    <div>
        <div>Counter (default): {counter}</div>
        <div>Counter (plus five): {counterPlus}</div>
        <div>
            <button onClick={e => inc(1)}>+</button>
            <button onClick={e => dec(1)}>-</button>
        </div>
        <div>
            <button onClick={e => asyncInc(5)}>Increase by 5 in 2 sec.</button>
        </div>
        <div>
            <div>Current State:</div>
            <div>{JSON.stringify(currentState, null, 2)}</div>
        </div>
    </div>
);


// Container component
// ...and your container component the default export. Like that you can have visual - and container
// component in one file, but still only import the visual component for testing purposes.
const CounterContainer = connect(Counter, { counter, inc, dec, asyncInc, counterPlus, currentState });


// Setup the store, just like you're used to from react-redux - with a <Provider/> component....
const App = () => (
    <Provider store={store}>
        <CounterContainer/>
    </Provider>
);


// Render it out....you know the drill :)
ReactDOM.render(<App />, document.getElementById('root'));

```