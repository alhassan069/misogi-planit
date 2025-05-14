import { SectionCards } from "@/components/shadcn_components/section-cards";
import { ChartAreaInteractive } from "@/components/shadcn_components/chart-area-interactive";
import { DataTable } from "@/components/shadcn_components/data-table";
import data from "./data.json";

const Dashboard = () => {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
        </div>
    );
};

export default Dashboard;