import { css } from "uebersicht"

const options = {
  top: "15px",
  left: "20px",
  width: "20vw",
  height: "40vw",
};

export const command = "/opt/homebrew/bin/icalBuddy -ea -nrd -npn -b '' -iep 'title,datetime' -ps '|-|' -tf '%H:%M' -df '%b %d, %Y' eventsToday+14";

export const refreshFrequency = 1000;

export const className = css({
  left: options.left,
  top: options.top,
  width: options.width,
  color: "white"
});

const holder = css({
  fontFamily: "Maple Mono",
  fontStyle: " italic",
  fontSize: "14px",
  // textAlign: "center",
  color: "#a1a1a1",

  borderRadius: "25px",
  // border: "1px solid white",
  // backgroundColor: "#2e2e2e"
});

const date = css({
  fontStyle: "normal",
  color: "#ff453a",
  fontSize: "12px"
});

const title = css({
  fontStyle: "italic",
  color: "#ff453a",
  fontSize: "12px"
});

const countDown = css({
  color: "#61d290"
})

// const boxes = css({
//   display: "grid",
//   gridTemplateColumns: "100%",
//   gridTemplateRows: "25%",
//   gap: "10px",
//   borderRadius: "25px",
//   // backgroundColor: "#2e2e2e",
//   padding: "5px",
//   margin: "5px",
//   height: `calc(${options.height} - 20px)`
// });

// const box = css({
//   borderRadius: "25px",
//   backgroundColor: "#2e2e2e",
//   textAlign: "center",
//   padding: "5px",
// });


export const render = ( {output} ) => {
  const todayDate = new Date();
  const calendar = [];

  const events = output.split("\n");

  for (let i = 0; i < events.length - 1; i++) {
    let concepts = (events[i].split(/at|[-()]/)).map( item => item.replace(/^\s*|\s*$/g,""));
    
    calendar.push({
      title: concepts[0],
      type: concepts[1],
      date: concepts[3],
      start: concepts[4],
      end: concepts[5]
    });
  }

  const todayEvents = [];
  
  for (let i = 0; i < calendar.length; i++) {
    let timeDiff = Math.ceil((new Date(calendar[i].date) - todayDate)/(1000 * 60 * 60 * 24));
    if (timeDiff == 0 && calendar[i].type === "LEC&TUT") {
      todayEvents.push(calendar[i]);
    }
  }

  const assignments = [];

  for (let i = 0; i < calendar.length; i++) {
    if (calendar[i].title.includes("Assignment")) {
      assignments.push(calendar[i]);
    }
  }

  const labs = [];
  for (let i = 0; i < calendar.length; i++) {
    if (calendar[i].title.includes("Lab")) {
      labs.push(calendar[i]);
    }
  }
  

  const tests = [];

  for (let i = 0; i < calendar.length; i++) {
    if (calendar[i].title.includes("Test") || calendar[i].title.includes("Quiz")) {
      tests.push(calendar[i]);
    }
  }

  function Today() {

    if (todayEvents == []) {
      return <div>Today is clear</div>
    }
    return (
      todayEvents.map( event =>
        <div>{event.title}
          <div>{event.start} - {event.end}</div></div>)
    )
  }
  
  return (
    <div className={holder}>
      <div className={date}>{todayDate.toDateString()}</div>
      <div className={title}> Today:</div>
      <Today></Today>
      <br/>

      <div className={title}>Labs:</div>
      {labs.map( event =>
        <div>{event.title}
          <div>{event.date} in <b className={countDown}>{Math.ceil((new Date(event.date) - todayDate)/(1000 * 60 * 60 * 24))} d</b></div></div>)}
      <br/>
      
      <div className={title}>Assignments:</div>
      {assignments.map( event =>
        <div>{event.title}
          <div>{event.date} in <b className={countDown}>{Math.ceil((new Date(event.date) - todayDate)/(1000 * 60 * 60 * 24))} d</b></div></div>)}

      <br/>
      <div className={title}>Test/Quiz:</div>
       {tests.map( event =>
        <div>{event.title}
          <div>{event.date} in <b className={countDown}>{Math.ceil((new Date(event.date) - todayDate)/(1000 * 60 * 60 * 24))} d</b></div></div>)}
    </div>
  )
}
