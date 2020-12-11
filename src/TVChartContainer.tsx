import * as React from "react";
import { createChart, IChartApi, SeriesMarker } from "lightweight-charts";
import data from "./data";

export interface IAppProps {}

export function TVChartContainer(props: IAppProps) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [chart, updateChart] = React.useState<IChartApi>();

	React.useEffect(() => {
		if (containerRef.current) {
			updateChart(
				createChart(containerRef.current, {
					width: 600,
					height: 300,
					timeScale: {
						timeVisible: true,
						borderColor: "#D1D4DC",
					},
					rightPriceScale: {
						borderColor: "#D1D4DC",
					},
					layout: {
						backgroundColor: "#ffffff",
						textColor: "#000",
					},
					grid: {
						horzLines: {
							color: "#F0F3FA",
						},
						vertLines: {
							color: "#F0F3FA",
						},
					},
				})
			);
		}
	}, [containerRef]);

	React.useEffect(() => {
		if (chart) {
			console.log("update Chart");

			const series = chart.addCandlestickSeries({
				upColor: "rgb(38,166,154)",
				downColor: "rgb(255,82,82)",
				wickUpColor: "rgb(38,166,154)",
				wickDownColor: "rgb(255,82,82)",
				borderVisible: false,
			});

			series.setData(data);

			const datesForMarkers = [data[data.length - 19], data[data.length - 39]];
			let indexOfMinPrice = 0;
			for (let i = 1; i < datesForMarkers.length; i++) {
				if (datesForMarkers[i].high < datesForMarkers[indexOfMinPrice].high) {
					indexOfMinPrice = i;
				}
			}
			const markers: SeriesMarker<{
				year: number;
				month: number;
				day: number;
			}>[] = [];

			for (let i = 0; i < datesForMarkers.length; i++) {
				if (i !== indexOfMinPrice) {
					markers.push({
						time: datesForMarkers[i].time,
						position: "aboveBar",
						color: "#e91e63",
						shape: "arrowDown",
						text: "Sell @ " + Math.floor(datesForMarkers[i].high + 2),
					});
				} else {
					markers.push({
						time: datesForMarkers[i].time,
						position: "belowBar",
						color: "#2196F3",
						shape: "arrowUp",
						text: "Buy @ " + Math.floor(datesForMarkers[i].low - 2),
					});
				}
			}
			markers.push({
				time: data[data.length - 48].time,
				position: "aboveBar",
				color: "#f68410",
				shape: "circle",
				text: "D",
			});
			series.setMarkers(markers);
		}
	}, [chart]);

	return <div ref={containerRef}></div>;
}
