declare global {
    // prettier-ignore
    // noinspection ES6ConvertVarToLetConst - "var" is needed for global scope
    var bru: {
        cwd(): string;
        setVar(key: string, value: string): void;
    } | undefined;
}

export {};
