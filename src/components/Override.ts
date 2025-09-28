import type { IOverrideType } from "../types";

export class Override {
    private _filePath: string;
    private _fileType: IOverrideType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _content: any;

    constructor(filePath: string, fileType: IOverrideType) {
        this._filePath = filePath;
        this._fileType = fileType;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public set content(content: any) {
        this._content = content;
    }

    public get filePath() {
        return this._filePath;
    }

    public get asyncMarshaledContent(): Promise<string | Buffer> {
        if (this._content === undefined) {
            throw new Error(`Content for override "${this._filePath}" is not set`);
        }

        switch (this._fileType) {
            case "buffer":
            case "string":
                return Promise.resolve(this._content);
            case "json":
                return Promise.resolve(JSON.stringify(this._content));
            case "toml":
                try {
                    return import("@iarna/toml").then((toml) => toml.stringify(this._content));
                } catch (error) {
                    throw new Error(
                        `Failed to import or use toml package: ${
                            error instanceof Error ? error.message : String(error)
                        }`
                    );
                }
            default:
                throw new SyntaxError("Inprobable switch branch"); // This should never happen
        }
    }
}
