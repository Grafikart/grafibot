export function randomItem<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error("Cannot pick a random item of an empty array");
  }

  return arr[Math.floor(Math.random() * arr.length)];
}
