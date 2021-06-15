let createStore = reducer=> {
  let state;
  
  const subscriptions = [];
  const subscribe = callback=> subscriptions.push(callback);
  const unsubscribe = callback=> {
    const cbi = subscriptions.indexOf(callback);
    if(cbi === -1) return;
    else subscriptions.splice(cbi, 1);
  };

  const dispatch = action=> {
    const nextState = reducer(state, action);
    state = nextState;
    subscriptions.forEach(cb => cb());
  };

  const getState = ()=> state;

  dispatch({ type: '@@redux_init' });

  return {
    subscribe, unsubscribe, dispatch, getState,
  };
};

const firstStore = createStore((state = { names: [] }, action)=> {
  switch( action.type ){
      case 'add':
        return {
          ...state, 
          names: [...state.names, action.payload],
        };

      default:
        return state;
  }
});

const secondReducers = {
  add: (state, action)=> ({
    ...state, 
    names: [...state.names, action.payload],
  }),
  removeAll: (state, action)=> ({
    ...state,
    names: state.names.filter(name => name !== action.payload),
  }),
};

const secondStore = createStore((state = { names: [] }, action)=> (
  (secondReducers[action.type] ?? (i=> i) )(state, action)
));

secondStore.subscribe(()=> {
  let ul = document.querySelector('ul');
  if(!ul) {
    ul = document.createElement('ul');
    document.body.appendChild(ul);
  }

  const { names } = secondStore.getState();
  ul.innerHTML = names.map(name => '<li>'+name+'</li>').join('');
});
