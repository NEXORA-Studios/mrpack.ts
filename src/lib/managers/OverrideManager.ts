import { Override } from "../../components";

export class OverrideManager {
    private _overrides: Override[] = [];

    public addOverride(override: Override): void {
        if (!override || !(override instanceof Override)) {
            throw new Error('Override must be an instance of Override class');
        }
        this._overrides.push(override);
    }

    public getSingleOverride(filePath: string): Override | undefined {
        if (!filePath || typeof filePath !== 'string') {
            throw new Error('File path must be a non-empty string');
        }
        return this._overrides.find((override) => override.filePath === filePath);
    }
}
