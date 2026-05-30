import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function HabitChart({ moodCorrelation }) {
  const labels = moodCorrelation.map((item) => item.difficulty);

  const data = {
    labels,
    datasets: [
      {
        label: "Completions",
        data: moodCorrelation.map((item) => item.totalCompletions),
        backgroundColor: [
          "#8b5cf6",
          "#06b6d4",
          "#10b981"
        ],
        borderWidth: 0
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom"
      }
    },
    cutout: "65%"
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">
        Completions by Difficulty
      </h2>

      <div className="mx-auto max-w-sm">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default HabitChart;