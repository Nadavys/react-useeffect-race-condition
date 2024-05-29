# Examining Race Conditions in React and resolving it with useEffect
1. Use useRef to store the last call
2. Use abortController to cancel the previous call when a new call is made

## Features
Fetches data from an API and displays it in the UI.
Aborts ongoing fetch operations when a new one is started or when the component unmounts, preventing memory leaks and other issues.
 

## Up and running
```bash
npm instal
npm run dev
```

### Use a 3rd party lib
 - react-query
 - redux-saga 
