export default function toKebabCase(str: string) {
  return str
    .toLocaleLowerCase()
    .split(" ")
    .map((part) => part.trim())
    .join("-");
}
