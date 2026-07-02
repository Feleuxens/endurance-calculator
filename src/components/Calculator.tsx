import { useState } from "react";
import {DISTANCES, GroupLabels, type Prediction, type Statistics} from "../lib/models.ts";
import { predict, parseTime, formatTime, pairKey } from "../lib/calc.js";
import {COEFFICIENTS} from "../lib/coefficients.ts";
import PredictionChart, {type Point} from "./PredictionChart.tsx";

function buildPoints(group: string, sourceDistance: number, sourceTime: number): Point[] {
    const source = {
        distance: sourceDistance,
        time: sourceTime,
        min_time: sourceTime,
        max_time: sourceTime,
        isSource: true,
    };
    let result = [source];

    for (let distance of DISTANCES) {
        if (distance == sourceDistance) continue;

        let r = predict(group, sourceDistance, sourceTime, distance);
        if (r) {
            result.push({
                distance: distance,
                time: r.time,
                min_time: r.min_time,
                max_time: r.max_time,
                isSource: false,
            })
        }
    }
    return result;
}

export default function Calculator() {
    const [group, setGroup] = useState("M");
    const [sourceDistance, setSourceDistance] = useState(800);
    const [timeString, setTimeString] = useState("2:00.0");
    const sourceDistanceIndex = DISTANCES.indexOf(sourceDistance);
    let lower_prediction: Prediction | null = null;
    let higher_prediction: Prediction | null = null;
    let lower_parameters: Statistics | null = null;
    let higher_parameters: Statistics | null = null;
    if (sourceDistanceIndex != 0) {
        lower_prediction = predict(group, sourceDistance, parseTime(timeString), DISTANCES[sourceDistanceIndex - 1]);
        lower_parameters = COEFFICIENTS[pairKey(DISTANCES[sourceDistanceIndex], DISTANCES[sourceDistanceIndex - 1])][group];
    }
    if (sourceDistanceIndex + 1 != DISTANCES.length) {
        higher_prediction = predict(group, sourceDistance, parseTime(timeString), DISTANCES[sourceDistanceIndex + 1]);
        higher_parameters = COEFFICIENTS[pairKey(DISTANCES[sourceDistanceIndex], DISTANCES[sourceDistanceIndex + 1])][group];
    }
    let formatted_lower_time = !lower_prediction ? "n/a" : formatTime(lower_prediction.time);
    let formatted_lower_time_range = !lower_prediction ? "-" : formatTime(lower_prediction.min_time) + " - " + formatTime(lower_prediction.max_time);
    let formatted_higher_time = !higher_prediction ? "n/a" : formatTime(higher_prediction.time);
    let formatted_higher_time_range = !higher_prediction ? "-" : formatTime(higher_prediction.min_time) + " - " + formatTime(higher_prediction.max_time);

    return (
        <div className="grid md:grid-cols-2">
            <div className="p-6 md:border-r border-line space-y-4">
                <div>
                    <label className="field-label">Age group / sex</label>
                    <select className="control w-full" value={group}
                            onChange={(e) => setGroup(e.target.value)}>
                        {Object.keys(GroupLabels).map((group) => <option key={group} value={group}>{group}</option>)}
                    </select>
                </div>
                <div>
                    <label className="field-label">Reference distance</label>
                    <select className="control w-full" value={sourceDistance}
                            onChange={(e) => setSourceDistance(Number(e.target.value))}>
                        {DISTANCES.map((d) => <option key={d} value={d}>{d}m</option>)}
                    </select>
                </div>
                <div>
                    <label className="field-label">Reference time</label>
                    <input className="control control--time w-full" value={timeString}
                           onChange={(e) => setTimeString(e.target.value)}/>
                </div>

                <div className="mt-6 pt-5 grid grid-cols-2 border-t border-line">
                    {sourceDistanceIndex != 0 &&
                        <div>
                            <p className="metric-label">Coefficient · {DISTANCES[sourceDistanceIndex - 1]}-{sourceDistance}</p>
                            <p className="metric-value mt-0.5">{lower_parameters ? lower_parameters.coefficient : "n/a"}</p>
                        </div>
                    }{sourceDistanceIndex == 0 && <div></div>}
                    {sourceDistanceIndex + 1 != DISTANCES.length &&
                        <div>
                            <p className="metric-label">Coefficient · {sourceDistance}-{DISTANCES[sourceDistanceIndex + 1]}</p>
                            <p className="metric-value mt-0.5">{higher_parameters ? higher_parameters.coefficient : "n/a"}</p>
                        </div>
                    }
                </div>

            </div>


            <div className="p-4">
                <div className="mb-4">
                    <p className="section-eyebrow">Result</p>
                    <h2 className="text-[15px] font-semibold mt-1">Predicted times</h2>
                </div>

                <div className="space-y-4">
                    {sourceDistanceIndex != 0 &&
                        <div>
                            <p className="metric-label">{DISTANCES[sourceDistanceIndex - 1]}m</p>
                            <p className="metric-value">{formatted_lower_time}</p>
                            <p className="metric-range">min–max&nbsp; {formatted_lower_time_range}</p>
                        </div>
                    }
                    <div>
                        <p className="metric-label">{sourceDistance}m · reference</p>
                        <p className="metric-value">{formatTime(parseTime(timeString))}</p>
                    </div>
                    {sourceDistanceIndex + 1 != DISTANCES.length &&
                        <div>
                            <p className="metric-label">{DISTANCES[sourceDistanceIndex + 1]}m</p>
                            <p className="metric-value">{formatted_higher_time}</p>
                            <p className="metric-range">min–max&nbsp; {formatted_higher_time_range}</p>
                        </div>
                    }
                </div>

                <div className="pt-4">
                    <p className="metric-label">Pace per 100m</p>
                    <PredictionChart points={buildPoints(group, sourceDistance, parseTime(timeString))} />
                </div>

            </div>
        </div>
    );
}