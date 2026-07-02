export const DISTANCES: number[] = [100, 200, 400, 800, 1500, 3000, 5000, 10000];

export const GroupLabels = {
    "mU18": "Men U18",
    "mU20": "Men U20",
    "mU23": "Men U23",
    "M": "Men (senior)",
    "wU18": "Women U18",
    "wU20": "Women U20",
    "wU23": "Women U23",
    "F": "Women (senior)",
}

export type Statistics = {
    coefficient: number,
    variance: number,
    sd: number,
    min: number,
    max: number
}

export type Prediction = {
    time: number,
    min_time: number,
    max_time: number
}
