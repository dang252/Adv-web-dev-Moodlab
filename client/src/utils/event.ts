let eventGuid = 0;
const todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: "Testing event 1",
    start: todayStr,
  },
  {
    id: createEventId(),
    title: "Testing event 2",
    start: todayStr + "T12:00:00",
  },
];

export function createEventId() {
  return String(eventGuid++);
}
