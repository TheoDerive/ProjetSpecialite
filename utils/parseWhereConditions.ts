export function parseWhereConditions(name: string, value: any): string {
  if (typeof value === "number") {
    return `${name} = ${value}`;
  } else if (typeof value === "string") {
    return `${name} = '${value}'`;
  } else {
    return `${name} = ${value}`;
  }
}
