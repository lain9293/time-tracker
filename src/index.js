import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import uuidv4 from './utils/uuid.js'
import localStore from './utils/localStorage.js'
import timeSum from './utils/timeCalc.js'

const App = () => {
  const [days, setDays] = useState(localStore.getItem('days', 'Array'))
  const [newDay, setNewDay] = useState(new Date())
  const [currentDay, setCurrentDay] = useState('')
  const [newAction, setNewAction] = useState({
    id: uuidv4(),
    description: '',
    time: '',
    hide: false,
  })

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const addNewDay = () => {
    const id = uuidv4()
    const newDays = [...days, { id, date: newDay, actions: [] }]
    setDays(newDays)
    setCurrentDay(id)
    localStore.setItem('days', newDays)
  }

  const selectCurrentDay = (id) => {
    if (currentDay === id) {
      setCurrentDay('')
    } else {
      setCurrentDay(id)
    }
  }

  const addNewAction = (e, id) => {
    e.preventDefault()
    const newDays = days.map((d) => {
      if (d.id === id) {
        d.actions = [...d.actions, newAction]
      }
      return d
    })
    setDays(newDays)
    localStore.setItem('days', newDays)
    setNewAction({ id: uuidv4(), description: '', time: '' })
  }

  const deleteDay = (id) => {
    const newDays = days.filter((d) => d.id !== id)
    setDays(newDays)
    localStore.setItem('days', newDays)
  }

  const hideTo = (id) => {
    const newDays = [...days];
    for (let i = 0; i < newDays.length; i++) {
      if (newDays[i].id !== id) {
        newDays[i].hide = true;
      }
      else {
        newDays[i].hide = true;
        break;
      }
    }
    setDays(newDays)
    localStore.setItem('days', newDays)
  }

  const showHidden = () => {
    const newDays = days.map((d) => {
      d.hide = false;
      return d;
    })
    setDays(newDays)
    localStore.setItem('days', newDays)
  }

  const deleteActive = (idDay, idActive) => {
    const newDays = days.map((d) => {
      if (d.id === idDay) {
        d.actions = d.actions.filter((a) => a.id !== idActive)
      }
      return d
    })
    setDays(newDays)
    localStore.setItem('days', newDays)
  }

  const formatDate = (date) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleString('ru', dateOptions)
    }
    return date.toLocaleString('ru', dateOptions)
  }

  return (
    <div>
      {days.some(d => d.hide) && (<input
        type="button"
        value="Показать скрытые"
        onClick={() => showHidden()}
      />)}
      <ul>
        {days.filter(d => !d.hide).map((d) => (
          <li key={d.id}>
            <span onClick={() => selectCurrentDay(d.id)}>
              Дата: {formatDate(d.date)} Сумма времени:
              {d.actions.length &&
                d.actions
                  .map((a) => a.time)
                  .reduce((acc, a) => timeSum(a, acc))}
            </span>
            {currentDay === d.id ? (
              <span>
                <input
                  type="button"
                  value="Удалить день"
                  onClick={() => deleteDay(d.id)}
                />
                <input
                  type="button"
                  value="Скрыть до сюда"
                  onClick={() => hideTo(d.id)}
                />
              </span>
            ) : (
              ''
            )}
            {currentDay === d.id && (
              <div>
                <ul>
                  {d.actions.map((a) => (
                    <li key={a.id}>
                      Описание: {a.description} Время: {a.time}
                      <input
                        type="button"
                        value="Удалить активность"
                        onClick={() => deleteActive(d.id, a.id)}
                      />
                    </li>
                  ))}
                </ul>
                <form type="submit" onSubmit={(e) => addNewAction(e, d.id)}>
                  <input
                    type="text"
                    placeholder="Описание"
                    value={newAction.description}
                    onChange={(e) => {
                      setNewAction({
                        ...newAction,
                        description: e.target.value,
                      })
                    }}
                  />
                  <input
                    type="time"
                    value={newAction.time}
                    onChange={(e) => {
                      setNewAction({
                        ...newAction,
                        time: e.target.value,
                      })
                    }}
                  />
                  <input type="submit" value="Добавить" />
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
      <input
        type="date"
        value={newDay}
        onChange={(e) => {
          setNewDay(e.target.value)
        }}
      />
      <input type="button" value="Добавить день" onClick={() => addNewDay()} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
