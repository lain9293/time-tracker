import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from './utils/uuid.js';
import localStore from './utils/localStorage.js';
import timeSum from './utils/timeCalc.js';

const App = () => {
  const [days, setDays] = useState(localStore.getItem('days', 'Array'));
  const [currentDay, setCurrentDay] = useState('');
  const [newAction, setNewAction] = useState({
    id: uuidv4(),
    description: '',
    time: '',
  });

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const addNewDay = () => {
    const id = uuidv4();
    setDays([...days, { id, date: new Date(), actions: [] }]);
    setCurrentDay(id);
  };

  const selectCurrentDay = (id) => {
    setCurrentDay(id);
  };

  const addNewAction = (e, id) => {
    e.preventDefault();
    const newDays = days.map((d) => {
      if (d.id === id) {
        d.actions = [...d.actions, newAction];
      }
      return d;
    });
    setDays(newDays);
    localStore.setItem('days', newDays);
    setNewAction({ id: uuidv4(), description: '', time: '' });
  };

  return (
    <div>
      <ul>
        {days.map((d) => (
          <li key={d.id} onClick={() => selectCurrentDay(d.id)}>
            Date: {d.date.toLocaleString('ru', dateOptions)} Time sum:
            {d.actions.length &&
              d.actions.map((a) => a.time).reduce((acc, a) => timeSum(a, acc))}
            {currentDay === d.id ? ' << Current day' : ''}
            {currentDay === d.id && (
              <div>
                <ul>
                  {d.actions.map((a) => (
                    <li key={a.id}>
                      Description: {a.description} Time: {a.time}
                    </li>
                  ))}
                </ul>
                <form type="submit" onSubmit={(e) => addNewAction(e, d.id)}>
                  <input
                    type="text"
                    placeholder="Description"
                    value={newAction.description}
                    onChange={(e) => {
                      setNewAction({
                        ...newAction,
                        description: e.target.value,
                      });
                    }}
                  />
                  <input
                    type="time"
                    value={newAction.time}
                    onChange={(e) => {
                      setNewAction({
                        ...newAction,
                        time: e.target.value,
                      });
                    }}
                  />
                  <input type="submit" value="Add" />
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
      <input type="button" value="New day" onClick={() => addNewDay()} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
