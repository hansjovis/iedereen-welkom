import { describe, it } from "node:test";
import { expect } from "expect";
import { Duration } from "../dist/modules/auth/index.js";

describe("Duration", () => {
    it("can parse a duration expressed as days as a string", () => {
        const duration = Duration.parse("4.1234 days");
        expect(duration.inDays).toEqual(4.1234);
        expect(duration.inHours).toEqual(98.9616);
        expect(duration.inMinutes).toEqual(5937.696);
        expect(duration.inSeconds).toEqual(356261.76);

        expect(duration.toString()).toEqual("4 days, 2 hours, 57 minutes, 41 seconds, 760 milliseconds");
    });
    
    it("can parse a duration expressed as hours as a string", () => {
        const duration = Duration.parse("3.5 hours");
        expect(duration.inDays).toBeCloseTo(0.145);
        expect(duration.inHours).toEqual(3.5);
        expect(duration.inMinutes).toEqual(3.5 * 60);
        expect(duration.inSeconds).toEqual(3.5 * 60 * 60);

        expect(duration.toString()).toEqual("3 hours, 30 minutes");
    });

    it("can parse a duration expressed as minutes as a string", () => {
        const duration = Duration.parse("15 minutes");
        expect(duration.inDays).toBeCloseTo(0.0104);
        expect(duration.inHours).toEqual(0.25);
        expect(duration.inMinutes).toEqual(15);
        expect(duration.inSeconds).toEqual(15 * 60);

        expect(duration.toString()).toEqual("15 minutes");
    });

    it("can parse a duration expressed as seconds as a string", () => {
        const duration = Duration.parse("20 seconds");
        expect(duration.inDays).toBeCloseTo(0.00023);
        expect(duration.inHours).toBeCloseTo(0.0055);
        expect(duration.inMinutes).toBeCloseTo(0.3333);
        expect(duration.inSeconds).toEqual(20);

        expect(duration.toString()).toEqual("20 seconds");
    });

    it("cannot parse an invalid duration string", () => {
        const createInvalidDuration = () => Duration.parse("30 second");
        expect(createInvalidDuration).toThrow();
    });
});