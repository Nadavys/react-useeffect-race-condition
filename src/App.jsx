import { useState, useEffect, useRef } from 'react'

function App() {
  const [todoId, setTodoId] = useState(1)

  return (
    <>
      <label>Enter Todo ID: </label>
      <input type="number" value={todoId} onChange={(e) => setTodoId(e.target.value)} />
      <SearchWithSignalAbort id={todoId} />
    </>
  )
}


const SearchWithSignalAbort = (props) => {
  const [data, setData] = useState({});

  useEffect(() => {
    if (!props.id) {
      return undefined;
    }

    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchTodo = async (id) => {
      console.log("Fetching", id);
      let resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, { signal });
      //random delay
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));
      console.log(signal)
      if (signal.aborted) {
        console.log("Aborted", id);
        return;
      }
      resp = await resp.json();
      setData(resp);
    }

    fetchTodo(props.id);

    return () => {
      console.log("Cleanup  - aborting ", props.id);
      abortController.abort();
    }

  }, [props.id]);

  return <div>{data.id && <b>Item ID</b>} {data?.id} - <b>Item Title:</b>{data.title || "No data"}</div>;
}


const SearchWithUseRef = (props) => {
  const [data, setData] = useState({});
  const lastPromise = useRef();

  const fetchTodo = (id) => {
    const fetchPromise = fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(async resp => {
        //random delay
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));
        return resp
      });

    lastPromise.current = fetchPromise;

    fetchPromise.then(resp => {
      console.log("Promise resolved", id, lastPromise.current);
      if (lastPromise.current === fetchPromise) {
        resp.json().then(data => {
          setData(data);
        });
      }
    })
  }

  useEffect(() => {
    fetchTodo(props.id);
  },
    [props.id]);

  return <div>{data.id && <b>Item ID</b>} {data?.id} - <b>Item Title:</b>{data.title || "No data"}</div>;
}

export default App



//component shows old data even after changing the id
const ProblemSearch = (props) => {
  const [data, setData] = useState({});

  const fetchTodo = async (id) => {
    let resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
    resp = await resp.json();
    //random delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));
    setData(resp);
  }

  useEffect(() => {
    fetchTodo(props.id);
  }, [props.id]);

  return <div>{data.id && <b>Item ID</b>} {data?.id} - <b>Item Title:</b>{data.title || "No data"}</div>;
}
