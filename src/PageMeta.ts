
type Script = {
    id: string,
}

export type Page = {
    title: string,
    description: string,
    scripts?: Script[],
}

type RenderFunction = (...args: unknown[]) => Promise<Record<string, unknown>>;

export function PageMeta(meta: Page) {
    return (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<RenderFunction>) => {
        const original = descriptor.value as RenderFunction;
        descriptor.value = async function(...args) {
            const val = await original.call(this, ...args);
            return {
                page: meta,
                ...val,
            };
        };
        return descriptor;
    };
}