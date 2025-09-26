import { IDependencies } from "../types";

export default class IndexJson {
    private _dependencies: IDependencies;
    private _obj = {
        game: "minecraft",
        formatVersion: 1,
        name: "",
        version: "",
        summary: "",
    };

    private _checkIncapableDep(dependencies: IDependencies) {
        if (dependencies["neo-forge"] && dependencies.neoforge) {
            throw new ReferenceError("Cannot have both neo-forge and neoforge dependencies! Use only one of them.");
        }
        if (Object.keys(dependencies).length === 0) {
            throw new ReferenceError("Cannot have empty dependencies!");
        }
        if (!dependencies.minecraft) {
            throw new ReferenceError("Cannot have no minecraft dependency!");
        }
        if (Object.keys(dependencies).length >= 2) {
            throw new ReferenceError("Cannot have more than one loader!");
        }
    }
    private _getMCVersion() {
        return this._dependencies.minecraft;
    }
    private _getLoaderName() {
        const dependencies = this._dependencies;
        if (dependencies.forge) {
            return "Forge";
        }
        if (dependencies.neoforge || dependencies["neo-forge"]) {
            return "NeoForge";
        }
        if (dependencies["fabric-loader"]) {
            return "Fabric";
        }
        if (dependencies["quilt-loader"]) {
            return "Quilt";
        }
    }
    private _getLoaderVersion() {
        const dependencies = this._dependencies;
        if (dependencies.forge) {
            return dependencies.forge;
        }
        if (dependencies.neoforge || dependencies["neo-forge"]) {
            return dependencies.neoforge || dependencies["neo-forge"];
        }
        if (dependencies["fabric-loader"]) {
            return dependencies["fabric-loader"];
        }
        if (dependencies["quilt-loader"]) {
            return dependencies["quilt-loader"];
        }
    }

    constructor(name: string, version: string, dependencies: IDependencies, summary?: string) {
        this._obj.name = name;
        this._obj.version = version;
        this._checkIncapableDep(dependencies);
        this._dependencies = dependencies;
        this._obj.summary = summary || `${this._getMCVersion()}, ${this._getLoaderName()} ${this._getLoaderVersion()}`;
    }
}
