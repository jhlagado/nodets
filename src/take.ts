// import { CB, Mode, Proc, send, State } from "./common";

// interface TakeState extends State {
//     max: number;
//     talkback?: CB;
//     vars: {
//         taken: number;
//         end: boolean;
//     }
// }

// const takeSourceProc: Proc = (state, type, data) => {
//     const tkState = state as TakeState;
//     if (type === Mode.INIT) tkState.talkback = data as CB;
//     if (type === Mode.RUN) tkState.operation(data as string);
//     if ((type === Mode.RUN || type === Mode.INIT) && tkState.talkback) send(tkState.talkback, Mode.RUN);

//       if (type === Mode.DESTROY) {
//         tkState.vars.end = true;
//         if (tkState.talkback) send(tkState.talkback, Mode.RUN);
//       } else if (taken < max) {talkback(t, d);}
// };

// export const take = (max: number) => (source: CB) => {
//     const state: TakeState = {
//         max,
//     };
//     const tb = { state, proc: takeSourceProc };
//     send(source, Mode.INIT, tb);
// };

function talkback(state, t, d) {
    if (t === 2) {
      end = true;
      sourceTalkback(t, d);
    } else if (taken < max) sourceTalkback(t, d);
  }


  const take3 = max => source => (start, sink) => {
    if (start !== 0) return;
    let taken = 0;
    let sourceTalkback;
    let end;
    source(0, (t, d) => {
      if (t === 0) {
        sourceTalkback = d;
        sink(0, talkback);
      } else if (t === 1) {
        if (taken < max) {
          taken++;
          sink(t, d);
          if (taken === max && !end) {
            end = true
            sourceTalkback(2);
            sink(2);
          }
        }
      } else {
        sink(t, d);
      }
    });
  };
  const takeProc = max => source => (start, sink) => {
    if (start !== 0) return;
    let taken = 0;
    let sourceTalkback;
    let end;
    source(0, (t, d) => {
      if (t === 0) {
        sourceTalkback = d;
        sink(0, talkback);
      } else if (t === 1) {
        if (taken < max) {
          taken++;
          sink(t, d);
          if (taken === max && !end) {
            end = true
            sourceTalkback(2);
            sink(2);
          }
        }
      } else {
        sink(t, d);
      }
    });
  };
  
  
  const take = max =>  {
    state: {
        max,
    }
    return {
        state,
        proc: takeProc,
    }

    if (start !== 0) return;
    let taken = 0;
    let sourceTalkback;
    let end;
    source(0, (t, d) => {
      if (t === 0) {
        sourceTalkback = d;
        sink(0, talkback);
      } else if (t === 1) {
        if (taken < max) {
          taken++;
          sink(t, d);
          if (taken === max && !end) {
            end = true
            sourceTalkback(2);
            sink(2);
          }
        }
      } else {
        sink(t, d);
      }
    });
  };
  


// const take = max => source => (start, sink) => {
//     if (start !== 0) return;
//     let taken = 0;
//     let sourceTalkback;
//     let end;
//     function talkback(t, d) {
//       if (t === 2) {
//         end = true;
//         sourceTalkback(t, d);
//       } else if (taken < max) sourceTalkback(t, d);
//     }
//     source(0, (t, d) => {
//       if (t === 0) {
//         sourceTalkback = d;
//         sink(0, talkback);
//       } else if (t === 1) {
//         if (taken < max) {
//           taken++;
//           sink(t, d);
//           if (taken === max && !end) {
//             end = true
//             sourceTalkback(2);
//             sink(2);
//           }
//         }
//       } else {
//         sink(t, d);
//       }
//     });
//   };
  