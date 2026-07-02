import {
    ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { pacePer100 } from "../lib/calc.js";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";


export type Point = {distance: number, time: number, min_time: number, max_time: number, isSource: boolean}

export default function PredictionChart({ points }: { points: Point[] }) {
    const data = points
        .filter((point) => point && Number.isFinite(point.time))
        .sort((a, b) => a.distance - b.distance)
        .map((point) => ({
            distance: point.distance,
            isSource: point.isSource,
            value: pacePer100(point.time, point.distance),
            band: [pacePer100(point.min_time, point.distance), pacePer100(point.max_time, point.distance)],
        }));

    // source = hollow marker, predictions = filled
    const renderDot = (props: any) => {
        const { cx, cy, payload } = props;
        return payload.isSource ? (
            <circle cx={cx} cy={cy} r={4} fill="var(--color-surface)"
                    stroke="var(--color-accent)" strokeWidth={2} />
        ) : (
            <circle cx={cx} cy={cy} r={4} fill="var(--color-accent)" />
        );
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
                <XAxis dataKey="distance" tickFormatter={(d) => `${d}m`}
                       tick={{ fontSize: 9 }} stroke="var(--color-line-strong)" />
                <YAxis width={40} tick={{ fontSize: 11 }} stroke="var(--color-line-strong)"
                       tickFormatter={(v) => `${v.toFixed(0)}s`} />
                <Tooltip
                    labelFormatter={(distance) => `${distance}m`}
                    formatter={
                        (value: ValueType | undefined) => {
                            if (typeof value == "number") {
                                return [`${value.toFixed(1)}s`, "pace/100m"];
                            } else if (Array.isArray(value)) {
                                return [`${value[0].toFixed(1)}s-${value[1].toFixed(1)}s`, "min-max"]
                            } else {
                                return ["this case shouldn't be reachable", "something went wrong"];
                            }
                        }
                    }
                />

                <Area dataKey="band" stroke="none" fill="var(--color-accent)"
                      fillOpacity={0.1} isAnimationActive={false} />
                <Line dataKey="value" stroke="var(--color-accent)" strokeWidth={2}
                      dot={renderDot} isAnimationActive={false} />
            </ComposedChart>
        </ResponsiveContainer>
    );
}