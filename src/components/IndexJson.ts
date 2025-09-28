import type { IDependencies, IFile, IIndexJsonObject } from "../types";
import { IndexJsonFile } from ".";

export class IndexJson {
    private _base = {
        game: "minecraft" as const,
        formatVersion: 1 as const,
        name: "",
        version: "",
        summary: "",
    };
    private _dependencies: IDependencies;
    private _base_files: IFile[] = [];

    private _checkIncapableDep(dependencies: IDependencies): void {
        if (!dependencies || typeof dependencies !== "object") {
            throw new Error("Dependencies must be an object");
        }

        if (dependencies["neo-forge"] && dependencies.neoforge) {
            throw new Error("Cannot have both neo-forge and neoforge dependencies! Use only one of them.");
        }
        if (Object.keys(dependencies).length === 0) {
            throw new Error("Cannot have empty dependencies!");
        }
        if (!dependencies.minecraft) {
            throw new Error("Cannot have no minecraft dependency!");
        }

        // 检查loader依赖数量，排除minecraft
        const nonMinecraftDeps = Object.keys(dependencies).filter((key) => key !== "minecraft");
        if (nonMinecraftDeps.length >= 2) {
            throw new Error("Cannot have more than one loader dependency!");
        }
    }

    private _getMCVersion(): string {
        return this._dependencies.minecraft;
    }

    private _getLoaderName(): string {
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
        throw new Error("No valid loader dependency found");
    }

    private _getLoaderVersion(): string {
        const dependencies = this._dependencies;
        if (dependencies.forge) {
            return dependencies.forge;
        }
        if (dependencies.neoforge) {
            return dependencies.neoforge;
        }
        if (dependencies["neo-forge"]) {
            return dependencies["neo-forge"];
        }
        if (dependencies["fabric-loader"]) {
            return dependencies["fabric-loader"];
        }
        if (dependencies["quilt-loader"]) {
            return dependencies["quilt-loader"];
        }
        throw new Error("No valid loader version found");
    }

    constructor(name: string, version: string, dependencies: IDependencies, summary?: string) {
        if (!name || typeof name !== "string") {
            throw new Error("Name must be a non-empty string");
        }
        if (!version || typeof version !== "string") {
            throw new Error("Version must be a non-empty string");
        }

        this._base.name = name;
        this._base.version = version;
        this._checkIncapableDep(dependencies);
        this._dependencies = dependencies;

        // 尝试获取loader信息，但如果没有也不报错
        if (summary) {
            this._base.summary = summary;
        } else {
            try {
                this._base.summary = `${this._getMCVersion()}, ${this._getLoaderName()} ${this._getLoaderVersion()}`;
            } catch {
                this._base.summary = `${this._getMCVersion()}`;
            }
        }
    }

    public addFile(file: IndexJsonFile): void {
        if (!file || !(file instanceof IndexJsonFile)) {
            throw new Error("File must be an instance of IndexJsonFile");
        }
        this._base_files.push(file.marshaledJson);
    }

    public get marshaledJson(): IIndexJsonObject {
        if (this._base_files.length === 0) {
            throw new Error("No files have been added to the index");
        }

        return {
            ...this._base,
            dependencies: this._dependencies,
            files: this._base_files,
        };
    }
}
