declare module 'react-native-chart-kit' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';

  export interface ChartConfig {
    color?: (opacity?: number) => string;
    labelColor?: (opacity?: number) => string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
  }

  export interface PieChartProps extends ViewProps {
    data: Array<{
      name: string;
      population: number;
      color: string;
      legendFontColor?: string;
      legendFontSize?: number;
    }>;
    width: number;
    height: number;
    accessor: string;
    backgroundColor?: string;
    paddingLeft?: string;
    chartConfig: ChartConfig;
    absolute?: boolean;
  }

  export const PieChart: ComponentType<PieChartProps>;
}

