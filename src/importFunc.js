//sorts dates
function sortByDates(input) {
  input.sort(
    (d1, d2) => new Date(d1.dueDate).getTime() - new Date(d2.dueDate).getTime()
  );
  return input;
}

export { sortByDates };
