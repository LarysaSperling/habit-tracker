import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HabitChart({ moodCorrelation }) {
  const labels = moodCorrelation.map((item) => item.difficulty);

  const data = {
    labels,
    datasets: [
      {
        label: "Average mood",
        data: moodCorrelation.map((item) => item.averageMood)
      }
    ]
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Mood by Difficulty</h2>
      <Bar data={data} />
    </div>
  );
}

export default HabitChart;