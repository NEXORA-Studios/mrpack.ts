import type { Override, IndexJsonFile } from "../../components";

export class BasePackage {
    private _name: string;
    private _indexJsonFiles: IndexJsonFile[] = [];
    private _Overrides: Override[] = [];

    constructor(name: string) {
        this._name = name;
    }

    public set AddIndexJsonFile(indexJsonFile: IndexJsonFile) {
        this._indexJsonFiles.push(indexJsonFile);
    }

    public set AddOverride(override: Override) {
        this._Overrides.push(override);
    }

    public get Name() {
        return this._name;
    }

    public get FilesLength() {
        return this._indexJsonFiles.length;
    }

    public get OverridesLength() {
        return this._Overrides.length;
    }

    public get IndexJsonFiles() {
        return this._indexJsonFiles;
    }

    public get Overrides() {
        return this._Overrides;
    }
}
