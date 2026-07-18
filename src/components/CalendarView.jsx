import React from 'react';

function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows = [];
  let cells = [];
  // Fill initial empty cells
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
    if (cells.length === 7) {
      rows.push(cells);
      cells = [];
    }
  }
  while (cells.length < 7) cells.push(null);
  rows.push(cells);
  return rows;
}

export default function CalendarView({ todos = [], monthOffset = 0 }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + monthOffset;
  const matrix = getMonthMatrix(year, month);

  const tasksByDate = todos.reduce((map, t) => {
    if (!t.dueDate) return map;
    const d = new Date(t.dueDate);
    const key = d.toDateString();
    (map[key] ||= []).push(t);
    return map;
  }, {});

  return (
    <div className="calendar">
      <div className="calendar__header">{new Date(year, month).toLocaleString([], { month: 'long', year: 'numeric' })}</div>
      <div className="calendar__grid">
        <div className="calendar__weekday">Sun</div>
        <div className="calendar__weekday">Mon</div>
        <div className="calendar__weekday">Tue</div>
        <div className="calendar__weekday">Wed</div>
        <div className="calendar__weekday">Thu</div>
        <div className="calendar__weekday">Fri</div>
        <div className="calendar__weekday">Sat</div>
        {matrix.map((week, i) => (
          <React.Fragment key={i}>
            {week.map((day, j) => {
              const key = day ? day.toDateString() : `empty-${i}-${j}`;
              const tasks = day ? tasksByDate[day.toDateString()] || [] : [];
              return (
                <div key={key} className={`calendar__cell ${day ? '' : 'calendar__cell--empty'}`}>
                  {day && <div className="calendar__day">{day.getDate()}</div>}
                  {tasks.length > 0 && (
                    <div className="calendar__dots">
                      {tasks.slice(0,3).map((t) => (
                        <span key={t.id} className="calendar__dot" title={t.text}></span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
