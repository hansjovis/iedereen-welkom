export function kebabCase(str: string): string {
    return str.toLocaleLowerCase().replace(/\s+/, "-");
}