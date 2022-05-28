/**
 * Ajoute un élément à un tableau en sortant le premier élément si une limite est définie
 */
export function append(items: any[], item: any, limit?: number) {
  const newItems = [...items];
  newItems.push(item);
  if (limit && items.length > limit) {
    newItems.shift();
  }
  return newItems;
}
