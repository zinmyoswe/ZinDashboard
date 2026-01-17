import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ChartAreaLegend } from "@/components/chart-area-legend";
import { ChartAreaLinear } from "@/components/chart-area-linear";
import { ChartBarLabelCustom } from "@/components/chart-bar-label-custom";
import { ChartBarMultiple } from "@/components/chart-bar-multiple";
import { ChartLineMultiple } from "@/components/chart-line-multiple";
import { ChartPieInteractive } from "@/components/chart-pie-interactive";
import { ChartRadarDots } from "@/components/chart-radar-dots";
import { ChartRadialShape } from "@/components/chart-radial-shape";
import { ChartRadialShape2 } from "@/components/chart-radial-shape2";
import { ChartRadialText } from "@/components/chart-radial-text";
import { ChartRadialText2 } from "@/components/chart-radial-text2";
import { ChartTooltipIndicatorLine } from "@/components/chart-tooltip-indicator-line";

const Dashboard = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <div className="bg-muted/50 aspect-video rounded-xl">
             <ChartRadialText />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
            <ChartRadialShape />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
                <ChartRadialText2 />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
            <ChartRadialShape2 />
            </div>
          </div>

          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <ChartAreaInteractive />
          </div>

          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl">
              <ChartTooltipIndicatorLine />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <ChartLineMultiple />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <ChartAreaLinear />
            </div>
          </div>

          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl">
                <ChartBarLabelCustom />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
               <ChartBarMultiple />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <ChartAreaLegend />
            </div>
          </div>

          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="bg-muted/50 aspect-video rounded-xl">
              <ChartRadarDots />
            </div>
            
            <div className="bg-muted/50 aspect-video rounded-xl">
              <ChartPieInteractive />
            </div>
          </div>
          
          

        </div>
  );
};

export default Dashboard;
