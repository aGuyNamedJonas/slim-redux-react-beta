import React from 'react';
import ReactDOM from 'react-dom';

import { createSlimReduxStore, connect, subscription, calculation, changeTrigger, asyncChangeTrigger, Provider } from 'slim-redux-react';

const store = createSlimReduxStore({ counter: 1, stuff: 'state' });

const counter      = subscription('state.counter'),
      currentState = subscription('state'),
      inc          = changeTrigger('INCREMENT_COUNTER', (value, counter) => counter + value, 'state.counter'),
      dec          = changeTrigger('DECREMENT_COUNTER', (value, counter) => counter + value, ['state.counter']),
      asyncInc     = asyncChangeTrigger({ inc }, (value, ct) => {
          setTimeout(() => ct.inc(value), 2000);
      }),
      counterPlus  = calculation(['state.counter'], counter => counter + 5);

// Named export: Visual component
export const Counter = ({ counter, inc, dec, asyncInc, counterPlus, currentState }) => (
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

const CounterContainer = connect(Counter, { counter, inc, dec, asyncInc, counterPlus, currentState });

// Default export: Container component
export default CounterContainer;

// Setup the store, just like you're used to from react-redux - with a <Provider/> component....
const App = () => (
    <Provider store={store}>
        <CounterContainer/>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
