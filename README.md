# slim-redux-react 0.2 BETA

![alt text](https://raw.githubusercontent.com/aGuyNamedJonas/slim-redux/master/logo/slim-redux-text-logo-dark.png "slim-redux-logo")

This is the official repository for the beta testing phase of `slim-redux-react 0.2 BETA` 🙌🏻  

*The beta testing phase focuses on the react wrapper, but you're always free to play around with the standalone version of `slim-redux` ([instructions]())*

## Getting Started
* Clone this repository
* `npm install` & `npm start` to start the example app
* Get down and dirty with the example app :)

## Next Steps
▶︎ Read the [introduction]()  
▶︎ Join the discussion on our discord server: [https://discord.gg/skqwunW](https://discord.gg/skqwunW)  
▶︎ **Report bugs** by submitting an issue in the `slim-redux-redux` repository [here]()  
▶︎ Test out `slim-redux-react` in your own projects: `npm i --save slim-redux-react@beta`  
▶︎ Not a big react fan? Try out just `slim-redux` [here]()

----

### ▶︎ [Introduction]()
### ▶︎ [API Reference]() `slim-redux-react`
* [createSlimReduxStore()]()
* [changeTrigger()]()
* [subscription()]()
* [calculation()]()
* [asyncChangeTrigger()]()
### ▶︎ [Simple Example]()


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

Read on for a detailled description of the API, or skip to the [example]().

### API Reference (slim-redux-react)
### createSlimReduxStore()
### changeTrigger()
### subscription()
### calculation()
### asyncChangeTrigger()

### Simple Example