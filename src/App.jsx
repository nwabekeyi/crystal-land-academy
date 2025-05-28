import './App.css';
import MyRoute from './Router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Import store and persistor from reduxStore
import { store, persistor } from './reduxStore/store';

function App() {

  return (

        <Provider store={store}> {/* Provide Redux store */}
      <PersistGate loading={null} persistor={persistor}> {/* Wait for persisted state */}
          {/* <MyRoute /> */}

          <div style={{height:'100vh', width:'100vw', display:"grid", placeContent: 'center', }}>
              <p style={{fontSize:"3em", fontWeight:'2em', color:'green', textAlign: 'center'}}>Crystal land academy</p>
              <p style={{fontSize:"1em", fontWeight:'1em', textAlign:'center'}}>Please view web app updates here </p>

          </div>
      </PersistGate>
    </Provider>

  );

}

export default App;
