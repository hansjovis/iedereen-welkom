const MillisecondsInSecond = 1000;
const SecondsInMinute = 60;
const MinutesInHour = 60;
const HoursInDay = 24;

const MsInSecond = MillisecondsInSecond;
const MsInMinute = MillisecondsInSecond * SecondsInMinute;
const MsInHour = MillisecondsInSecond * SecondsInMinute * MinutesInHour;
const MsInDays = MillisecondsInSecond * SecondsInMinute * MinutesInHour * HoursInDay;

export class Duration {
    constructor(
        public readonly inMilliseconds: number
    ) {}

    static parse(str: string): Duration {
        const [amountStr, unitStr] = str.split(" ");
        const amount = parseFloat(amountStr);
        switch (unitStr) {
            case "seconds": return new Duration(MsInSecond * amount);
            case "minutes": return new Duration(MsInMinute * amount);
            case "hours": return new Duration(MsInHour * amount);
            case "days": return new Duration(MsInDays * amount);
        }
        throw new Error(`"${str}" could not be parsed into a valid duration.`);
    }

    get inSeconds(): number {
        return Math.floor(this.inMilliseconds / MsInSecond);
    }

    get inMinutes(): number {
        return Math.floor(this.inMilliseconds / MsInMinute);
    }

    get inHours(): number {
        return Math.floor(this.inMilliseconds / MsInHour);
    }

    get inDays(): number {
        return Math.floor(this.inMilliseconds / MsInDays);
    }

    toString(): string {
        const [daysStr, remainder1] = this.toDurationString(this.inMilliseconds, MsInDays, "days");
        const [hoursStr, remainder2] = this.toDurationString(remainder1, MsInHour, "hours");
        const [minuteStr, remainder3] = this.toDurationString(remainder2, MsInMinute, "minutes");
        const [secondsStr, remainder4] = this.toDurationString(remainder3, MsInSecond, "seconds");

        let millisecondsStr = "";
        if (remainder4 > 0) {
            millisecondsStr = `${remainder4} milliseconds`;
        }

        return [daysStr, hoursStr, minuteStr, secondsStr, millisecondsStr].filter(Boolean).join(", ");
    }

    private toDurationString(milliseconds: number, msInPeriod: number, periodName: string): [string, number] {
        const nrOfPeriods = Math.floor(milliseconds / msInPeriod);
        const remainder = milliseconds - (nrOfPeriods * msInPeriod);
        let str = "";
        if (nrOfPeriods > 0) {
            // E.g. "5 days" or "3 hours" etc.
            str = `${nrOfPeriods} ${periodName}`;
        }
        return [str, remainder];
    }
}