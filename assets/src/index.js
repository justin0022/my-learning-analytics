import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './containers/App'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'
// import * as serviceWorker from './serviceWorker'

const client = new ApolloClient({ uri: '/graphql' })

ReactDOM.render(
  <Router basename='/'>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Router>
  , document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister()
