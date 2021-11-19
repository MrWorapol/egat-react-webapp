import { atom } from "recoil";

export interface IPackage {
    id: string,
    title: string,
    active: boolean,
    timestamp: Date
}

export interface IGridPackage {
    defaultPackage: string,
    packages: IPackage[]
}

export const gridUsedPackageState = atom<IGridPackage | null>({
    key: 'gridUsedPackageState',
    default: null,
})