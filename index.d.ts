/**
 * Interface for the calcSwitcher function.
 */
interface ICalcSwitcher {
    (activeBtn: HTMLButtonElement | null, targetBtn: HTMLButtonElement): void;
}

export { ICalcSwitcher };
