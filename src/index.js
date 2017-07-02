import React from 'react';
import ReactDOM from 'react-dom';

import { createSlimReduxStore, connect, subscription, calculation, changeTrigger, asyncChangeTrigger, Provider } from 'slim-redux-react';

const middleware = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createSlimReduxStore({ counter: 1, stuff: 'state' }, { middleware });


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
