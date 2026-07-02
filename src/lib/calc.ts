import { DISTANCES, GroupLabels, type Prediction} from "./models.ts";
import { COEFFICIENTS } from "./coefficients.ts";

export function parseTime(raw: string): number {              // "2:04.3" | "63.5" -> seconds
    const parts = String(raw).trim().replace(",", ".").split(":").map(Number);
    if (!parts.length || parts.some(Number.isNaN)) return NaN;
    return parts.reduce((acc, p) => acc * 60 + p, 0)
}

export function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds)) return "–";
    let minutes = Math.floor(seconds / 60);
    let remainder = seconds - minutes * 60;
    if (seconds < 70) {
        return `${(seconds).toFixed(2).padStart(4, "0")}`;
    }
    if (minutes == 0) {
        return `${(remainder).toFixed(2).padStart(4, "0")}`;
    }
    return `${minutes}:${(remainder).toFixed(2).padStart(5, "0")}`;
}

export const pacePer100 = (timeSec: number, distM: number) => timeSec / (distM / 100);

export const pairKey = (a: number, b: number) => `${Math.min(a, b)}-${Math.max(a, b)}`;


export function predict(group: string, sourceDistance: number, sourceTime: number, targetDistance: number): Prediction | null {
    if (!DISTANCES.includes(sourceDistance) || !DISTANCES.includes(targetDistance) || !Object.keys(GroupLabels).includes(group)) {
        return null;
    }
    let i = DISTANCES.indexOf(sourceDistance);
    const target = DISTANCES.indexOf(targetDistance);
    let pace = pacePer100(sourceTime, sourceDistance);
    let min_pace = pace;
    let max_pace = pace;

    if (i == target) {
        return { time: sourceTime, min_time: sourceTime, max_time: sourceTime };
    }
    const step = target > i ? +1 : -1;

    while (i != target) {
        // @ts-ignore
        let statistic = COEFFICIENTS[pairKey(DISTANCES[i], DISTANCES[i + step])][group];
        if (!statistic) return null;
        pace = step > 0 ? pace / statistic.coefficient : pace * statistic.coefficient;
        min_pace = step > 0 ? min_pace / statistic.max: min_pace * statistic.min;
        max_pace = step > 0 ? max_pace / statistic.min: max_pace * statistic.max;
        i += step;
    }

    return {
        time: pace * (targetDistance / 100),
        min_time: min_pace * (targetDistance / 100),
        max_time: max_pace * (targetDistance / 100)
    }
}

export function personalCoefficient(shortDistance: number, shortTime: number, longDistance: number, longTime: number): number {
    return pacePer100(shortTime, shortDistance) / pacePer100(longTime, longDistance);
}
